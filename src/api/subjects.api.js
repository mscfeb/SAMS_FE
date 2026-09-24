import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getSubjects = (params) => listAcademic("subjects", params);
export const createSubject = (payload) => createAcademic("subjects", payload);
export const updateSubject = (id, payload) => updateAcademic("subjects", id, payload);
export const deleteSubject = (id) => deleteAcademic("subjects", id);
