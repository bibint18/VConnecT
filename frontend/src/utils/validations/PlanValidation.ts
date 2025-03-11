import { toast } from "react-toastify";

interface PlanFormData {
  name: string;
  type: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: string;
}

export const validatePlanForm = (formData: PlanFormData): boolean => {
  const isValid = true;

  // Required fields check
  if (!formData.name.trim()) {
    toast.error("Plan name is required");
    return false;
  }
  if (!formData.type.trim()) {
    toast.error("Plan type is required");
    return false;
  }
  if (!formData.description.trim()) {
    toast.error("Description is required");
    return false;
  }
  if (!formData.duration.trim()) {
    toast.error("Duration is required");
    return false;
  }

  // Validate Benefits
  const validBenefits = formData.benefits
    .map((b) => b.trim()) // Remove spaces
    .filter((b) => b.length > 0); // Remove empty lines

  if (validBenefits.length === 0) {
    toast.error("At least one benefit is required");
    return false;
  }

  for (const benefit of validBenefits) {
    if (benefit.length < 3) {
      toast.error("Each benefit must have at least 3 characters");
      return false;
    }
  }

  // No spaces allowed in name and type
  if (/\s/.test(formData.name)) {
    toast.error("No spaces allowed in plan name");
    return false;
  }
  if (/\s/.test(formData.type)) {
    toast.error("No spaces allowed in plan type");
    return false;
  }

  // Regular amount should be greater than discount amount
  if (Number(formData.regularAmount) <= Number(formData.discountAmount)) {
    toast.error("Regular amount must be greater than discount amount");
    return false;
  }

  return isValid;
};