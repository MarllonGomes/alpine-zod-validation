import { z, ZodType as V, ZodObject as w } from "zod";
import { merge as S } from "lodash";
const y = function(a) {
  a.magic("z", () => z), a.magic("zValidation", (e) => {
    const { zValidateSchema: s } = a.$data(e), t = l(e, { errors: {}, successes: [] });
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
        this.reset();
        const r = s.safeParse(u(e, !0)), o = f(r.error), n = Object.keys(s.shape).filter((c) => !Object.keys(o).includes(c));
        return t.errors = o, t.successes = n, r.success;
      },
      validateOnly(r) {
        if (!s.shape || !(r in s.shape))
          return console.warn(`No validation schema defined for the field: ${r}`), !1;
        const o = { [r]: u(e, !0)[r] }, c = s.shape[r].safeParse(o[r]);
        return c.success ? (delete t.errors[r], t.successes.includes(r) || t.successes.push(r), !0) : (t.successes = t.successes.filter((i) => i !== r), t.errors[r] = c.error.format()._errors[0] ?? "", !1);
      }
    };
  });
  const d = (e) => a.$data(e).$id(), m = (e) => window.zValidation[d(e)] ?? a.reactive({ errors: {}, successes: [] }), l = (e, s) => (window.zValidation = window.zValidation ?? {}, window.zValidation[d(e)] = S(m(e), s), window.zValidation[d(e)]), u = (e, s = !1) => {
    const t = a.$data(e);
    return s ? JSON.parse(JSON.stringify(t)) : t;
  }, h = (e) => {
    if (typeof e != "object")
      throw new Error("ZValidate: x-data must be an object to use the zvalidate directive.");
    if (!e.zValidateSchema)
      throw new Error("ZValidate: zValidateSchema property is required on x-data model.");
    if (!(e.zValidateSchema instanceof V) || !(e.zValidateSchema instanceof w))
      throw new Error("ZValidate: zValidateSchema must be an instance of a Zod object.");
  }, f = (e) => Object.entries(e?.format() ?? {}).reduce((s, [t, r]) => (t !== "_errors" && Array.isArray(r._errors) && (s[t] = r._errors[0]), s), {});
  a.directive("zvalidate", (e, { expression: s }, { effect: t, cleanup: r }) => {
    t(() => {
      const o = u(e);
      if (h(o), s) {
        const n = (c) => {
          const i = c.target.getAttribute("x-model");
          i && a.$data(e).$zValidation.validateOnly(i);
        };
        e.addEventListener(s, n), r(() => e.removeEventListener(s, n));
      }
    });
  });
};
export {
  y as z
};
//# sourceMappingURL=zValidation-BwfXwmQ7.js.map
