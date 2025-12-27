import { createRemixHandler } from '@yukinu/uploadthing'

const handler = createRemixHandler()
export const loader = handler.loader
export const action = handler.action
