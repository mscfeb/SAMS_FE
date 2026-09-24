import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getSections = (params) => listAcademic("sections", params);
export const createSection = (payload) => createAcademic("sections", payload);
export const updateSection = (id, payload) => updateAcademic("sections", id, payload);
export const deleteSection = (id) => deleteAcademic("sections", id);
