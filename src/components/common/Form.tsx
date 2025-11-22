import React from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// 타입 정의
export type FormType = "product" | "experience" | "board";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "file";
  required?: boolean;
  placeholder?: string;
  // 기타 옵션 필요시 확장
}

interface FormProps {
  type: FormType;
  fields: FieldConfig[];
  onSubmit: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  submitText?: string;
  children?: React.ReactNode;
}

// type별 특수 필드 하위 컴포넌트 예시 (확장성 고려)
function ProductFields() {
  // 상품 전용 필드 예시 (필요시 확장)
  return null;
}
function ExperienceFields() {
  // 체험 전용 필드 예시 (필요시 확장)
  return null;
}
function BoardFields() {
  // 게시판 전용 필드 예시 (필요시 확장)
  return null;
}

export const Form: React.FC<FormProps> = ({
  type,
  fields,
  onSubmit,
  initialValues = {},
  submitText = "등록",
  children,
}) => {
  const [values, setValues] =
    React.useState<Record<string, any>>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type: inputType, files } = e.target as any;
    setValues((prev) => ({
      ...prev,
      [name]: inputType === "file" ? files?.[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  // type별 특수 필드 분리 렌더링
  const renderTypeFields = () => {
    switch (type) {
      case "product":
        return <ProductFields />;
      case "experience":
        return <ExperienceFields />;
      case "board":
        return <BoardFields />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 공통 필드 렌더링 */}
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block mb-1 font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              value={values[field.name] || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={
                field.type === "file" ? undefined : values[field.name] || ""
              }
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          )}
        </div>
      ))}

      {/* type별 특수 필드 */}
      {renderTypeFields()}

      {/* slot/children 영역 (지도, 파일 업로드 등 확장) */}
      {children}

      <Button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {submitText}
      </Button>
    </form>
  );
};
