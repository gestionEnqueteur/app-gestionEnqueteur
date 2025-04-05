import { formatMillisecondsToH_M } from "../../helpers/timeHelper";

describe("formatMillisecondsToH_M", () => {
  it("should return '0h05' for 5 minutes", () => {
    const input = 5 * 60 * 1000;
    expect(formatMillisecondsToH_M(input)).toBe("0h05");
  });

  it("should return '1h00' for 60 minutes", () => {
    const input = 60 * 60 * 1000;
    expect(formatMillisecondsToH_M(input)).toBe("1h00");
  });

  it("should return '2h30' for 2h30", () => {
    const input = (2 * 60 + 30) * 60 * 1000;
    expect(formatMillisecondsToH_M(input)).toBe("2h30");
  });

  it("should return '0h00' for 0", () => {
    expect(formatMillisecondsToH_M(0)).toBe("0h00");
  });
});
