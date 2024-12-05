import {z, ZodType, ZodObject} from 'zod';
import {merge} from 'lodash';

const zValidation = function (Alpine) {

    Alpine.magic('z', () => z);

    Alpine.magic('zValidation', (el) => {
        const {zValidateSchema: zSchema} = Alpine.$data(el);
        const formState = upsertFormState(el, {errors: {}, successes: []});

        return {
            isValid(field) {
                return formState.successes.includes(field);
            },
            isInvalid(field) {
                return Object.keys(formState.errors).includes(field);
            },
            getError(field) {
                return formState.errors[field] ?? null;
            },
            getErrors() {
                return formState.errors;
            },
            reset() {
                formState.errors = {};
                formState.successes = [];
            },
            validate() {
                this.reset();

                const result = zSchema.safeParse(getData(el, true));

                const errors = parseErrors(result.error);
                const successes = Object.keys(zSchema.shape).filter(field => !Object.keys(errors).includes(field));

                formState.errors = errors;
                formState.successes = successes;

                return result.success;
            },
            validateOnly(field) {
                if (!zSchema.shape || !(field in zSchema.shape)) {
                    console.warn(`No validation schema defined for the field: ${field}`);
                    return false;
                }

                const fieldData = {[field]: getData(el, true)[field]};
                const fieldSchema = zSchema.shape[field];

                const result = fieldSchema.safeParse(fieldData[field]);

                if (result.success) {
                    delete formState.errors[field];
                    if (!formState.successes.includes(field)) {
                        formState.successes.push(field);
                    }
                    return true;
                }

                formState.successes = formState.successes.filter(v => v !== field);
                formState.errors[field] = result.error.format()._errors[0] ?? '';
                return false;
            }
        };

    })

    const getElId = (el) => Alpine.$data(el).$id();

    const getFormState = (el) => window.zValidation[getElId(el)] ?? Alpine.reactive({errors: {}, successes: []});

    const upsertFormState = (el, value) => {
        window.zValidation = window.zValidation ?? {};
        window.zValidation[getElId(el)] = merge(getFormState(el), value);
        return window.zValidation[getElId(el)];
    }

    const getData = (el, parse = false) => {
        const data = Alpine.$data(el);
        return parse ? JSON.parse(JSON.stringify(data)) : data;
    };

    const checkCompatibility = (data) => {
        if (typeof data !== 'object') {
            throw new Error('ZValidate: x-data must be an object to use the zvalidate directive.');
        }

        if (!data.zValidateSchema) {
            throw new Error('ZValidate: zValidateSchema property is required on x-data model.');
        }

        if (!(data.zValidateSchema instanceof ZodType) || !(data.zValidateSchema instanceof ZodObject)) {
            throw new Error('ZValidate: zValidateSchema must be an instance of a Zod object.');
        }
    };

    const parseErrors = (zodError) => {
        return Object.entries(zodError?.format() ?? {}).reduce((errors, [field, value]) => {
            if (field !== '_errors' && Array.isArray(value['_errors'])) {
                errors[field] = value['_errors'][0];
            }
            return errors;
        }, {});
    };

    Alpine.directive('zvalidate', (el, {expression}, {effect, cleanup}) => {
        effect(() => {
            const data = getData(el);
            checkCompatibility(data);

            if (expression) {

                const handler = (event) => {
                    const model = event.target.getAttribute('x-model');
                    if (model) {
                        const alpineData = Alpine.$data(el);
                        if(alpineData?.$zValidation?.validateOnly && alpineData[model] !== undefined) {
                            alpineData.$zValidation.validateOnly(model);
                        }
                    }
                };

                const listeners = [];
                const dataKeys = Object.keys(getData(el, true));

                dataKeys.forEach(field => {
                    if(field === 'zValidateSchema') return;
                    const modelledEl = el.querySelector(`[x-model="${field}"]`);
                    if(!modelledEl) return;

                    listeners.push({
                        field,
                        listener: modelledEl.addEventListener(expression, handler)
                    });
                });

                cleanup(() => {
                    listeners.forEach(({field, listener}) => field.removeEventListener(expression, listener));
                });
            }
        })
    })
}

export {zValidation}