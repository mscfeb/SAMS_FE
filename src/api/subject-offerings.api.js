import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getSubjectOfferings = (params) => listAcademic("subject-offerings", params);
export const createSubjectOffering = (payload) => createAcademic("subject-offerings", payload);
export const updateSubjectOffering = (id, payload) => updateAcademic("subject-offerings", id, payload);
export const deleteSubjectOffering = (id) => deleteAcademic("subject-offerings", id);
