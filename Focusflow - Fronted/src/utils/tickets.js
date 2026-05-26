const userTimeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Bogota";

export function parseUtcDateTime(dateString) {
  if (!dateString) return null;
  const normalized = String(dateString).includes("T")
    ? String(dateString)
    : String(dateString).replace(" ", "T");
  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  const date = new Date(hasTimeZone ? normalized : `${normalized}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTicketDate(dateString, { includeTime = false } = {}) {
  const date = parseUtcDateTime(dateString);
  if (!date) return dateString;

  return date.toLocaleDateString("es-CO", {
    timeZone: userTimeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  });
}

export function formatTicketTime(dateString) {
  const date = parseUtcDateTime(dateString);
  if (!date) return "";

  return date.toLocaleTimeString("es-CO", {
    timeZone: userTimeZone,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function translateTicketStatus(status) {
  return (
    {
      open: "Abierto",
      in_progress: "En Revision",
      resolved: "Resuelto",
      closed: "Cerrado",
    }[status] ?? status
  );
}

export function translateTicketCategory(category, labels = {}) {
  return (
    {
      general: "General",
      technical: "Tecnico",
      billing: "Pagos",
      feature_request: "Sugerencia",
      ...labels,
    }[category] ?? category
  );
}

export function translateTicketPriority(priority) {
  return (
    {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      urgent: "Urgente",
    }[priority] ?? priority
  );
}

export function getTicketStatusClass(status) {
  return (
    {
      open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      in_progress:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      resolved:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    }[status] ??
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
  );
}

export function getTicketCategoryIcon(category) {
  return (
    {
      general: "description",
      technical: "build_circle",
      billing: "paid",
      feature_request: "lightbulb",
    }[category] || "description"
  );
}

export function getTicketCategoryIconClass(category) {
  return (
    {
      general: "category-general",
      technical: "category-technical",
      billing: "category-billing",
      feature_request: "category-feature_request",
    }[category] || "category-general"
  );
}

export function normalizeTicket(ticket, options = {}) {
  return {
    ...ticket,
    displayDate: formatTicketDate(ticket.fechaCreacion, options),
    displayStatus: translateTicketStatus(ticket.estado),
    displayCategory: translateTicketCategory(
      ticket.categoria,
      options.categoryLabels,
    ),
    ...(options.includePriority
      ? { displayPriority: translateTicketPriority(ticket.prioridad) }
      : {}),
  };
}
