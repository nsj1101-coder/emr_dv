import { redirect } from "next/navigation";

export default function Home() {
  // TODO: 인증 상태 확인 후 분기
  redirect("/login");
}
