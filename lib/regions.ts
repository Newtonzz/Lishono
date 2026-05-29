// Diaspora + homeland region tags (flag = where the variant is heard).
// Ported from the design dataset.

export interface Region {
  id: string;
  name: string;
  syr: string;
  flag: string;
  note?: string;
}

export const REGIONS: Record<string, Region> = {
  turabdin: { id: "turabdin", name: "Tur Abdin", syr: "ܛܘܪ ܥܒܕܝܢ", flag: "🇹🇷", note: "the homeland — limestone plateau of SE Turkey" },
  midyat: { id: "midyat", name: "Midyat", syr: "ܡܕܝܕ", flag: "🇹🇷" },
  midin: { id: "midin", name: "Midin", syr: "ܡܕܢ", flag: "🇹🇷" },
  kfarze: { id: "kfarze", name: "Kfarze", syr: "ܟܦܪܙܐ", flag: "🇹🇷" },
  anhil: { id: "anhil", name: "Anhil", syr: "ܐܢܚܠ", flag: "🇹🇷" },
  qamishli: { id: "qamishli", name: "Qamishli", syr: "ܩܡܫܠܝ", flag: "🇸🇾" },
  sodertalje: { id: "sodertalje", name: "Södertälje", syr: "ܣܘܕܪܬܠܝܐ", flag: "🇸🇪", note: "largest diaspora community" },
  guterloh: { id: "guterloh", name: "Gütersloh", syr: "ܓܘܬܪܣܠܘ", flag: "🇩🇪" },
  enschede: { id: "enschede", name: "Enschede", syr: "ܐܢܣܟܕܐ", flag: "🇳🇱" },
};

// Order shown in the homepage "From the regions" strip.
export const REGION_ORDER = ["turabdin", "midyat", "qamishli", "sodertalje", "enschede", "guterloh"];
