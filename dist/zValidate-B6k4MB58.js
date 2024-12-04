import { z, ZodType as w, ZodObject as V } from "zod";
import { merge as v } from "lodash";
const g = function(a) {
  a.magic("z", () => z), a.magic("zvalidation", (e) => {
    const { zValidateSchema: s } = a.$data(e), t = f(e, { errors: {}, successes: [] });
    return {
      isValid(r) {
        return t.successes.includes(r);
      },
      isInvalid(r) {
        return Object.keys(t.errors).includes(r);
      },
      getError(r) {
        return t.errors[r] ?? null;
      },
      getErrors() {
        return t.errors;
      },
      reset() {
        t.errors = {}, t.successes = [];
      },
      validate() {
        const r = s.safeParse(o(e, !0));
        return this.reset(), r.success ? (t.successes = Object.keys(o(e, !0)), !0) : (t.errors = h(r.error), !1);
      },
      validateOnly(r) {
        if (!s.shape || !(r in s.shape))
          return console.warn(`No validation schema defined for the field: ${r}`), !1;
        const d = { [r]: o(e, !0)[r] }, c = s.shape[r].safeParse(d[r]);
        return c.success ? (delete t.errors[r], t.successes.includes(r) || t.successes.push(r), !0) : (t.successes = t.successes.filter((i) => i !== r), t.errors[r] = c.error.format()._errors[0] ?? "", !1);
      }
    };
  });
  const n = (e) => a.$data(e).$id(), m = (e) => window.zValidate[n(e)] ?? a.reactive({ errors: {}, successes: [] }), f = (e, s) => (window.zValidate = window.zValidate ?? {}, window.zValidate[n(e)] = v(m(e), s), window.zValidate[n(e)]), o = (e, s = !1) => {
    const t = a.$data(e);
    return s ? JSON.parse(JSON.stringify(t)) : t;
  }, l = (e) => {
    if (typeof e != "object")
      throw new Error("ZValidate: x-data must be an object to use the zvalidate directive.");
    if (!e.zValidateSchema)
      throw new Error("ZValidate: zValidateSchema property is required on x-data model.");
    if (!(e.zValidateSchema instanceof w) || !(e.zValidateSchema instanceof V))
      throw new Error("ZValidate: zValidateSchema must be an instance of a Zod object.");
  }, h = (e) => Object.entries(e.format()).reduce((s, [t, r]) => (t !== "_errors" && Array.isArray(r._errors) && (s[t] = r._errors[0]), s), {});
  a.directive("zvalidate", (e, { expression: s }, { effect: t, cleanup: r }) => {
    t(() => {
      const d = o(e);
      if (l(d), s) {
        const u = (c) => {
          const i = c.target.getAttribute("x-model");
          i && a.$data(e).$zvalidation.validateOnly(i);
        };
        e.addEventListener(s, u), r(() => e.removeEventListener(s, u));
      }
    });
  });
};
export {
  g as z
};
//# sourceMappingURL=zValidate-B6k4MB58.js.map
