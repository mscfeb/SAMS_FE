export function dashboardPathForRole(role) {
  return role === "ADMIN" ? "/admin" : role === "FACULTY" ? "/faculty" : "/student";
}

export function roleLabel(role) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}
