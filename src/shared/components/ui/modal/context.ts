import type { InjectionKey } from 'vue'

/** Provided by <Modal> so descendants (e.g. <ModalClose>) can request a close. */
export const MODAL_CLOSE_KEY: InjectionKey<() => void> = Symbol('modal-close')
