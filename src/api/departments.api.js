import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getDepartments = (params) => listAcademic("departments", params);
export const createDepartment = (payload) => createAcademic("departments", payload);
export const updateDepartment = (id, payload) => updateAcademic("departments", id, payload);
export const deleteDepartment = (id) => deleteAcademic("departments", id);
