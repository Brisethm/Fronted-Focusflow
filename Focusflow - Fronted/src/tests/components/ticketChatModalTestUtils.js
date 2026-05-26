import { mount } from "@vue/test-utils";
import BaseTicketChatModal from "../../components/support/BaseTicketChatModal.vue";

export const baseTicket = {
  asunto: "Error de prueba",
  descripcion: "Descripcion de prueba",
  estado: "open",
  fechaCreacion: "2023-10-10T10:00:00Z",
};

export function mountChatModal(component, ticket) {
  const wrapper = mount(component, {
    props: { ticket },
  });

  return {
    wrapper,
    chat: () => wrapper.findComponent(BaseTicketChatModal),
  };
}
