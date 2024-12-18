import {z, ZodType, ZodObject} from 'zod';
import {merge} from 'lodash';

const zValidation = (Alpine) => {

    const getEntangledModels = (el) => {
        const xDataString = el.getAttribute('x-data');
        const entanglePattern = /(\w+):\s*window\.Livewire\.find\('[^']+'\)\.entangle\('([^']+)'\)(?:\.live)?/g;

        const result = {};

        let match;
        while ((match = entanglePattern.exec(xDataString)) !== null) {
            const [_, propName, modelName] = match;
            result[propName] = modelName;
        }

        return result;
    };

    const mapEntangledModels = (el, errors) => {
        const entangledModels = getEntangledModels(el);
        const mappedErrors = {};

        for (const [propName, modelName] of Object.entries(entangledModels)) {
            const modelErrors = errors[modelName];
            if (modelErrors) {
                mappedErrors[propName] = modelErrors;
            }
        }

        return mappedErrors
    }

    const bingLivewireCommitHook = () => {
        Livewire.hook('commit', ({component, succeed}) => {
            succeed(({snapshot}) => {
                try {
                    const errors = JSON.parse(snapshot).memo.errors;
                    const childComponents = component.el.querySelectorAll('[x-data]');

                    [component.el, ...childComponents].forEach(element => {
                        try {
                            let alpineComponent = Alpine.$data(element);

                            if (alpineComponent && alpineComponent._zProcessLivewireErrors) {
                                const mappedErrors = mapEntangledModels(element, errors);
                                alpineComponent._zProcessLivewireErrors(mappedErrors);
                            }
                        } catch (componentError) {
                            console.warn('zValidation: Error processing Alpine component:', componentError);
                        }
                    });
                } catch (error) {
                    console.error('zValidation: Error in Livewire commit hook:', error);
                }
            });
        });
    }


    const checkEntangledCompatibility = () => {
        if (typeof Livewire === 'undefined') {
            console.warn('zValidation: Livewire is not defined. Make sure you have Livewire installed and initialized to use entangled modifier.');
            return false;
        }

        if (typeof Livewire.hook !== 'function') {
            console.warn('zValidation: Livewire version is not compatible. Make sure you are using Livewire v2.5.0 or higher to use entangled modifier.');
            return false;
        }

        return true;
    }

    const bindComponentHelpers = (el, Alpine) => {
        Alpine.bind(el, {
            'x-init'() {
                this._zCheckZodSchema();
            },
            'x-data'() {

                return {
                    /**
                     * @type {ZodObject|undefined}
                     * @property zSchema: ZodObject
                     */
                    //zSchema: undefined,

                    zFormState: {errors: {}, successes: {}}, // Form state

                    _zCheckZodSchema() {
                        if (typeof this.zSchema === 'undefined') {
                            console.warn('zValidation: x-data must define the zSchema property.');
                        }

                        if (!(this.zSchema instanceof ZodType) || !(this.zSchema instanceof ZodObject)) {
                            console.warn('zValidation: zSchema must be an instance of a Zod object.');
                        }
                    },

                    _zProcessLivewireErrors(errors) {
                        this.zFormState.errors = merge(
                            errors,
                            this.zFormState.errors
                        )
                    },

                    _zParseZodErrors(zodError) {
                        return Object.entries(zodError?.format() ?? {}).reduce((errors, [field, value]) => {
                            if (field !== '_errors' && Array.isArray(value['_errors'])) {
                                errors[field] = [value['_errors'][0]];
                            }
                            return errors;
                        }, {});
                    },
                    _zParseZodSuccesses(zodError, schema) {
                        const errors = zodError.format();
                        return Object.keys(schema).reduce((successes, field) => {
                            successes[field] = !Object.keys(errors).includes(field);
                            return successes;
                        }, {});
                    },
                    _zProcessZodValidation() {

                        const result = this.zSchema.safeParse(this);
                        if (result.success) {
                            this.zFormState.errors = {};
                            this.zFormState.successes = Object.keys(this.zSchema.shape).reduce((successes, field) => {
                                successes[field] = true;
                                return successes;
                            }, {});
                            return true;
                        }

                        this.zFormState.errors = this._zParseZodErrors(result.error);
                        this.zFormState.successes = this._zParseZodSuccesses(result.error, this.zSchema.shape);
                        return false;
                    },

                    _zProcessZodFieldValidation(field) {
                        const fieldSchema = this.zSchema.shape[field] ?? null;
                        if (!fieldSchema) {
                            console.warn(`zValidation: No validation schema defined for the field: ${field}`);
                            return false;
                        }

                        const result = fieldSchema.safeParse(this[field]);
                        if (result.success) {
                            delete this.zFormState.errors[field];
                            this.zFormState.successes[field] = true;
                            return true;
                        }

                        this.zFormState.errors[field] = [result.error.format()._errors[0]];
                        this.zFormState.successes[field] = false;
                        return false;
                    },

                    zIsValid(field) {
                        return this.zFormState.successes[field] ?? false;
                    },
                    zIsInvalid(field) {
                        return Object.keys(this.zFormState.errors).includes(field);
                    },
                    zFirstErrorFor(field) {
                        if (this.zFormState.errors[field]) {
                            return this.zFormState.errors[field][0] ?? null;
                        }
                        return null;
                    },
                    zGetErrorsFor(field) {
                        return this.zFormState.errors[field] ?? [];
                    },
                    zAllErrors() {
                        return this.zFormState.errors;
                    },
                    zHasErrors() {
                        return Object.keys(this.zFormState.errors).length > 0;
                    },
                    zAllSuccesses() {
                        return this.zFormState.successes;
                    },
                    zReset() {
                        this.zFormState.errors = {};
                        this.zFormState.successes = [];
                    },
                    zValidate() {
                        this.zReset();
                        this._zProcessZodValidation();
                        return !this.zHasErrors();
                    },
                    zValidateOnly(field) {
                        this._zProcessZodFieldValidation(field);
                        return !this.zIsInvalid(field);
                    }
                };
            }
        })
    }

    const bindEventListeners = (event, reactiveOnError, el, Alpine, cleanup) => {
        Alpine.bind(el, {
            'x-init'() {
                this._zSetupListeners(event, reactiveOnError)
            },
            'x-data'() {
                return {
                    _zEventListeners: [],
                    _zSetupListeners(event, reactiveOnError) {
                        Array.from(this.$root.querySelectorAll('[x-model]'))
                            .forEach((input) => {
                                const field = input.getAttribute('x-model');

                                if (!Object.keys(this.zSchema.shape).includes(field)) return;

                                const listener = input.addEventListener(event, () => {
                                    this.$nextTick(() => this.zValidateOnly(field));
                                });

                                this._zEventListeners.push({field, listener, event: event});

                                //Input listener if event is not input and field already has an error
                                if (event !== 'input' && reactiveOnError) {
                                    const inputListener = input.addEventListener('input', () => {
                                        this.$nextTick(() => {
                                            if(this.zIsInvalid(field)) {
                                                this.zValidateOnly(field);
                                            }
                                        });
                                    });

                                    this._zEventListeners.push({field, listener: inputListener, event: 'input'});
                                }
                            });
                    }
                }
            }
        });
    }


    Alpine.magic('z', () => z);

    Alpine.directive('zvalidation', (el, {modifiers, expression}, {cleanup}) => {


        bindComponentHelpers(el, Alpine);

        if (
            modifiers.includes('entangled') &&
            checkEntangledCompatibility()
        ) {
            bingLivewireCommitHook();
        }

        if (modifiers.includes('listen') && expression) {
            const eventToListen = expression;
            const reactiveOnError = modifiers.includes('reactive');
            bindEventListeners(eventToListen, reactiveOnError, el, Alpine, cleanup);
        }

    }).before('bind');
}

export {zValidation}
