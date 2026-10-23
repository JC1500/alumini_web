
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/sessions";
import ProfileForm from "@/app/me/profile-form";

export const dynamic = "force-dynamic";

export default async function CompleteProfilePage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  if (
    !user.emailVerified ||
    !user.collegeEmailVerified ||
    user.status === "PENDING_COLLEGE_VERIFICATION"
  ) {
    redirect("/verify-college-email");
  }

  if (user.status === "ACTIVE") {
    redirect("/feed");
  }

  if (user.status !== "PENDING_PROFILE_COMPLETION") {
    redirect("/sign-in");
  }

  const academicIdentity = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      degreeCode: true,
      degreeName: true,
      enrollmentYear: true,
      academicDepartmentCode: true,
      rollNumber: true,
      expectedGraduationYear: true,
      collegeEmail: true,
      collegeEmailVerified: true,
    },
  });

  if (
    !academicIdentity ||
    !academicIdentity.collegeEmailVerified ||
    !academicIdentity.degreeCode ||
    !academicIdentity.degreeName ||
    academicIdentity.enrollmentYear === null ||
    !academicIdentity.academicDepartmentCode ||
    !academicIdentity.rollNumber ||
    academicIdentity.expectedGraduationYear === null
  ) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-2xl font-bold">
          Academic details unavailable
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          We couldn't load the academic details associated with your
          verified college email. Please contact support before continuing.
        </p>
      </main>
    );
  }

  const profile = await prisma.alumniProfile.findUnique({
    where: { userId: user.id },
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-black dark:text-gray-100 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            Complete your alumni profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your college email is verified. Complete the remaining
            required details to activate your Alumini account.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
          <h2 className="font-semibold">
            Academic identity from your college email
          </h2>

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">College email</dt>
              <dd className="mt-1 break-all font-medium">
                {academicIdentity.collegeEmail}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">Degree</dt>
              <dd className="mt-1 font-medium">
                {academicIdentity.degreeName} ({academicIdentity.degreeCode})
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">Enrollment year</dt>
              <dd className="mt-1 font-medium">
                {academicIdentity.enrollmentYear}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">Department code</dt>
              <dd className="mt-1 font-medium">
                {academicIdentity.academicDepartmentCode}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">Roll number</dt>
              <dd className="mt-1 font-medium">
                {academicIdentity.rollNumber}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Expected passing year
              </dt>
              <dd className="mt-1 font-medium">
                {academicIdentity.expectedGraduationYear}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
            These details are derived from your college email and cannot
            be changed through the profile form.
          </p>
        </section>

        <ProfileForm
          profile={profile}
          academicIdentity={{
            degreeCode: academicIdentity.degreeCode,
            degreeName: academicIdentity.degreeName,
            enrollmentYear: academicIdentity.enrollmentYear,
            academicDepartmentCode:
              academicIdentity.academicDepartmentCode,
            rollNumber: academicIdentity.rollNumber,
            expectedGraduationYear:
              academicIdentity.expectedGraduationYear,
          }}
        />
      </div>
    </main>
  );
}
