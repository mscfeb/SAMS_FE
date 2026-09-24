import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getAcademicYears = (params) => listAcademic("academic-years", params);
export const createAcademicYear = (payload) => createAcademic("academic-years", payload);
export const updateAcademicYear = (id, payload) => updateAcademic("academic-years", id, payload);
export const deleteAcademicYear = (id) => deleteAcademic("academic-years", id);
