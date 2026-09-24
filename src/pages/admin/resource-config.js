import { listAcademic } from "../../api/academic.api.js";
import { StatusBadge } from "../../components/StatusBadge.jsx";

const relation = (name, label, endpoint, getLabel) => ({
  name,
  label,
  type: "select",
  options: [],
  endpoint,
  getLabel
});

export const resourceConfigs = {
  departments: {
    title: "Departments", description: "Maintain the institution's academic departments.", singular: "Department", deleteLabel: "Delete", searchPlaceholder: "Search code or name", columns: [{ key: "code", label: "Code" }, { key: "name", label: "Name" }, { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() }], fields: [{ name: "code", label: "Code" }, { name: "name", label: "Name" }]
  },
  academicYears: {
    title: "Academic Years", description: "Keep academic cycles and their active status current.", singular: "Academic Year", path: "academic-years", deleteLabel: "Delete", columns: [{ key: "name", label: "Name" }, { key: "startDate", label: "Starts", render: (row) => String(row.startDate).slice(0, 10) }, { key: "endDate", label: "Ends", render: (row) => String(row.endDate).slice(0, 10) }, { key: "isActive", label: "Status", render: (row) => StatusBadge({ value: row.isActive ? "ACTIVE" : "INACTIVE" }) }], fields: [{ name: "name", label: "Name" }, { name: "startDate", label: "Start date", type: "date" }, { name: "endDate", label: "End date", type: "date" }, { name: "isActive", label: "Active", type: "checkbox", required: false, defaultValue: true }]
  },
  sections: {
    title: "Sections", description: "Connect sections to departments and academic years.", singular: "Section", deleteLabel: "Delete", filters: ["departmentId", "academicYearId"], columns: [{ key: "name", label: "Section" }, { key: "program", label: "Program" }, { key: "semester", label: "Semester" }, { key: "department", label: "Department", render: (row) => row.department?.code }], fields: [{ name: "name", label: "Name" }, { name: "program", label: "Program" }, { name: "semester", label: "Semester", type: "number", min: 1 }, relation("departmentId", "Department", "departments", (item) => `${item.code} · ${item.name}`), relation("academicYearId", "Academic year", "academic-years", (item) => item.name)]
  },
  students: {
    title: "Students", description: "Manage student identities, sections, and departments.", singular: "Student", deleteLabel: "Deactivate", filters: ["departmentId", "sectionId"], columns: [{ key: "studentNumber", label: "Student number" }, { key: "name", label: "Student", render: (row) => `${row.firstName} ${row.lastName}` }, { key: "email", label: "Email", render: (row) => row.user?.email }, { key: "section", label: "Section", render: (row) => row.section?.name }, { key: "status", label: "Status", render: (row) => StatusBadge({ value: row.user?.isActive ? "ACTIVE" : "INACTIVE" }) }], fields: [{ name: "email", label: "Email", type: "email" }, { name: "studentNumber", label: "Student number" }, { name: "firstName", label: "First name" }, { name: "lastName", label: "Last name" }, relation("departmentId", "Department", "departments", (item) => `${item.code} · ${item.name}`), relation("sectionId", "Section", "sections", (item) => `${item.name} · ${item.program}`)]
  },
  faculty: {
    title: "Faculty", description: "Manage faculty identities and department assignments.", singular: "Faculty member", deleteLabel: "Deactivate", filters: ["departmentId"], columns: [{ key: "employeeNumber", label: "Employee number" }, { key: "name", label: "Faculty", render: (row) => `${row.firstName} ${row.lastName}` }, { key: "email", label: "Email", render: (row) => row.user?.email }, { key: "department", label: "Department", render: (row) => row.department?.code }, { key: "status", label: "Status", render: (row) => StatusBadge({ value: row.user?.isActive ? "ACTIVE" : "INACTIVE" }) }], fields: [{ name: "email", label: "Email", type: "email" }, { name: "employeeNumber", label: "Employee number" }, { name: "firstName", label: "First name" }, { name: "lastName", label: "Last name" }, relation("departmentId", "Department", "departments", (item) => `${item.code} · ${item.name}`)]
  },
  subjects: {
    title: "Subjects", description: "Maintain subject codes, names, credits, and ownership.", singular: "Subject", deleteLabel: "Delete", filters: ["departmentId"], columns: [{ key: "code", label: "Code" }, { key: "name", label: "Name" }, { key: "credits", label: "Credits" }, { key: "department", label: "Department", render: (row) => row.department?.code }], fields: [{ name: "code", label: "Code" }, { name: "name", label: "Name" }, { name: "credits", label: "Credits", type: "number", min: 1, max: 20 }, relation("departmentId", "Department", "departments", (item) => `${item.code} · ${item.name}`)]
  },
  subjectOfferings: {
    title: "Subject Offerings", description: "Assign subjects, faculty, sections, and academic years.", singular: "Subject offering", path: "subject-offerings", deleteLabel: "Delete", columns: [{ key: "subject", label: "Subject", render: (row) => `${row.subject?.code} · ${row.subject?.name}` }, { key: "faculty", label: "Faculty", render: (row) => `${row.faculty?.employeeNumber} · ${row.faculty?.firstName} ${row.faculty?.lastName}` }, { key: "section", label: "Section", render: (row) => row.section?.name }, { key: "academicYear", label: "Academic year", render: (row) => row.academicYear?.name }, { key: "semester", label: "Semester" }], fields: [relation("subjectId", "Subject", "subjects", (item) => `${item.code} · ${item.name}`), relation("facultyId", "Faculty", "faculty", (item) => `${item.employeeNumber} · ${item.firstName} ${item.lastName}`), relation("sectionId", "Section", "sections", (item) => `${item.name} · ${item.program}`), relation("academicYearId", "Academic year", "academic-years", (item) => item.name), { name: "semester", label: "Semester", type: "number", min: 1 }]
  },
  enrollments: {
    title: "Enrollments", description: "Manage student participation in subject offerings.", singular: "Enrollment", path: "enrollments", deleteLabel: "Drop", filters: ["status"], columns: [{ key: "student", label: "Student", render: (row) => `${row.student?.studentNumber} · ${row.student?.firstName} ${row.student?.lastName}` }, { key: "subjectOffering", label: "Offering", render: (row) => `${row.subjectOffering?.subject?.code} · ${row.subjectOffering?.subject?.name}` }, { key: "status", label: "Status", render: (row) => StatusBadge({ value: row.status }) }], fields: [relation("studentId", "Student", "students", (item) => `${item.studentNumber} · ${item.firstName} ${item.lastName}`), relation("subjectOfferingId", "Subject offering", "subject-offerings", (item) => `${item.subject?.code} · ${item.section?.name}`), { name: "status", label: "Status", type: "select", options: [{ value: "ACTIVE", label: "Active" }, { value: "DROPPED", label: "Dropped" }, { value: "COMPLETED", label: "Completed" }] }]
  }
};

export async function loadOptions(field) {
  const result = await listAcademic(field.endpoint, { page: 1, limit: 100 });
  return result.items.map((item) => ({ value: item.id, label: field.getLabel(item) }));
}
