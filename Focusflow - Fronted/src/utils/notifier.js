export const scheduleNotification = (rec, callback) => {
  const fechaHora = rec.fecha_hora ?? rec.fechaHora;
  const idRecordatorio = rec.id_recordatorio ?? rec.idRecordatorio ?? rec.id;
  const ahora = Date.now();
  const tiempoDestino = new Date(fechaHora).getTime();
  const diferenciaMs = tiempoDestino - ahora;

  if (diferenciaMs > 0) {
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("FocusFlow", {
          body: rec.mensaje,
          icon: "/icon.svg",
        });
      }
      if (callback) callback(idRecordatorio);
    }, diferenciaMs);
  }
};
