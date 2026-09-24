import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getFaculty = (params) => listAcademic("faculty", params);
export const createFaculty = (payload) => createAcademic("faculty", payload);
export const updateFaculty = (id, payload) => updateAcademic("faculty", id, payload);
export const deactivateFaculty = (id) => deleteAcademic("faculty", id);
