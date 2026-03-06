import { validateProspect } from "../prospect-helpers";
import { formatSalary, parseSalaryToStorageFormat } from "@shared/schema";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });

  test("accepts a valid prospect with salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: "$120,000",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect with no salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect with null salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect with empty string salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: "",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects salary with no digits", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: "$,,",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must contain at least one digit");
  });

  test("accepts coffeeChat as true", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      coffeeChat: true,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts coffeeChat as false", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      coffeeChat: false,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts prospect without coffeeChat field", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts coffeeChat as null", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      coffeeChat: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects coffeeChat as non-boolean", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      coffeeChat: "yes" as unknown,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Coffee chat must be a boolean value");
  });
});

describe("formatSalary", () => {
  test("formats plain digits with $ and commas", () => {
    expect(formatSalary("100000")).toBe("$100,000");
  });

  test("formats a number with existing $ and commas", () => {
    expect(formatSalary("$100,000")).toBe("$100,000");
  });

  test("handles small numbers without commas", () => {
    expect(formatSalary("500")).toBe("$500");
  });

  test("handles millions", () => {
    expect(formatSalary("1000000")).toBe("$1,000,000");
  });

  test("strips non-digit characters and reformats", () => {
    expect(formatSalary("abc123def456")).toBe("$123,456");
  });

  test("returns empty string for empty input", () => {
    expect(formatSalary("")).toBe("");
  });

  test("returns empty string for input with no digits", () => {
    expect(formatSalary("$,,")).toBe("");
  });
});

describe("parseSalaryToStorageFormat", () => {
  test("converts plain number to formatted string", () => {
    expect(parseSalaryToStorageFormat("100000")).toBe("$100,000");
  });

  test("normalizes already-formatted salary", () => {
    expect(parseSalaryToStorageFormat("$100,000")).toBe("$100,000");
  });

  test("returns null for empty string", () => {
    expect(parseSalaryToStorageFormat("")).toBeNull();
  });

  test("returns null for string with no digits", () => {
    expect(parseSalaryToStorageFormat("$,,")).toBeNull();
  });

  test("strips non-digit chars and formats", () => {
    expect(parseSalaryToStorageFormat("$85k")).toBe("$85");
  });
});
