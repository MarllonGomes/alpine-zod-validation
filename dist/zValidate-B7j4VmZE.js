var Be = Object.defineProperty, We = Object.defineProperties;
var qe = Object.getOwnPropertyDescriptors;
var Ne = Object.getOwnPropertySymbols;
var Je = Object.prototype.hasOwnProperty, Ye = Object.prototype.propertyIsEnumerable;
var Ee = (r, e, t) => e in r ? Be(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, d = (r, e) => {
  for (var t in e || (e = {}))
    Je.call(e, t) && Ee(r, t, e[t]);
  if (Ne)
    for (var t of Ne(e))
      Ye.call(e, t) && Ee(r, t, e[t]);
  return r;
}, v = (r, e) => We(r, qe(e));
var E = (r, e, t) => new Promise((s, n) => {
  var a = (u) => {
    try {
      i(t.next(u));
    } catch (l) {
      n(l);
    }
  }, o = (u) => {
    try {
      i(t.throw(u));
    } catch (l) {
      n(l);
    }
  }, i = (u) => u.done ? s(u.value) : Promise.resolve(u.value).then(a, o);
  i((t = t.apply(r, e)).next());
});
var k;
(function(r) {
  r.assertEqual = (n) => n;
  function e(n) {
  }
  r.assertIs = e;
  function t(n) {
    throw new Error();
  }
  r.assertNever = t, r.arrayToEnum = (n) => {
    const a = {};
    for (const o of n)
      a[o] = o;
    return a;
  }, r.getValidEnumValues = (n) => {
    const a = r.objectKeys(n).filter((i) => typeof n[n[i]] != "number"), o = {};
    for (const i of a)
      o[i] = n[i];
    return r.objectValues(o);
  }, r.objectValues = (n) => r.objectKeys(n).map(function(a) {
    return n[a];
  }), r.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    const a = [];
    for (const o in n)
      Object.prototype.hasOwnProperty.call(n, o) && a.push(o);
    return a;
  }, r.find = (n, a) => {
    for (const o of n)
      if (a(o))
        return o;
  }, r.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && isFinite(n) && Math.floor(n) === n;
  function s(n, a = " | ") {
    return n.map((o) => typeof o == "string" ? `'${o}'` : o).join(a);
  }
  r.joinValues = s, r.jsonStringifyReplacer = (n, a) => typeof a == "bigint" ? a.toString() : a;
})(k || (k = {}));
var Te;
(function(r) {
  r.mergeShapes = (e, t) => d(d({}, e), t);
})(Te || (Te = {}));
const h = k.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), V = (r) => {
  switch (typeof r) {
    case "undefined":
      return h.undefined;
    case "string":
      return h.string;
    case "number":
      return isNaN(r) ? h.nan : h.number;
    case "boolean":
      return h.boolean;
    case "function":
      return h.function;
    case "bigint":
      return h.bigint;
    case "symbol":
      return h.symbol;
    case "object":
      return Array.isArray(r) ? h.array : r === null ? h.null : r.then && typeof r.then == "function" && r.catch && typeof r.catch == "function" ? h.promise : typeof Map != "undefined" && r instanceof Map ? h.map : typeof Set != "undefined" && r instanceof Set ? h.set : typeof Date != "undefined" && r instanceof Date ? h.date : h.object;
    default:
      return h.unknown;
  }
}, c = k.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), He = (r) => JSON.stringify(r, null, 2).replace(/"([^"]+)":/g, "$1:");
class S extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const t = e || function(a) {
      return a.message;
    }, s = { _errors: [] }, n = (a) => {
      for (const o of a.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(n);
        else if (o.code === "invalid_return_type")
          n(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          n(o.argumentsError);
        else if (o.path.length === 0)
          s._errors.push(t(o));
        else {
          let i = s, u = 0;
          for (; u < o.path.length; ) {
            const l = o.path[u];
            u === o.path.length - 1 ? (i[l] = i[l] || { _errors: [] }, i[l]._errors.push(t(o))) : i[l] = i[l] || { _errors: [] }, i = i[l], u++;
          }
        }
    };
    return n(this), s;
  }
  static assert(e) {
    if (!(e instanceof S))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, k.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const n of this.issues)
      n.path.length > 0 ? (t[n.path[0]] = t[n.path[0]] || [], t[n.path[0]].push(e(n))) : s.push(e(n));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
S.create = (r) => new S(r);
const Y = (r, e) => {
  let t;
  switch (r.code) {
    case c.invalid_type:
      r.received === h.undefined ? t = "Required" : t = `Expected ${r.expected}, received ${r.received}`;
      break;
    case c.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(r.expected, k.jsonStringifyReplacer)}`;
      break;
    case c.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${k.joinValues(r.keys, ", ")}`;
      break;
    case c.invalid_union:
      t = "Invalid input";
      break;
    case c.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${k.joinValues(r.options)}`;
      break;
    case c.invalid_enum_value:
      t = `Invalid enum value. Expected ${k.joinValues(r.options)}, received '${r.received}'`;
      break;
    case c.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case c.invalid_return_type:
      t = "Invalid function return type";
      break;
    case c.invalid_date:
      t = "Invalid date";
      break;
    case c.invalid_string:
      typeof r.validation == "object" ? "includes" in r.validation ? (t = `Invalid input: must include "${r.validation.includes}"`, typeof r.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${r.validation.position}`)) : "startsWith" in r.validation ? t = `Invalid input: must start with "${r.validation.startsWith}"` : "endsWith" in r.validation ? t = `Invalid input: must end with "${r.validation.endsWith}"` : k.assertNever(r.validation) : r.validation !== "regex" ? t = `Invalid ${r.validation}` : t = "Invalid";
      break;
    case c.too_small:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "more than"} ${r.minimum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at least" : "over"} ${r.minimum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${r.minimum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly equal to " : r.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(r.minimum))}` : t = "Invalid input";
      break;
    case c.too_big:
      r.type === "array" ? t = `Array must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "less than"} ${r.maximum} element(s)` : r.type === "string" ? t = `String must contain ${r.exact ? "exactly" : r.inclusive ? "at most" : "under"} ${r.maximum} character(s)` : r.type === "number" ? t = `Number must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "bigint" ? t = `BigInt must be ${r.exact ? "exactly" : r.inclusive ? "less than or equal to" : "less than"} ${r.maximum}` : r.type === "date" ? t = `Date must be ${r.exact ? "exactly" : r.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(r.maximum))}` : t = "Invalid input";
      break;
    case c.custom:
      t = "Invalid input";
      break;
    case c.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c.not_multiple_of:
      t = `Number must be a multiple of ${r.multipleOf}`;
      break;
    case c.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, k.assertNever(r);
  }
  return { message: t };
};
let Ie = Y;
function Ge(r) {
  Ie = r;
}
function pe() {
  return Ie;
}
const me = (r) => {
  const { data: e, path: t, errorMaps: s, issueData: n } = r, a = [...t, ...n.path || []], o = v(d({}, n), {
    path: a
  });
  if (n.message !== void 0)
    return v(d({}, n), {
      path: a,
      message: n.message
    });
  let i = "";
  const u = s.filter((l) => !!l).slice().reverse();
  for (const l of u)
    i = l(o, { data: e, defaultError: i }).message;
  return v(d({}, n), {
    path: a,
    message: i
  });
}, Xe = [];
function f(r, e) {
  const t = pe(), s = me({
    issueData: e,
    data: r.data,
    path: r.path,
    errorMaps: [
      r.common.contextualErrorMap,
      r.schemaErrorMap,
      t,
      t === Y ? void 0 : Y
      // then global default map
    ].filter((n) => !!n)
  });
  r.common.issues.push(s);
}
class T {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const n of t) {
      if (n.status === "aborted")
        return _;
      n.status === "dirty" && e.dirty(), s.push(n.value);
    }
    return { status: e.value, value: s };
  }
  static mergeObjectAsync(e, t) {
    return E(this, null, function* () {
      const s = [];
      for (const n of t) {
        const a = yield n.key, o = yield n.value;
        s.push({
          key: a,
          value: o
        });
      }
      return T.mergeObjectSync(e, s);
    });
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const n of t) {
      const { key: a, value: o } = n;
      if (a.status === "aborted" || o.status === "aborted")
        return _;
      a.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), a.value !== "__proto__" && (typeof o.value != "undefined" || n.alwaysSet) && (s[a.value] = o.value);
    }
    return { status: e.value, value: s };
  }
}
const _ = Object.freeze({
  status: "aborted"
}), q = (r) => ({ status: "dirty", value: r }), Z = (r) => ({ status: "valid", value: r }), Ze = (r) => r.status === "aborted", Se = (r) => r.status === "dirty", K = (r) => r.status === "valid", F = (r) => typeof Promise != "undefined" && r instanceof Promise;
function ye(r, e, t, s) {
  if (typeof e == "function" ? r !== e || !s : !e.has(r)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(r);
}
function Ae(r, e, t, s, n) {
  if (typeof e == "function" ? r !== e || !n : !e.has(r)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(r, t), t;
}
var p;
(function(r) {
  r.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, r.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(p || (p = {}));
var X, Q;
class j {
  constructor(e, t, s, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Re = (r, e) => {
  if (K(e))
    return { success: !0, data: e.value };
  if (!r.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new S(r.common.issues);
      return this._error = t, this._error;
    }
  };
};
function g(r) {
  if (!r)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: n } = r;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (o, i) => {
    var u, l;
    const { message: m } = r;
    return o.code === "invalid_enum_value" ? { message: m != null ? m : i.defaultError } : typeof i.data == "undefined" ? { message: (u = m != null ? m : s) !== null && u !== void 0 ? u : i.defaultError } : o.code !== "invalid_type" ? { message: i.defaultError } : { message: (l = m != null ? m : t) !== null && l !== void 0 ? l : i.defaultError };
  }, description: n };
}
class x {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return V(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: V(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new T(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: V(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (F(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    var s;
    const n = {
      common: {
        issues: [],
        async: (s = t == null ? void 0 : t.async) !== null && s !== void 0 ? s : !1,
        contextualErrorMap: t == null ? void 0 : t.errorMap
      },
      path: (t == null ? void 0 : t.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: V(e)
    }, a = this._parseSync({ data: e, path: n.path, parent: n });
    return Re(n, a);
  }
  parseAsync(e, t) {
    return E(this, null, function* () {
      const s = yield this.safeParseAsync(e, t);
      if (s.success)
        return s.data;
      throw s.error;
    });
  }
  safeParseAsync(e, t) {
    return E(this, null, function* () {
      const s = {
        common: {
          issues: [],
          contextualErrorMap: t == null ? void 0 : t.errorMap,
          async: !0
        },
        path: (t == null ? void 0 : t.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: e,
        parsedType: V(e)
      }, n = this._parse({ data: e, path: s.path, parent: s }), a = yield F(n) ? n : Promise.resolve(n);
      return Re(s, a);
    });
  }
  refine(e, t) {
    const s = (n) => typeof t == "string" || typeof t == "undefined" ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement((n, a) => {
      const o = e(n), i = () => a.addIssue(d({
        code: c.custom
      }, s(n)));
      return typeof Promise != "undefined" && o instanceof Promise ? o.then((u) => u ? !0 : (i(), !1)) : o ? !0 : (i(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, n) => e(s) ? !0 : (n.addIssue(typeof t == "function" ? t(s, n) : t), !1));
  }
  _refinement(e) {
    return new N({
      schema: this,
      typeName: y.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return R.create(this, this._def);
  }
  nullable() {
    return D.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return O.create(this, this._def);
  }
  promise() {
    return G.create(this, this._def);
  }
  or(e) {
    return se.create([this, e], this._def);
  }
  and(e) {
    return ne.create(this, e, this._def);
  }
  transform(e) {
    return new N(v(d({}, g(this._def)), {
      schema: this,
      typeName: y.ZodEffects,
      effect: { type: "transform", transform: e }
    }));
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ce(v(d({}, g(this._def)), {
      innerType: this,
      defaultValue: t,
      typeName: y.ZodDefault
    }));
  }
  brand() {
    return new Oe(d({
      typeName: y.ZodBranded,
      type: this
    }, g(this._def)));
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ue(v(d({}, g(this._def)), {
      innerType: this,
      catchValue: t,
      typeName: y.ZodCatch
    }));
  }
  describe(e) {
    const t = this.constructor;
    return new t(v(d({}, this._def), {
      description: e
    }));
  }
  pipe(e) {
    return fe.create(this, e);
  }
  readonly() {
    return le.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Qe = /^c[^\s-]{8,}$/i, Ke = /^[0-9a-z]+$/, Fe = /^[0-9A-HJKMNP-TV-Z]{26}$/, et = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, tt = /^[a-z0-9_-]{21}$/i, rt = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, st = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, nt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let we;
const at = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, it = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, ot = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Me = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", dt = new RegExp(`^${Me}$`);
function Ve(r) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return r.precision ? e = `${e}\\.\\d{${r.precision}}` : r.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function ct(r) {
  return new RegExp(`^${Ve(r)}$`);
}
function $e(r) {
  let e = `${Me}T${Ve(r)}`;
  const t = [];
  return t.push(r.local ? "Z?" : "Z"), r.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function ut(r, e) {
  return !!((e === "v4" || !e) && at.test(r) || (e === "v6" || !e) && it.test(r));
}
class C extends x {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== h.string) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_type,
        expected: h.string,
        received: a.parsedType
      }), _;
    }
    const s = new T();
    let n;
    for (const a of this._def.checks)
      if (a.kind === "min")
        e.data.length < a.value && (n = this._getOrReturnCtx(e, n), f(n, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "max")
        e.data.length > a.value && (n = this._getOrReturnCtx(e, n), f(n, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: a.message
        }), s.dirty());
      else if (a.kind === "length") {
        const o = e.data.length > a.value, i = e.data.length < a.value;
        (o || i) && (n = this._getOrReturnCtx(e, n), o ? f(n, {
          code: c.too_big,
          maximum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }) : i && f(n, {
          code: c.too_small,
          minimum: a.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: a.message
        }), s.dirty());
      } else if (a.kind === "email")
        st.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
          validation: "email",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "emoji")
        we || (we = new RegExp(nt, "u")), we.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
          validation: "emoji",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "uuid")
        et.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
          validation: "uuid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "nanoid")
        tt.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
          validation: "nanoid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid")
        Qe.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
          validation: "cuid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "cuid2")
        Ke.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
          validation: "cuid2",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "ulid")
        Fe.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
          validation: "ulid",
          code: c.invalid_string,
          message: a.message
        }), s.dirty());
      else if (a.kind === "url")
        try {
          new URL(e.data);
        } catch (o) {
          n = this._getOrReturnCtx(e, n), f(n, {
            validation: "url",
            code: c.invalid_string,
            message: a.message
          }), s.dirty();
        }
      else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
        validation: "regex",
        code: c.invalid_string,
        message: a.message
      }), s.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "includes" ? e.data.includes(a.value, a.position) || (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.invalid_string,
        validation: { includes: a.value, position: a.position },
        message: a.message
      }), s.dirty()) : a.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : a.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.invalid_string,
        validation: { startsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.invalid_string,
        validation: { endsWith: a.value },
        message: a.message
      }), s.dirty()) : a.kind === "datetime" ? $e(a).test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.invalid_string,
        validation: "datetime",
        message: a.message
      }), s.dirty()) : a.kind === "date" ? dt.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.invalid_string,
        validation: "date",
        message: a.message
      }), s.dirty()) : a.kind === "time" ? ct(a).test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.invalid_string,
        validation: "time",
        message: a.message
      }), s.dirty()) : a.kind === "duration" ? rt.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
        validation: "duration",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "ip" ? ut(e.data, a.version) || (n = this._getOrReturnCtx(e, n), f(n, {
        validation: "ip",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : a.kind === "base64" ? ot.test(e.data) || (n = this._getOrReturnCtx(e, n), f(n, {
        validation: "base64",
        code: c.invalid_string,
        message: a.message
      }), s.dirty()) : k.assertNever(a);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((n) => e.test(n), d({
      validation: t,
      code: c.invalid_string
    }, p.errToObj(s)));
  }
  _addCheck(e) {
    return new C(v(d({}, this._def), {
      checks: [...this._def.checks, e]
    }));
  }
  email(e) {
    return this._addCheck(d({ kind: "email" }, p.errToObj(e)));
  }
  url(e) {
    return this._addCheck(d({ kind: "url" }, p.errToObj(e)));
  }
  emoji(e) {
    return this._addCheck(d({ kind: "emoji" }, p.errToObj(e)));
  }
  uuid(e) {
    return this._addCheck(d({ kind: "uuid" }, p.errToObj(e)));
  }
  nanoid(e) {
    return this._addCheck(d({ kind: "nanoid" }, p.errToObj(e)));
  }
  cuid(e) {
    return this._addCheck(d({ kind: "cuid" }, p.errToObj(e)));
  }
  cuid2(e) {
    return this._addCheck(d({ kind: "cuid2" }, p.errToObj(e)));
  }
  ulid(e) {
    return this._addCheck(d({ kind: "ulid" }, p.errToObj(e)));
  }
  base64(e) {
    return this._addCheck(d({ kind: "base64" }, p.errToObj(e)));
  }
  ip(e) {
    return this._addCheck(d({ kind: "ip" }, p.errToObj(e)));
  }
  datetime(e) {
    var t, s;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck(d({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) == "undefined" ? null : e == null ? void 0 : e.precision,
      offset: (t = e == null ? void 0 : e.offset) !== null && t !== void 0 ? t : !1,
      local: (s = e == null ? void 0 : e.local) !== null && s !== void 0 ? s : !1
    }, p.errToObj(e == null ? void 0 : e.message)));
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck(d({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) == "undefined" ? null : e == null ? void 0 : e.precision
    }, p.errToObj(e == null ? void 0 : e.message)));
  }
  duration(e) {
    return this._addCheck(d({ kind: "duration" }, p.errToObj(e)));
  }
  regex(e, t) {
    return this._addCheck(d({
      kind: "regex",
      regex: e
    }, p.errToObj(t)));
  }
  includes(e, t) {
    return this._addCheck(d({
      kind: "includes",
      value: e,
      position: t == null ? void 0 : t.position
    }, p.errToObj(t == null ? void 0 : t.message)));
  }
  startsWith(e, t) {
    return this._addCheck(d({
      kind: "startsWith",
      value: e
    }, p.errToObj(t)));
  }
  endsWith(e, t) {
    return this._addCheck(d({
      kind: "endsWith",
      value: e
    }, p.errToObj(t)));
  }
  min(e, t) {
    return this._addCheck(d({
      kind: "min",
      value: e
    }, p.errToObj(t)));
  }
  max(e, t) {
    return this._addCheck(d({
      kind: "max",
      value: e
    }, p.errToObj(t)));
  }
  length(e, t) {
    return this._addCheck(d({
      kind: "length",
      value: e
    }, p.errToObj(t)));
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(e) {
    return this.min(1, p.errToObj(e));
  }
  trim() {
    return new C(v(d({}, this._def), {
      checks: [...this._def.checks, { kind: "trim" }]
    }));
  }
  toLowerCase() {
    return new C(v(d({}, this._def), {
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    }));
  }
  toUpperCase() {
    return new C(v(d({}, this._def), {
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    }));
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
C.create = (r) => {
  var e;
  return new C(d({
    checks: [],
    typeName: y.ZodString,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1
  }, g(r)));
};
function lt(r, e) {
  const t = (r.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, n = t > s ? t : s, a = parseInt(r.toFixed(n).replace(".", "")), o = parseInt(e.toFixed(n).replace(".", ""));
  return a % o / Math.pow(10, n);
}
class $ extends x {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== h.number) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_type,
        expected: h.number,
        received: a.parsedType
      }), _;
    }
    let s;
    const n = new T();
    for (const a of this._def.checks)
      a.kind === "int" ? k.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: a.message
      }), n.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.too_small,
        minimum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.too_big,
        maximum: a.value,
        type: "number",
        inclusive: a.inclusive,
        exact: !1,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? lt(e.data, a.value) !== 0 && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.not_finite,
        message: a.message
      }), n.dirty()) : k.assertNever(a);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, p.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, p.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, p.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, p.toString(t));
  }
  setLimit(e, t, s, n) {
    return new $(v(d({}, this._def), {
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: p.toString(n)
        }
      ]
    }));
  }
  _addCheck(e) {
    return new $(v(d({}, this._def), {
      checks: [...this._def.checks, e]
    }));
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: p.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: p.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: p.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: p.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: p.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: p.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: p.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: p.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: p.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && k.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
$.create = (r) => new $(d({
  checks: [],
  typeName: y.ZodNumber,
  coerce: (r == null ? void 0 : r.coerce) || !1
}, g(r)));
class P extends x {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== h.bigint) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_type,
        expected: h.bigint,
        received: a.parsedType
      }), _;
    }
    let s;
    const n = new T();
    for (const a of this._def.checks)
      a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.too_small,
        type: "bigint",
        minimum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.too_big,
        type: "bigint",
        maximum: a.value,
        inclusive: a.inclusive,
        message: a.message
      }), n.dirty()) : a.kind === "multipleOf" ? e.data % a.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), f(s, {
        code: c.not_multiple_of,
        multipleOf: a.value,
        message: a.message
      }), n.dirty()) : k.assertNever(a);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, p.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, p.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, p.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, p.toString(t));
  }
  setLimit(e, t, s, n) {
    return new P(v(d({}, this._def), {
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: p.toString(n)
        }
      ]
    }));
  }
  _addCheck(e) {
    return new P(v(d({}, this._def), {
      checks: [...this._def.checks, e]
    }));
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: p.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: p.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: p.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: p.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: p.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
P.create = (r) => {
  var e;
  return new P(d({
    checks: [],
    typeName: y.ZodBigInt,
    coerce: (e = r == null ? void 0 : r.coerce) !== null && e !== void 0 ? e : !1
  }, g(r)));
};
class ee extends x {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== h.boolean) {
      const s = this._getOrReturnCtx(e);
      return f(s, {
        code: c.invalid_type,
        expected: h.boolean,
        received: s.parsedType
      }), _;
    }
    return Z(e.data);
  }
}
ee.create = (r) => new ee(d({
  typeName: y.ZodBoolean,
  coerce: (r == null ? void 0 : r.coerce) || !1
}, g(r)));
class U extends x {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== h.date) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_type,
        expected: h.date,
        received: a.parsedType
      }), _;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return f(a, {
        code: c.invalid_date
      }), _;
    }
    const s = new T();
    let n;
    for (const a of this._def.checks)
      a.kind === "min" ? e.data.getTime() < a.value && (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.too_small,
        message: a.message,
        inclusive: !0,
        exact: !1,
        minimum: a.value,
        type: "date"
      }), s.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (n = this._getOrReturnCtx(e, n), f(n, {
        code: c.too_big,
        message: a.message,
        inclusive: !0,
        exact: !1,
        maximum: a.value,
        type: "date"
      }), s.dirty()) : k.assertNever(a);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new U(v(d({}, this._def), {
      checks: [...this._def.checks, e]
    }));
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: p.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: p.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
U.create = (r) => new U(d({
  checks: [],
  coerce: (r == null ? void 0 : r.coerce) || !1,
  typeName: y.ZodDate
}, g(r)));
class ve extends x {
  _parse(e) {
    if (this._getType(e) !== h.symbol) {
      const s = this._getOrReturnCtx(e);
      return f(s, {
        code: c.invalid_type,
        expected: h.symbol,
        received: s.parsedType
      }), _;
    }
    return Z(e.data);
  }
}
ve.create = (r) => new ve(d({
  typeName: y.ZodSymbol
}, g(r)));
class te extends x {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return f(s, {
        code: c.invalid_type,
        expected: h.undefined,
        received: s.parsedType
      }), _;
    }
    return Z(e.data);
  }
}
te.create = (r) => new te(d({
  typeName: y.ZodUndefined
}, g(r)));
class re extends x {
  _parse(e) {
    if (this._getType(e) !== h.null) {
      const s = this._getOrReturnCtx(e);
      return f(s, {
        code: c.invalid_type,
        expected: h.null,
        received: s.parsedType
      }), _;
    }
    return Z(e.data);
  }
}
re.create = (r) => new re(d({
  typeName: y.ZodNull
}, g(r)));
class H extends x {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Z(e.data);
  }
}
H.create = (r) => new H(d({
  typeName: y.ZodAny
}, g(r)));
class L extends x {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Z(e.data);
  }
}
L.create = (r) => new L(d({
  typeName: y.ZodUnknown
}, g(r)));
class M extends x {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return f(t, {
      code: c.invalid_type,
      expected: h.never,
      received: t.parsedType
    }), _;
  }
}
M.create = (r) => new M(d({
  typeName: y.ZodNever
}, g(r)));
class _e extends x {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const s = this._getOrReturnCtx(e);
      return f(s, {
        code: c.invalid_type,
        expected: h.void,
        received: s.parsedType
      }), _;
    }
    return Z(e.data);
  }
}
_e.create = (r) => new _e(d({
  typeName: y.ZodVoid
}, g(r)));
class O extends x {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== h.array)
      return f(t, {
        code: c.invalid_type,
        expected: h.array,
        received: t.parsedType
      }), _;
    if (n.exactLength !== null) {
      const o = t.data.length > n.exactLength.value, i = t.data.length < n.exactLength.value;
      (o || i) && (f(t, {
        code: o ? c.too_big : c.too_small,
        minimum: i ? n.exactLength.value : void 0,
        maximum: o ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), s.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (f(t, {
      code: c.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), s.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (f(t, {
      code: c.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((o, i) => n.type._parseAsync(new j(t, o, t.path, i)))).then((o) => T.mergeArray(s, o));
    const a = [...t.data].map((o, i) => n.type._parseSync(new j(t, o, t.path, i)));
    return T.mergeArray(s, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new O(v(d({}, this._def), {
      minLength: { value: e, message: p.toString(t) }
    }));
  }
  max(e, t) {
    return new O(v(d({}, this._def), {
      maxLength: { value: e, message: p.toString(t) }
    }));
  }
  length(e, t) {
    return new O(v(d({}, this._def), {
      exactLength: { value: e, message: p.toString(t) }
    }));
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
O.create = (r, e) => new O(d({
  type: r,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: y.ZodArray
}, g(e)));
function W(r) {
  if (r instanceof b) {
    const e = {};
    for (const t in r.shape) {
      const s = r.shape[t];
      e[t] = R.create(W(s));
    }
    return new b(v(d({}, r._def), {
      shape: () => e
    }));
  } else return r instanceof O ? new O(v(d({}, r._def), {
    type: W(r.element)
  })) : r instanceof R ? R.create(W(r.unwrap())) : r instanceof D ? D.create(W(r.unwrap())) : r instanceof I ? I.create(r.items.map((e) => W(e))) : r;
}
class b extends x {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = k.objectKeys(e);
    return this._cached = { shape: e, keys: t };
  }
  _parse(e) {
    if (this._getType(e) !== h.object) {
      const l = this._getOrReturnCtx(e);
      return f(l, {
        code: c.invalid_type,
        expected: h.object,
        received: l.parsedType
      }), _;
    }
    const { status: s, ctx: n } = this._processInputParams(e), { shape: a, keys: o } = this._getCached(), i = [];
    if (!(this._def.catchall instanceof M && this._def.unknownKeys === "strip"))
      for (const l in n.data)
        o.includes(l) || i.push(l);
    const u = [];
    for (const l of o) {
      const m = a[l], w = n.data[l];
      u.push({
        key: { status: "valid", value: l },
        value: m._parse(new j(n, w, n.path, l)),
        alwaysSet: l in n.data
      });
    }
    if (this._def.catchall instanceof M) {
      const l = this._def.unknownKeys;
      if (l === "passthrough")
        for (const m of i)
          u.push({
            key: { status: "valid", value: m },
            value: { status: "valid", value: n.data[m] }
          });
      else if (l === "strict")
        i.length > 0 && (f(n, {
          code: c.unrecognized_keys,
          keys: i
        }), s.dirty());
      else if (l !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const l = this._def.catchall;
      for (const m of i) {
        const w = n.data[m];
        u.push({
          key: { status: "valid", value: m },
          value: l._parse(
            new j(n, w, n.path, m)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: m in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(() => E(this, null, function* () {
      const l = [];
      for (const m of u) {
        const w = yield m.key, he = yield m.value;
        l.push({
          key: w,
          value: he,
          alwaysSet: m.alwaysSet
        });
      }
      return l;
    })).then((l) => T.mergeObjectSync(s, l)) : T.mergeObjectSync(s, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return p.errToObj, new b(d(v(d({}, this._def), {
      unknownKeys: "strict"
    }), e !== void 0 ? {
      errorMap: (t, s) => {
        var n, a, o, i;
        const u = (o = (a = (n = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(n, t, s).message) !== null && o !== void 0 ? o : s.defaultError;
        return t.code === "unrecognized_keys" ? {
          message: (i = p.errToObj(e).message) !== null && i !== void 0 ? i : u
        } : {
          message: u
        };
      }
    } : {}));
  }
  strip() {
    return new b(v(d({}, this._def), {
      unknownKeys: "strip"
    }));
  }
  passthrough() {
    return new b(v(d({}, this._def), {
      unknownKeys: "passthrough"
    }));
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new b(v(d({}, this._def), {
      shape: () => d(d({}, this._def.shape()), e)
    }));
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new b({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => d(d({}, this._def.shape()), e._def.shape()),
      typeName: y.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new b(v(d({}, this._def), {
      catchall: e
    }));
  }
  pick(e) {
    const t = {};
    return k.objectKeys(e).forEach((s) => {
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    }), new b(v(d({}, this._def), {
      shape: () => t
    }));
  }
  omit(e) {
    const t = {};
    return k.objectKeys(this.shape).forEach((s) => {
      e[s] || (t[s] = this.shape[s]);
    }), new b(v(d({}, this._def), {
      shape: () => t
    }));
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return W(this);
  }
  partial(e) {
    const t = {};
    return k.objectKeys(this.shape).forEach((s) => {
      const n = this.shape[s];
      e && !e[s] ? t[s] = n : t[s] = n.optional();
    }), new b(v(d({}, this._def), {
      shape: () => t
    }));
  }
  required(e) {
    const t = {};
    return k.objectKeys(this.shape).forEach((s) => {
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let a = this.shape[s];
        for (; a instanceof R; )
          a = a._def.innerType;
        t[s] = a;
      }
    }), new b(v(d({}, this._def), {
      shape: () => t
    }));
  }
  keyof() {
    return Pe(k.objectKeys(this.shape));
  }
}
b.create = (r, e) => new b(d({
  shape: () => r,
  unknownKeys: "strip",
  catchall: M.create(),
  typeName: y.ZodObject
}, g(e)));
b.strictCreate = (r, e) => new b(d({
  shape: () => r,
  unknownKeys: "strict",
  catchall: M.create(),
  typeName: y.ZodObject
}, g(e)));
b.lazycreate = (r, e) => new b(d({
  shape: r,
  unknownKeys: "strip",
  catchall: M.create(),
  typeName: y.ZodObject
}, g(e)));
class se extends x {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function n(a) {
      for (const i of a)
        if (i.result.status === "valid")
          return i.result;
      for (const i of a)
        if (i.result.status === "dirty")
          return t.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((i) => new S(i.ctx.common.issues));
      return f(t, {
        code: c.invalid_union,
        unionErrors: o
      }), _;
    }
    if (t.common.async)
      return Promise.all(s.map((a) => E(this, null, function* () {
        const o = v(d({}, t), {
          common: v(d({}, t.common), {
            issues: []
          }),
          parent: null
        });
        return {
          result: yield a._parseAsync({
            data: t.data,
            path: t.path,
            parent: o
          }),
          ctx: o
        };
      }))).then(n);
    {
      let a;
      const o = [];
      for (const u of s) {
        const l = v(d({}, t), {
          common: v(d({}, t.common), {
            issues: []
          }),
          parent: null
        }), m = u._parseSync({
          data: t.data,
          path: t.path,
          parent: l
        });
        if (m.status === "valid")
          return m;
        m.status === "dirty" && !a && (a = { result: m, ctx: l }), l.common.issues.length && o.push(l.common.issues);
      }
      if (a)
        return t.common.issues.push(...a.ctx.common.issues), a.result;
      const i = o.map((u) => new S(u));
      return f(t, {
        code: c.invalid_union,
        unionErrors: i
      }), _;
    }
  }
  get options() {
    return this._def.options;
  }
}
se.create = (r, e) => new se(d({
  options: r,
  typeName: y.ZodUnion
}, g(e)));
const A = (r) => r instanceof ie ? A(r.schema) : r instanceof N ? A(r.innerType()) : r instanceof oe ? [r.value] : r instanceof z ? r.options : r instanceof de ? k.objectValues(r.enum) : r instanceof ce ? A(r._def.innerType) : r instanceof te ? [void 0] : r instanceof re ? [null] : r instanceof R ? [void 0, ...A(r.unwrap())] : r instanceof D ? [null, ...A(r.unwrap())] : r instanceof Oe || r instanceof le ? A(r.unwrap()) : r instanceof ue ? A(r._def.innerType) : [];
class ke extends x {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.object)
      return f(t, {
        code: c.invalid_type,
        expected: h.object,
        received: t.parsedType
      }), _;
    const s = this.discriminator, n = t.data[s], a = this.optionsMap.get(n);
    return a ? t.common.async ? a._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : a._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (f(t, {
      code: c.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [s]
    }), _);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, s) {
    const n = /* @__PURE__ */ new Map();
    for (const a of t) {
      const o = A(a.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const i of o) {
        if (n.has(i))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(i)}`);
        n.set(i, a);
      }
    }
    return new ke(d({
      typeName: y.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: n
    }, g(s)));
  }
}
function Ce(r, e) {
  const t = V(r), s = V(e);
  if (r === e)
    return { valid: !0, data: r };
  if (t === h.object && s === h.object) {
    const n = k.objectKeys(e), a = k.objectKeys(r).filter((i) => n.indexOf(i) !== -1), o = d(d({}, r), e);
    for (const i of a) {
      const u = Ce(r[i], e[i]);
      if (!u.valid)
        return { valid: !1 };
      o[i] = u.data;
    }
    return { valid: !0, data: o };
  } else if (t === h.array && s === h.array) {
    if (r.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let a = 0; a < r.length; a++) {
      const o = r[a], i = e[a], u = Ce(o, i);
      if (!u.valid)
        return { valid: !1 };
      n.push(u.data);
    }
    return { valid: !0, data: n };
  } else return t === h.date && s === h.date && +r == +e ? { valid: !0, data: r } : { valid: !1 };
}
class ne extends x {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = (a, o) => {
      if (Ze(a) || Ze(o))
        return _;
      const i = Ce(a.value, o.value);
      return i.valid ? ((Se(a) || Se(o)) && t.dirty(), { status: t.value, value: i.data }) : (f(s, {
        code: c.invalid_intersection_types
      }), _);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([a, o]) => n(a, o)) : n(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
ne.create = (r, e, t) => new ne(d({
  left: r,
  right: e,
  typeName: y.ZodIntersection
}, g(t)));
class I extends x {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.array)
      return f(s, {
        code: c.invalid_type,
        expected: h.array,
        received: s.parsedType
      }), _;
    if (s.data.length < this._def.items.length)
      return f(s, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), _;
    !this._def.rest && s.data.length > this._def.items.length && (f(s, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const a = [...s.data].map((o, i) => {
      const u = this._def.items[i] || this._def.rest;
      return u ? u._parse(new j(s, o, s.path, i)) : null;
    }).filter((o) => !!o);
    return s.common.async ? Promise.all(a).then((o) => T.mergeArray(t, o)) : T.mergeArray(t, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new I(v(d({}, this._def), {
      rest: e
    }));
  }
}
I.create = (r, e) => {
  if (!Array.isArray(r))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new I(d({
    items: r,
    typeName: y.ZodTuple,
    rest: null
  }, g(e)));
};
class ae extends x {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.object)
      return f(s, {
        code: c.invalid_type,
        expected: h.object,
        received: s.parsedType
      }), _;
    const n = [], a = this._def.keyType, o = this._def.valueType;
    for (const i in s.data)
      n.push({
        key: a._parse(new j(s, i, s.path, i)),
        value: o._parse(new j(s, s.data[i], s.path, i)),
        alwaysSet: i in s.data
      });
    return s.common.async ? T.mergeObjectAsync(t, n) : T.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof x ? new ae(d({
      keyType: e,
      valueType: t,
      typeName: y.ZodRecord
    }, g(s))) : new ae(d({
      keyType: C.create(),
      valueType: e,
      typeName: y.ZodRecord
    }, g(t)));
  }
}
class ge extends x {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.map)
      return f(s, {
        code: c.invalid_type,
        expected: h.map,
        received: s.parsedType
      }), _;
    const n = this._def.keyType, a = this._def.valueType, o = [...s.data.entries()].map(([i, u], l) => ({
      key: n._parse(new j(s, i, s.path, [l, "key"])),
      value: a._parse(new j(s, u, s.path, [l, "value"]))
    }));
    if (s.common.async) {
      const i = /* @__PURE__ */ new Map();
      return Promise.resolve().then(() => E(this, null, function* () {
        for (const u of o) {
          const l = yield u.key, m = yield u.value;
          if (l.status === "aborted" || m.status === "aborted")
            return _;
          (l.status === "dirty" || m.status === "dirty") && t.dirty(), i.set(l.value, m.value);
        }
        return { status: t.value, value: i };
      }));
    } else {
      const i = /* @__PURE__ */ new Map();
      for (const u of o) {
        const l = u.key, m = u.value;
        if (l.status === "aborted" || m.status === "aborted")
          return _;
        (l.status === "dirty" || m.status === "dirty") && t.dirty(), i.set(l.value, m.value);
      }
      return { status: t.value, value: i };
    }
  }
}
ge.create = (r, e, t) => new ge(d({
  valueType: e,
  keyType: r,
  typeName: y.ZodMap
}, g(t)));
class B extends x {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== h.set)
      return f(s, {
        code: c.invalid_type,
        expected: h.set,
        received: s.parsedType
      }), _;
    const n = this._def;
    n.minSize !== null && s.data.size < n.minSize.value && (f(s, {
      code: c.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), t.dirty()), n.maxSize !== null && s.data.size > n.maxSize.value && (f(s, {
      code: c.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
    }), t.dirty());
    const a = this._def.valueType;
    function o(u) {
      const l = /* @__PURE__ */ new Set();
      for (const m of u) {
        if (m.status === "aborted")
          return _;
        m.status === "dirty" && t.dirty(), l.add(m.value);
      }
      return { status: t.value, value: l };
    }
    const i = [...s.data.values()].map((u, l) => a._parse(new j(s, u, s.path, l)));
    return s.common.async ? Promise.all(i).then((u) => o(u)) : o(i);
  }
  min(e, t) {
    return new B(v(d({}, this._def), {
      minSize: { value: e, message: p.toString(t) }
    }));
  }
  max(e, t) {
    return new B(v(d({}, this._def), {
      maxSize: { value: e, message: p.toString(t) }
    }));
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
B.create = (r, e) => new B(d({
  valueType: r,
  minSize: null,
  maxSize: null,
  typeName: y.ZodSet
}, g(e)));
class J extends x {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.function)
      return f(t, {
        code: c.invalid_type,
        expected: h.function,
        received: t.parsedType
      }), _;
    function s(i, u) {
      return me({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          pe(),
          Y
        ].filter((l) => !!l),
        issueData: {
          code: c.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function n(i, u) {
      return me({
        data: i,
        path: t.path,
        errorMaps: [
          t.common.contextualErrorMap,
          t.schemaErrorMap,
          pe(),
          Y
        ].filter((l) => !!l),
        issueData: {
          code: c.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const a = { errorMap: t.common.contextualErrorMap }, o = t.data;
    if (this._def.returns instanceof G) {
      const i = this;
      return Z(function(...u) {
        return E(this, null, function* () {
          const l = new S([]), m = yield i._def.args.parseAsync(u, a).catch((be) => {
            throw l.addIssue(s(u, be)), l;
          }), w = yield Reflect.apply(o, this, m);
          return yield i._def.returns._def.type.parseAsync(w, a).catch((be) => {
            throw l.addIssue(n(w, be)), l;
          });
        });
      });
    } else {
      const i = this;
      return Z(function(...u) {
        const l = i._def.args.safeParse(u, a);
        if (!l.success)
          throw new S([s(u, l.error)]);
        const m = Reflect.apply(o, this, l.data), w = i._def.returns.safeParse(m, a);
        if (!w.success)
          throw new S([n(m, w.error)]);
        return w.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new J(v(d({}, this._def), {
      args: I.create(e).rest(L.create())
    }));
  }
  returns(e) {
    return new J(v(d({}, this._def), {
      returns: e
    }));
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, t, s) {
    return new J(d({
      args: e || I.create([]).rest(L.create()),
      returns: t || L.create(),
      typeName: y.ZodFunction
    }, g(s)));
  }
}
class ie extends x {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
ie.create = (r, e) => new ie(d({
  getter: r,
  typeName: y.ZodLazy
}, g(e)));
class oe extends x {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return f(t, {
        received: t.data,
        code: c.invalid_literal,
        expected: this._def.value
      }), _;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
oe.create = (r, e) => new oe(d({
  value: r,
  typeName: y.ZodLiteral
}, g(e)));
function Pe(r, e) {
  return new z(d({
    values: r,
    typeName: y.ZodEnum
  }, g(e)));
}
class z extends x {
  constructor() {
    super(...arguments), X.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return f(t, {
        expected: k.joinValues(s),
        received: t.parsedType,
        code: c.invalid_type
      }), _;
    }
    if (ye(this, X) || Ae(this, X, new Set(this._def.values)), !ye(this, X).has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return f(t, {
        received: t.data,
        code: c.invalid_enum_value,
        options: s
      }), _;
    }
    return Z(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return z.create(e, d(d({}, this._def), t));
  }
  exclude(e, t = this._def) {
    return z.create(this.options.filter((s) => !e.includes(s)), d(d({}, this._def), t));
  }
}
X = /* @__PURE__ */ new WeakMap();
z.create = Pe;
class de extends x {
  constructor() {
    super(...arguments), Q.set(this, void 0);
  }
  _parse(e) {
    const t = k.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== h.string && s.parsedType !== h.number) {
      const n = k.objectValues(t);
      return f(s, {
        expected: k.joinValues(n),
        received: s.parsedType,
        code: c.invalid_type
      }), _;
    }
    if (ye(this, Q) || Ae(this, Q, new Set(k.getValidEnumValues(this._def.values))), !ye(this, Q).has(e.data)) {
      const n = k.objectValues(t);
      return f(s, {
        received: s.data,
        code: c.invalid_enum_value,
        options: n
      }), _;
    }
    return Z(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Q = /* @__PURE__ */ new WeakMap();
de.create = (r, e) => new de(d({
  values: r,
  typeName: y.ZodNativeEnum
}, g(e)));
class G extends x {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.promise && t.common.async === !1)
      return f(t, {
        code: c.invalid_type,
        expected: h.promise,
        received: t.parsedType
      }), _;
    const s = t.parsedType === h.promise ? t.data : Promise.resolve(t.data);
    return Z(s.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
G.create = (r, e) => new G(d({
  type: r,
  typeName: y.ZodPromise
}, g(e)));
class N extends x {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === y.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), n = this._def.effect || null, a = {
      addIssue: (o) => {
        f(s, o), o.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), n.type === "preprocess") {
      const o = n.transform(s.data, a);
      if (s.common.async)
        return Promise.resolve(o).then((i) => E(this, null, function* () {
          if (t.value === "aborted")
            return _;
          const u = yield this._def.schema._parseAsync({
            data: i,
            path: s.path,
            parent: s
          });
          return u.status === "aborted" ? _ : u.status === "dirty" || t.value === "dirty" ? q(u.value) : u;
        }));
      {
        if (t.value === "aborted")
          return _;
        const i = this._def.schema._parseSync({
          data: o,
          path: s.path,
          parent: s
        });
        return i.status === "aborted" ? _ : i.status === "dirty" || t.value === "dirty" ? q(i.value) : i;
      }
    }
    if (n.type === "refinement") {
      const o = (i) => {
        const u = n.refinement(i, a);
        if (s.common.async)
          return Promise.resolve(u);
        if (u instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return i;
      };
      if (s.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return i.status === "aborted" ? _ : (i.status === "dirty" && t.dirty(), o(i.value), { status: t.value, value: i.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((i) => i.status === "aborted" ? _ : (i.status === "dirty" && t.dirty(), o(i.value).then(() => ({ status: t.value, value: i.value }))));
    }
    if (n.type === "transform")
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!K(o))
          return o;
        const i = n.transform(o.value, a);
        if (i instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: i };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => K(o) ? Promise.resolve(n.transform(o.value, a)).then((i) => ({ status: t.value, value: i })) : o);
    k.assertNever(n);
  }
}
N.create = (r, e, t) => new N(d({
  schema: r,
  typeName: y.ZodEffects,
  effect: e
}, g(t)));
N.createWithPreprocess = (r, e, t) => new N(d({
  schema: e,
  effect: { type: "preprocess", transform: r },
  typeName: y.ZodEffects
}, g(t)));
class R extends x {
  _parse(e) {
    return this._getType(e) === h.undefined ? Z(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
R.create = (r, e) => new R(d({
  innerType: r,
  typeName: y.ZodOptional
}, g(e)));
class D extends x {
  _parse(e) {
    return this._getType(e) === h.null ? Z(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
D.create = (r, e) => new D(d({
  innerType: r,
  typeName: y.ZodNullable
}, g(e)));
class ce extends x {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === h.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ce.create = (r, e) => new ce(d({
  innerType: r,
  typeName: y.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default
}, g(e)));
class ue extends x {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = v(d({}, t), {
      common: v(d({}, t.common), {
        issues: []
      })
    }), n = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: d({}, s)
    });
    return F(n) ? n.then((a) => ({
      status: "valid",
      value: a.status === "valid" ? a.value : this._def.catchValue({
        get error() {
          return new S(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new S(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ue.create = (r, e) => new ue(d({
  innerType: r,
  typeName: y.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch
}, g(e)));
class xe extends x {
  _parse(e) {
    if (this._getType(e) !== h.nan) {
      const s = this._getOrReturnCtx(e);
      return f(s, {
        code: c.invalid_type,
        expected: h.nan,
        received: s.parsedType
      }), _;
    }
    return { status: "valid", value: e.data };
  }
}
xe.create = (r) => new xe(d({
  typeName: y.ZodNaN
}, g(r)));
const ft = Symbol("zod_brand");
class Oe extends x {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class fe extends x {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return E(this, null, function* () {
        const a = yield this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return a.status === "aborted" ? _ : a.status === "dirty" ? (t.dirty(), q(a.value)) : this._def.out._parseAsync({
          data: a.value,
          path: s.path,
          parent: s
        });
      });
    {
      const n = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return n.status === "aborted" ? _ : n.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: n.value
      }) : this._def.out._parseSync({
        data: n.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new fe({
      in: e,
      out: t,
      typeName: y.ZodPipeline
    });
  }
}
class le extends x {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (n) => (K(n) && (n.value = Object.freeze(n.value)), n);
    return F(t) ? t.then((n) => s(n)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
le.create = (r, e) => new le(d({
  innerType: r,
  typeName: y.ZodReadonly
}, g(e)));
function ze(r, e = {}, t) {
  return r ? H.create().superRefine((s, n) => {
    var a, o;
    if (!r(s)) {
      const i = typeof e == "function" ? e(s) : typeof e == "string" ? { message: e } : e, u = (o = (a = i.fatal) !== null && a !== void 0 ? a : t) !== null && o !== void 0 ? o : !0, l = typeof i == "string" ? { message: i } : i;
      n.addIssue(v(d({ code: "custom" }, l), { fatal: u }));
    }
  }) : H.create();
}
const ht = {
  object: b.lazycreate
};
var y;
(function(r) {
  r.ZodString = "ZodString", r.ZodNumber = "ZodNumber", r.ZodNaN = "ZodNaN", r.ZodBigInt = "ZodBigInt", r.ZodBoolean = "ZodBoolean", r.ZodDate = "ZodDate", r.ZodSymbol = "ZodSymbol", r.ZodUndefined = "ZodUndefined", r.ZodNull = "ZodNull", r.ZodAny = "ZodAny", r.ZodUnknown = "ZodUnknown", r.ZodNever = "ZodNever", r.ZodVoid = "ZodVoid", r.ZodArray = "ZodArray", r.ZodObject = "ZodObject", r.ZodUnion = "ZodUnion", r.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", r.ZodIntersection = "ZodIntersection", r.ZodTuple = "ZodTuple", r.ZodRecord = "ZodRecord", r.ZodMap = "ZodMap", r.ZodSet = "ZodSet", r.ZodFunction = "ZodFunction", r.ZodLazy = "ZodLazy", r.ZodLiteral = "ZodLiteral", r.ZodEnum = "ZodEnum", r.ZodEffects = "ZodEffects", r.ZodNativeEnum = "ZodNativeEnum", r.ZodOptional = "ZodOptional", r.ZodNullable = "ZodNullable", r.ZodDefault = "ZodDefault", r.ZodCatch = "ZodCatch", r.ZodPromise = "ZodPromise", r.ZodBranded = "ZodBranded", r.ZodPipeline = "ZodPipeline", r.ZodReadonly = "ZodReadonly";
})(y || (y = {}));
const pt = (r, e = {
  message: `Input not instance of ${r.name}`
}) => ze((t) => t instanceof r, e), De = C.create, Le = $.create, mt = xe.create, yt = P.create, Ue = ee.create, vt = U.create, _t = ve.create, gt = te.create, xt = re.create, kt = H.create, bt = L.create, wt = M.create, Tt = _e.create, Zt = O.create, St = b.create, Ct = b.strictCreate, Ot = se.create, Nt = ke.create, Et = ne.create, Rt = I.create, jt = ae.create, It = ge.create, At = B.create, Mt = J.create, Vt = ie.create, $t = oe.create, Pt = z.create, zt = de.create, Dt = G.create, je = N.create, Lt = R.create, Ut = D.create, Bt = N.createWithPreprocess, Wt = fe.create, qt = () => De().optional(), Jt = () => Le().optional(), Yt = () => Ue().optional(), Ht = {
  string: (r) => C.create(v(d({}, r), { coerce: !0 })),
  number: (r) => $.create(v(d({}, r), { coerce: !0 })),
  boolean: (r) => ee.create(v(d({}, r), {
    coerce: !0
  })),
  bigint: (r) => P.create(v(d({}, r), { coerce: !0 })),
  date: (r) => U.create(v(d({}, r), { coerce: !0 }))
}, Gt = _;
var Xt = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: Y,
  setErrorMap: Ge,
  getErrorMap: pe,
  makeIssue: me,
  EMPTY_PATH: Xe,
  addIssueToContext: f,
  ParseStatus: T,
  INVALID: _,
  DIRTY: q,
  OK: Z,
  isAborted: Ze,
  isDirty: Se,
  isValid: K,
  isAsync: F,
  get util() {
    return k;
  },
  get objectUtil() {
    return Te;
  },
  ZodParsedType: h,
  getParsedType: V,
  ZodType: x,
  datetimeRegex: $e,
  ZodString: C,
  ZodNumber: $,
  ZodBigInt: P,
  ZodBoolean: ee,
  ZodDate: U,
  ZodSymbol: ve,
  ZodUndefined: te,
  ZodNull: re,
  ZodAny: H,
  ZodUnknown: L,
  ZodNever: M,
  ZodVoid: _e,
  ZodArray: O,
  ZodObject: b,
  ZodUnion: se,
  ZodDiscriminatedUnion: ke,
  ZodIntersection: ne,
  ZodTuple: I,
  ZodRecord: ae,
  ZodMap: ge,
  ZodSet: B,
  ZodFunction: J,
  ZodLazy: ie,
  ZodLiteral: oe,
  ZodEnum: z,
  ZodNativeEnum: de,
  ZodPromise: G,
  ZodEffects: N,
  ZodTransformer: N,
  ZodOptional: R,
  ZodNullable: D,
  ZodDefault: ce,
  ZodCatch: ue,
  ZodNaN: xe,
  BRAND: ft,
  ZodBranded: Oe,
  ZodPipeline: fe,
  ZodReadonly: le,
  custom: ze,
  Schema: x,
  ZodSchema: x,
  late: ht,
  get ZodFirstPartyTypeKind() {
    return y;
  },
  coerce: Ht,
  any: kt,
  array: Zt,
  bigint: yt,
  boolean: Ue,
  date: vt,
  discriminatedUnion: Nt,
  effect: je,
  enum: Pt,
  function: Mt,
  instanceof: pt,
  intersection: Et,
  lazy: Vt,
  literal: $t,
  map: It,
  nan: mt,
  nativeEnum: zt,
  never: wt,
  null: xt,
  nullable: Ut,
  number: Le,
  object: St,
  oboolean: Yt,
  onumber: Jt,
  optional: Lt,
  ostring: qt,
  pipeline: Wt,
  preprocess: Bt,
  promise: Dt,
  record: jt,
  set: At,
  strictObject: Ct,
  string: De,
  symbol: _t,
  transformer: je,
  tuple: Rt,
  undefined: gt,
  union: Ot,
  unknown: bt,
  void: Tt,
  NEVER: Gt,
  ZodIssueCode: c,
  quotelessJson: He,
  ZodError: S
});
const Kt = function(r) {
  r.magic("z", () => Xt);
  const e = (a, o = !1) => {
    const i = r.$data(a);
    return o ? JSON.parse(JSON.stringify(i)) : i;
  }, t = (a) => {
    if (typeof a != "object")
      throw new Error("ZValidate: x-data must be an object to use the zvalidate directive.");
    if (!a.zValidateSchema)
      throw new Error("ZValidate: zValidateSchema property is required on x-data model.");
    if (!(a.zValidateSchema instanceof x) || !(a.zValidateSchema instanceof b))
      throw new Error("ZValidate: zValidateSchema must be an instance of a Zod object.");
  }, s = (a) => Object.entries(a.format()).reduce((o, [i, u]) => (i !== "_errors" && Array.isArray(u._errors) && (o[i] = u._errors[0]), o), {}), n = (a) => {
    const { zValidateSchema: o } = r.$data(a);
    return {
      errors: {},
      successes: [],
      isValid(i) {
        return this.successes.includes(i);
      },
      isInvalid(i) {
        return Object.keys(this.errors).includes(i);
      },
      getError(i) {
        var u;
        return (u = this.errors[i]) != null ? u : null;
      },
      reset() {
        this.errors = {}, this.successes = [];
      },
      validate() {
        const i = o.safeParse(e(a, !0));
        return this.reset(), i.success ? (this.successes = Object.keys(e(a, !0)), !0) : (this.errors = s(i.error), !1);
      },
      validateOnly(i) {
        var w;
        if (!o.shape || !(i in o.shape))
          return console.warn(`No validation schema defined for the field: ${i}`), !1;
        const u = { [i]: e(a, !0)[i] }, m = o.shape[i].safeParse(u[i]);
        return m.success ? (delete this.errors[i], this.successes.includes(i) || this.successes.push(i), !0) : (this.successes = this.successes.filter((he) => he !== i), this.errors[i] = (w = m.error.format()._errors[0]) != null ? w : "", !1);
      }
    };
  };
  r.directive("zvalidate", (a, { expression: o }, { cleanup: i }) => {
    const u = e(a);
    if (t(u), u.zvalidate || (u.zvalidate = n(a)), o) {
      const l = (m) => {
        const w = m.target.getAttribute("x-model");
        w && u.zvalidate.validateOnly(w);
      };
      a.addEventListener(o, l), i(() => a.removeEventListener(o, l));
    }
  });
};
export {
  Kt as z
};
//# sourceMappingURL=zValidate-B7j4VmZE.js.map
