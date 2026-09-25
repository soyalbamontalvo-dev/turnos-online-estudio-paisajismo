const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const key of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'Event', 'StorageEvent']) global[key] = dom.window[key];
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
HTMLElement.prototype.scrollIntoView = () => {};
const RealDate = Date;
global.Date = class extends RealDate {
  constructor(...args) { super(...(args.length ? args : ['2026-09-25T12:00:00Z'])); }
  static now() { return new RealDate('2026-09-25T12:00:00Z').getTime(); }
};
require.extensions['.tsx'] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};
require.extensions['.css'] = (module) => { module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : String(key) }); };
const React = require('react');
const { render, screen, fireEvent, cleanup, act } = require('@testing-library/react');
const Home = require('../app/page.tsx').default;
const Dashboard = require('../app/dashboard/page.tsx').default;
const APPOINTMENTS = 'paisajismo-demo-appointments';
const BLOCKS = 'paisajismo-demo-blocks';
const read = (key) => JSON.parse(window.localStorage.getItem(key) || '[]');
const write = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));
const externalBooking = { id: 'qa-other-tab', code: 'QA-OTHER', clientName: 'Reserva de otra pestaña', serviceId: 'diagnostico', professionalId: 'lucia', date: '2026-09-26', time: '10:30', status: 'confirmado' };
beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

function blockForm(date = '2026-09-26', time = '10:30') {
  fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: date } });
  fireEvent.change(screen.getByLabelText('Hora'), { target: { value: time } });
  fireEvent.change(screen.getByLabelText('Motivo'), { target: { value: 'Prueba QA' } });
}

test('confirmation keeps the booked date after navigating to another day', () => {
  render(React.createElement(Home));
  fireEvent.click(screen.getByRole('button', { name: /09:00\s*Disponible/ }));
  fireEvent.change(screen.getByLabelText('Nombre y apellidos'), { target: { value: 'Prueba QA' } });
  fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '+504 9999 0000' } });
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'qa@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }));
  fireEvent.click(screen.getByRole('button', { name: /sáb\s*26\s*sept/ }));
  const confirmation = document.getElementById('confirmation').textContent;
  assert.match(confirmation, /viernes, 25 de septiembre/);
  assert.doesNotMatch(confirmation, /sábado, 26/);
  assert.equal(read(APPOINTMENTS).find(a => a.clientName === 'Prueba QA').date, '2026-09-25');
});

test('dashboard rejects blocking a slot booked in another tab before its storage event arrives', () => {
  render(React.createElement(Dashboard));
  write(APPOINTMENTS, [...read(APPOINTMENTS), externalBooking]);
  blockForm();
  fireEvent.click(screen.getByRole('button', { name: 'Bloquear horario' }));
  assert.match(screen.getByRole('alert').textContent, /cita activa/);
  assert.equal(read(BLOCKS).some(b => b.date === externalBooking.date && b.time === externalBooking.time), false);
});

test('updating a status preserves a newly booked appointment from another tab', () => {
  render(React.createElement(Dashboard));
  write(APPOINTMENTS, [...read(APPOINTMENTS), externalBooking]);
  fireEvent.change(screen.getAllByLabelText('Estado')[0], { target: { value: 'cancelado' } });
  assert.ok(read(APPOINTMENTS).some(a => a.id === externalBooking.id));
});

test('reactivating a cancelled appointment checks newly created blocks', () => {
  render(React.createElement(Dashboard));
  const target = read(APPOINTMENTS).find(a => a.id === 'demo-06');
  const changed = read(APPOINTMENTS).map(a => a.id === target.id ? { ...a, status: 'cancelado' } : a);
  write(APPOINTMENTS, changed);
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: APPOINTMENTS, newValue: JSON.stringify(changed) })));
  write(BLOCKS, [...read(BLOCKS), { id: 'other-block', professionalId: target.professionalId, date: target.date, time: target.time, reason: 'Otra pestaña' }]);
  const article = screen.getByRole('heading', { name: target.clientName }).closest('article');
  fireEvent.change(article.querySelector('select'), { target: { value: 'confirmado' } });
  assert.equal(read(APPOINTMENTS).find(a => a.id === target.id).status, 'cancelado');
  assert.match(screen.getByRole('status').textContent, /ocupado o bloqueado/);
});

test('removing a block preserves blocks added in another tab', () => {
  render(React.createElement(Dashboard));
  blockForm();
  fireEvent.click(screen.getByRole('button', { name: 'Bloquear horario' }));
  const extra = { id: 'other-block', professionalId: 'mateo', date: '2026-09-26', time: '14:00', reason: 'Otra pestaña' };
  write(BLOCKS, [...read(BLOCKS), extra]);
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar bloqueo' }));
  assert.ok(read(BLOCKS).some(b => b.id === extra.id));
});

test('dashboard refreshes when another tab changes or clears storage', () => {
  render(React.createElement(Dashboard));
  write(APPOINTMENTS, [...read(APPOINTMENTS), externalBooking]);
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: APPOINTMENTS, newValue: window.localStorage.getItem(APPOINTMENTS) })));
  assert.ok(screen.getByRole('heading', { name: externalBooking.clientName }));
  window.localStorage.clear();
  act(() => window.dispatchEvent(new StorageEvent('storage', { key: null })));
  assert.equal(screen.queryByRole('heading', { name: externalBooking.clientName }), null);
});
