"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewPatientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">신규 환자 등록</h1>
          <p className="text-sm text-gray-500">새로운 환자 정보를 입력해주세요</p>
        </div>
      </div>

      <form className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input label="환자명 *" placeholder="홍길동" required />
              <Input label="주민등록번호" placeholder="000000-0000000" />
              <Input label="생년월일 *" type="date" required />
              <Select
                label="성별 *"
                options={[
                  { value: "", label: "선택하세요" },
                  { value: "MALE", label: "남성" },
                  { value: "FEMALE", label: "여성" },
                ]}
              />
              <Input label="연락처 *" placeholder="010-0000-0000" required />
              <Select
                label="혈액형"
                options={[
                  { value: "", label: "선택하세요" },
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* 보험 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>보험 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label="보험 유형"
                options={[
                  { value: "NATIONAL", label: "건강보험" },
                  { value: "MEDICAID", label: "의료급여" },
                  { value: "INDUSTRIAL", label: "산재보험" },
                  { value: "CAR", label: "자동차보험" },
                  { value: "SELF_PAY", label: "비급여(자비)" },
                ]}
              />
              <Input label="보험증번호" placeholder="보험증 번호 입력" />
            </div>
          </CardContent>
        </Card>

        {/* 주소 및 기타 */}
        <Card>
          <CardHeader>
            <CardTitle>추가 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input label="주소" placeholder="주소를 입력하세요" />
              <Textarea label="알레르기 정보" placeholder="알레르기 정보를 입력하세요 (예: 페니실린, 아스피린)" rows={2} />
              <Textarea label="메모" placeholder="특이사항이나 참고사항을 입력하세요" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/patients">
            <Button variant="outline">취소</Button>
          </Link>
          <Button type="submit">
            <Save size={18} className="mr-1" />
            환자 등록
          </Button>
        </div>
      </form>
    </div>
  );
}
