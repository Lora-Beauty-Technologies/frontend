import { redirect } from "next/navigation";
import { courseHref, courses } from "./_data/courses";

/** The demo opens straight into the learner's current classroom. */
export default function TelegramHomePage() {
  redirect(courseHref(courses[0]));
}
