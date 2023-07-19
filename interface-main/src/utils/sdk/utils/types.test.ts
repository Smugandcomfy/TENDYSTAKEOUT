import { isValidUrl } from "./type";

describe("#types", () => {
  it("is valid url", () => {
    expect(isValidUrl("abc")).toEqual(false);

    expect(isValidUrl("http://twitter.com")).toEqual(true);

    expect(isValidUrl("https://twitter.com")).toEqual(true);

    expect(isValidUrl("htt//twitter.com")).toEqual(false);

    expect(isValidUrl("http//twitter.com")).toEqual(false);

    expect(isValidUrl("http:twitter.com")).toEqual(false);

    expect(isValidUrl("www.twitter.com")).toEqual(false);
  });
});
