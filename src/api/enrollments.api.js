import { listAcademic, createAcademic, updateAcademic, deleteAcademic } from "./academic.api.js";
export const getEnrollments = (params) => listAcademic("enrollments", params);
export const createEnrollment = (payload) => createAcademic("enrollments", payload);
export const updateEnrollment = (id, payload) => updateAcademic("enrollments", id, payload);
export const deleteEnrollment = (id) => deleteAcademic("enrollments", id);
