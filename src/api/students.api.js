import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getStudents = (params) => listAcademic("students", params);
export const createStudent = (payload) => createAcademic("students", payload);
export const updateStudent = (id, payload) => updateAcademic("students", id, payload);
export const deactivateStudent = (id) => deleteAcademic("students", id);
