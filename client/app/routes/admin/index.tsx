import { redirect } from "react-router";
import type { Route } from "./+types/index";

export function loader() {
    return redirect("/admin/dashboard");
}

export default function AdminIndex() {
    return null;
}
