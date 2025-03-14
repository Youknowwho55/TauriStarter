/** @format */

export const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, "/login");
  }

  return {
    user: locals.user,
  };
};
