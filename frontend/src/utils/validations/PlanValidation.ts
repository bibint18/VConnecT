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
  roomBenefit:number;
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
  if (formData.roomBenefit === undefined || formData.roomBenefit === null) {
    toast.error('Room benefit is required');
    return false;
  }
  if (!Number.isInteger(formData.roomBenefit)) {
    toast.error('Room benefit must be an integer');
    return false;
  }
  if (formData.roomBenefit < 0) {
    toast.error('Room benefit cannot be negative');
    return false;
  }
  if (formData.roomBenefit > 20) {
    toast.error('Room benefit cannot exceed 20');
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
  if (!formData.type || !['paid', 'free'].includes(formData.type)) {
    toast.error('Please select a valid type (Paid or Free)');
    return false;
  }

  // CHANGED: Updated duration validation
  if (!formData.duration || !['1 month', '3 months', '6 months', '9 months', '12 months'].includes(formData.duration)) {
    toast.error('Please select a valid duration');
    return false;
  }

  // Regular amount should be greater than discount amount
  if (Number(formData.regularAmount) <= Number(formData.discountAmount)) {
    toast.error("Regular amount must be greater than discount amount");
    return false;
  }

  return isValid;
};