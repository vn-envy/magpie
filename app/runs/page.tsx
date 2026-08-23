import { redirect } from "next/navigation";

export default function RunsRedirect() {
  redirect("/engineering?tab=runs");
}
