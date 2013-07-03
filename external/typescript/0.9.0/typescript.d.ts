declare module TypeScript {
    class ArrayUtilities {
        static isArray(value: any): boolean;
        static sequenceEquals(array1: any[], array2: any[], equals: (v1: any, v2: any) => boolean): boolean;
        static contains(array: any[], value: any): boolean;
        static groupBy(array: any[], func: (v: any) => string): any;
        static min(array: any[], func: (v: any) => number): number;
        static max(array: any[], func: (v: any) => number): number;
        static last(array: any[]);
        static firstOrDefault(array: any[], func: (v: any) => boolean): any;
        static sum(array: any[], func: (v: any) => number): number;
        static whereNotNull(array: any[]): any[];
        static select(values: any[], func: (v: any) => any): any[];
        static where(values: any[], func: (v: any) => boolean): any[];
        static any(array: any[], func: (v: any) => boolean): boolean;
        static all(array: any[], func: (v: any) => boolean): boolean;
        static binarySearch(array: number[], value: number): number;
        static createArray(length: number, defaultvalue: any): any[];
        static grow(array: any[], length: number, defaultValue: any): void;
        static copy(sourceArray: any[], sourceIndex: number, destinationArray: any[], destinationIndex: number, length: number): void;
    }
}
declare module TypeScript {
    enum Constants {
        Max31BitInteger,
        Min31BitInteger,
    }
}
declare module TypeScript {
    class Contract {
        static requires(expression: boolean): void;
        static throwIfFalse(expression: boolean): void;
        static throwIfNull(value: any): void;
    }
}
declare module TypeScript {
    class Debug {
        static assert(expression: boolean, message?: string): void;
    }
}
declare module TypeScript {
    enum DiagnosticCategory {
        Warning,
        Error,
        Message,
        NoPrefix,
    }
}
declare module TypeScript {
    enum DiagnosticCode {
        error_TS_0__1,
        warning_TS_0__1,
        _0__NL__1_TB__2,
        _0_TB__1,
        _legacy_diagnostics,
        Unrecognized_escape_sequence,
        Unexpected_character_0,
        Missing_closing_quote_character,
        Identifier_expected,
        _0_keyword_expected,
        _0_expected,
        Identifier_expected__0__is_a_keyword,
        Automatic_semicolon_insertion_not_allowed,
        Unexpected_token__0_expected,
        Trailing_separator_not_allowed,
        _StarSlash__expected,
        _public_or_private_modifier_must_precede__static_,
        Unexpected_token_,
        A_catch_clause_variable_cannot_have_a_type_annotation,
        Rest_parameter_must_be_last_in_list,
        Parameter_cannot_have_question_mark_and_initializer,
        Required_parameter_cannot_follow_optional_parameter,
        Index_signatures_cannot_have_rest_parameters,
        Index_signature_parameter_cannot_have_accessibility_modifiers,
        Index_signature_parameter_cannot_have_a_question_mark,
        Index_signature_parameter_cannot_have_an_initializer,
        Index_signature_must_have_a_type_annotation,
        Index_signature_parameter_must_have_a_type_annotation,
        Index_signature_parameter_type_must_be__string__or__number_,
        _extends__clause_already_seen,
        _extends__clause_must_precede__implements__clause,
        Class_can_only_extend_single_type,
        _implements__clause_already_seen,
        Accessibility_modifier_already_seen,
        _0__modifier_must_precede__1__modifier,
        _0__modifier_already_seen,
        _0__modifier_cannot_appear_on_a_class_element,
        Interface_declaration_cannot_have__implements__clause,
        _super__invocation_cannot_have_type_arguments,
        Non_ambient_modules_cannot_use_quoted_names,
        Statements_are_not_allowed_in_ambient_contexts,
        Implementations_are_not_allowed_in_ambient_contexts,
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context,
        Initializers_are_not_allowed_in_ambient_contexts,
        Overload_and_ambient_signatures_cannot_specify_parameter_properties,
        Function_implementation_expected,
        Constructor_implementation_expected,
        Function_overload_name_must_be__0_,
        _0__modifier_cannot_appear_on_a_module_element,
        _declare__modifier_cannot_appear_on_an_interface_declaration,
        _declare__modifier_required_for_top_level_element,
        _set__accessor_must_have_only_one_parameter,
        _set__accessor_parameter_cannot_have_accessibility_modifier,
        _set__accessor_parameter_cannot_be_optional,
        _set__accessor_parameter_cannot_have_initializer,
        _set__accessor_cannot_have_rest_parameter,
        _get__accessor_cannot_have_parameters,
        Rest_parameter_cannot_be_optional,
        Rest_parameter_cannot_have_initializer,
        Modifiers_cannot_appear_here,
        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher,
        Class_name_cannot_be__0_,
        Interface_name_cannot_be__0_,
        Enum_name_cannot_be__0_,
        Module_name_cannot_be__0_,
        Enum_member_must_have_initializer,
        _module_______is_deprecated__Use__require_______instead,
        Export_assignments_cannot_be_used_in_internal_modules,
        Export_assignment_not_allowed_in_module_with_exported_element,
        Module_cannot_have_multiple_export_assignments,
        _syntax_diagnostics,
        Duplicate_identifier__0_,
        The_name__0__does_not_exist_in_the_current_scope,
        The_name__0__does_not_refer_to_a_value,
        Keyword__super__can_only_be_used_inside_a_class_instance_method,
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer,
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__,
        Value_of_type__0__is_not_callable,
        Value_of_type__0__is_not_newable,
        Value_of_type__0__is_not_indexable_by_type__1_,
        Operator__0__cannot_be_applied_to_types__1__and__2_,
        Operator__0__cannot_be_applied_to_types__1__and__2__3,
        Cannot_convert__0__to__1_,
        Cannot_convert__0__to__1__NL__2,
        Expected_var__class__interface__or_module,
        Operator__0__cannot_be_applied_to_type__1_,
        Getter__0__already_declared,
        Setter__0__already_declared,
        Accessor_cannot_have_type_parameters,
        Exported_class__0__extends_private_class__1_,
        Exported_class__0__implements_private_interface__1_,
        Exported_interface__0__extends_private_interface__1_,
        Exported_class__0__extends_class_from_inaccessible_module__1_,
        Exported_class__0__implements_interface_from_inaccessible_module__1_,
        Exported_interface__0__extends_interface_from_inaccessible_module__1_,
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_,
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_,
        Property__0__of__exported_interface_has_or_is_using_private_type__1_,
        Exported_variable__0__has_or_is_using_private_type__1_,
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_,
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_,
        Property__0__of__exported_interface_is_using_inaccessible_module__1_,
        Exported_variable__0__is_using_inaccessible_module__1_,
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_,
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_,
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_exported_function_has_or_is_using_private_type__0_,
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_exported_function_is_using_inaccessible_module__0_,
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead,
        A_parameter_list_must_follow_a_generic_type_argument_list______expected,
        Multiple_constructor_implementations_are_not_allowed,
        Unable_to_resolve_external_module__0_,
        Module_cannot_be_aliased_to_a_non_module_type,
        A_class_may_only_extend_another_class,
        A_class_may_only_implement_another_class_or_interface,
        An_interface_may_only_extend_another_class_or_interface,
        An_interface_cannot_implement_another_type,
        Unable_to_resolve_type,
        Unable_to_resolve_type_of__0_,
        Unable_to_resolve_type_parameter_constraint,
        Type_parameter_constraint_cannot_be_a_primitive_type,
        Supplied_parameters_do_not_match_any_signature_of_call_target,
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0,
        Invalid__new__expression,
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type,
        Could_not_select_overload_for__new__expression,
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_,
        Could_not_select_overload_for__call__expression,
        Unable_to_invoke_type_with_no_call_signatures,
        Calls_to__super__are_only_valid_inside_a_class,
        Generic_type__0__requires_1_type_argument_s_,
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_,
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements,
        Could_not_find_enclosing_symbol_for_dotted_name__0_,
        The_property__0__does_not_exist_on_value_of_type__1__,
        Could_not_find_symbol__0_,
        _get__and__set__accessor_must_have_the_same_type,
        _this__cannot_be_referenced_in_current_location,
        Use_of_deprecated__bool__type__Use__boolean__instead,
        Class__0__is_recursively_referenced_as_a_base_type_of_itself,
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself,
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class,
        _super__cannot_be_referenced_in_non_derived_classes,
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties,
        Constructors_for_derived_classes_must_contain_a__super__call,
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors,
        _0_1__is_inaccessible,
        _this__cannot_be_referenced_within_module_bodies,
        _this__must_only_be_used_inside_a_function_or_script_context,
        Invalid__addition__expression___types_do_not_agree,
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type,
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type,
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type,
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation,
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_,
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter,
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_,
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter,
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter,
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type,
        Setters_cannot_return_a_value,
        Tried_to_set_variable_type_to_module_type__0__,
        Tried_to_set_variable_type_to_uninitialized_module_type__0__,
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression,
        Getters_must_return_a_value,
        Getter_and_setter_accessors_do_not_agree_in_visibility,
        Invalid_left_hand_side_of_assignment_expression,
        Function_declared_a_non_void_return_type__but_has_no_return_expression,
        Cannot_resolve_return_type_reference,
        Constructors_cannot_have_a_return_type_of__void_,
        Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_,
        All_symbols_within_a__with__block_will_be_resolved_to__any__,
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module,
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2,
        Class__0__declares_class__1__but_does_not_implement_it__NL__2,
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer,
        _this__cannot_be_referenced_in_initializers_in_a_class_body,
        Class__0__cannot_extend_class__1__NL__2,
        Interface__0__cannot_extend_class__1__NL__2,
        Interface__0__cannot_extend_interface__1__NL__2,
        Duplicate_overload_signature_for__0_,
        Duplicate_constructor_overload_signature,
        Duplicate_overload_call_signature,
        Duplicate_overload_construct_signature,
        Overload_signature_is_not_compatible_with_function_definition,
        Overload_signature_is_not_compatible_with_function_definition__NL__0,
        Overload_signatures_must_all_be_public_or_private,
        Overload_signatures_must_all_be_exported_or_local,
        Overload_signatures_must_all_be_ambient_or_non_ambient,
        Overload_signatures_must_all_be_optional_or_required,
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature,
        _this__cannot_be_referenced_in_constructor_arguments,
        Static_member_cannot_be_accessed_off_an_instance_variable,
        Instance_member_cannot_be_accessed_off_a_class,
        Untyped_function_calls_may_not_accept_type_arguments,
        Non_generic_functions_may_not_accept_type_arguments,
        A_generic_type_may_not_reference_itself_with_its_own_type_parameters,
        Static_methods_cannot_reference_class_type_parameters,
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___,
        Rest_parameters_must_be_array_types,
        Overload_signature_implementation_cannot_use_specialized_type,
        Export_assignments_may_only_be_used_in_External_modules,
        Export_assignments_may_only_be_made_with_acceptable_kinds,
        Only_public_instance_methods_of_the_base_class_are_accessible_via_the_super_keyword,
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1__,
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1____NL__2,
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0__,
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0____NL__1,
        All_named_properties_must_be_subtypes_of_string_indexer_type___0__,
        All_named_properties_must_be_subtypes_of_string_indexer_type___0____NL__1,
        Generic_type_references_must_include_all_type_arguments,
        Type__0__is_missing_property__1__from_type__2_,
        Types_of_property__0__of_types__1__and__2__are_incompatible,
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3,
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_,
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_,
        Types__0__and__1__define_property__2__as_private,
        Call_signatures_of_types__0__and__1__are_incompatible,
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Type__0__requires_a_call_signature__but_Type__1__lacks_one,
        Construct_signatures_of_types__0__and__1__are_incompatible,
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one,
        Index_signatures_of_types__0__and__1__are_incompatible,
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Call_signature_expects__0__or_fewer_parameters,
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_,
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function,
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function,
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor,
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property,
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible,
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3,
        Type_reference_cannot_refer_to_container__0_,
        Type_reference_must_refer_to_type,
        Enums_with_multiple_declarations_must_provide_an_initializer_for_the_first_enum_element,
        _semantic_diagnostics,
        Current_host_does_not_support__w_atch_option,
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation,
        Module_code_generation__0__not_supported___Using_default__1__code_generation,
        Could_not_find_file___0_,
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed,
        A_file_cannot_have_a_reference_itself,
        Cannot_resolve_referenced_file___0_,
        Cannot_resolve_imported_file___0_,
        Cannot_find_the_common_subdirectory_path_for_the_input_files,
        Cannot_compile_dynamic_modules_when_emitting_into_single_file,
        Emit_Error__0,
        Unsupported_encoding_for_file__0,
    }
}
declare module TypeScript {
    interface DiagnosticInfo {
        category: TypeScript.DiagnosticCategory;
        message: string;
        code: number;
    }
}
declare module TypeScript {
    interface IDiagnosticMessages {
        error_TS_0__1: TypeScript.DiagnosticInfo;
        warning_TS_0__1: TypeScript.DiagnosticInfo;
        _0__NL__1_TB__2: TypeScript.DiagnosticInfo;
        _0_TB__1: TypeScript.DiagnosticInfo;
        Unrecognized_escape_sequence: TypeScript.DiagnosticInfo;
        Unexpected_character_0: TypeScript.DiagnosticInfo;
        Missing_closing_quote_character: TypeScript.DiagnosticInfo;
        Identifier_expected: TypeScript.DiagnosticInfo;
        _0_keyword_expected: TypeScript.DiagnosticInfo;
        _0_expected: TypeScript.DiagnosticInfo;
        Identifier_expected__0__is_a_keyword: TypeScript.DiagnosticInfo;
        Automatic_semicolon_insertion_not_allowed: TypeScript.DiagnosticInfo;
        Unexpected_token__0_expected: TypeScript.DiagnosticInfo;
        Trailing_separator_not_allowed: TypeScript.DiagnosticInfo;
        _StarSlash__expected: TypeScript.DiagnosticInfo;
        _public_or_private_modifier_must_precede__static_: TypeScript.DiagnosticInfo;
        Unexpected_token_: TypeScript.DiagnosticInfo;
        A_catch_clause_variable_cannot_have_a_type_annotation: TypeScript.DiagnosticInfo;
        Rest_parameter_must_be_last_in_list: TypeScript.DiagnosticInfo;
        Parameter_cannot_have_question_mark_and_initializer: TypeScript.DiagnosticInfo;
        Required_parameter_cannot_follow_optional_parameter: TypeScript.DiagnosticInfo;
        Index_signatures_cannot_have_rest_parameters: TypeScript.DiagnosticInfo;
        Index_signature_parameter_cannot_have_accessibility_modifiers: TypeScript.DiagnosticInfo;
        Index_signature_parameter_cannot_have_a_question_mark: TypeScript.DiagnosticInfo;
        Index_signature_parameter_cannot_have_an_initializer: TypeScript.DiagnosticInfo;
        Index_signature_must_have_a_type_annotation: TypeScript.DiagnosticInfo;
        Index_signature_parameter_must_have_a_type_annotation: TypeScript.DiagnosticInfo;
        Index_signature_parameter_type_must_be__string__or__number_: TypeScript.DiagnosticInfo;
        _extends__clause_already_seen: TypeScript.DiagnosticInfo;
        _extends__clause_must_precede__implements__clause: TypeScript.DiagnosticInfo;
        Class_can_only_extend_single_type: TypeScript.DiagnosticInfo;
        _implements__clause_already_seen: TypeScript.DiagnosticInfo;
        Accessibility_modifier_already_seen: TypeScript.DiagnosticInfo;
        _0__modifier_must_precede__1__modifier: TypeScript.DiagnosticInfo;
        _0__modifier_already_seen: TypeScript.DiagnosticInfo;
        _0__modifier_cannot_appear_on_a_class_element: TypeScript.DiagnosticInfo;
        Interface_declaration_cannot_have__implements__clause: TypeScript.DiagnosticInfo;
        _super__invocation_cannot_have_type_arguments: TypeScript.DiagnosticInfo;
        Non_ambient_modules_cannot_use_quoted_names: TypeScript.DiagnosticInfo;
        Statements_are_not_allowed_in_ambient_contexts: TypeScript.DiagnosticInfo;
        Implementations_are_not_allowed_in_ambient_contexts: TypeScript.DiagnosticInfo;
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context: TypeScript.DiagnosticInfo;
        Initializers_are_not_allowed_in_ambient_contexts: TypeScript.DiagnosticInfo;
        Overload_and_ambient_signatures_cannot_specify_parameter_properties: TypeScript.DiagnosticInfo;
        Function_implementation_expected: TypeScript.DiagnosticInfo;
        Constructor_implementation_expected: TypeScript.DiagnosticInfo;
        Function_overload_name_must_be__0_: TypeScript.DiagnosticInfo;
        _0__modifier_cannot_appear_on_a_module_element: TypeScript.DiagnosticInfo;
        _declare__modifier_cannot_appear_on_an_interface_declaration: TypeScript.DiagnosticInfo;
        _declare__modifier_required_for_top_level_element: TypeScript.DiagnosticInfo;
        Rest_parameter_cannot_be_optional: TypeScript.DiagnosticInfo;
        Rest_parameter_cannot_have_initializer: TypeScript.DiagnosticInfo;
        _set__accessor_parameter_cannot_have_accessibility_modifier: TypeScript.DiagnosticInfo;
        _set__accessor_parameter_cannot_be_optional: TypeScript.DiagnosticInfo;
        _set__accessor_parameter_cannot_have_initializer: TypeScript.DiagnosticInfo;
        _set__accessor_cannot_have_rest_parameter: TypeScript.DiagnosticInfo;
        _get__accessor_cannot_have_parameters: TypeScript.DiagnosticInfo;
        Modifiers_cannot_appear_here: TypeScript.DiagnosticInfo;
        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher: TypeScript.DiagnosticInfo;
        Enum_member_must_have_initializer: TypeScript.DiagnosticInfo;
        _module_______is_deprecated__Use__require_______instead: TypeScript.DiagnosticInfo;
        Export_assignments_cannot_be_used_in_internal_modules: TypeScript.DiagnosticInfo;
        Export_assignment_not_allowed_in_module_with_exported_element: TypeScript.DiagnosticInfo;
        Module_cannot_have_multiple_export_assignments: TypeScript.DiagnosticInfo;
        Duplicate_identifier__0_: TypeScript.DiagnosticInfo;
        The_name__0__does_not_exist_in_the_current_scope: TypeScript.DiagnosticInfo;
        The_name__0__does_not_refer_to_a_value: TypeScript.DiagnosticInfo;
        Keyword__super__can_only_be_used_inside_a_class_instance_method: TypeScript.DiagnosticInfo;
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: TypeScript.DiagnosticInfo;
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: TypeScript.DiagnosticInfo;
        Value_of_type__0__is_not_callable: TypeScript.DiagnosticInfo;
        Value_of_type__0__is_not_newable: TypeScript.DiagnosticInfo;
        Value_of_type__0__is_not_indexable_by_type__1_: TypeScript.DiagnosticInfo;
        Operator__0__cannot_be_applied_to_types__1__and__2_: TypeScript.DiagnosticInfo;
        Operator__0__cannot_be_applied_to_types__1__and__2__3: TypeScript.DiagnosticInfo;
        Cannot_convert__0__to__1_: TypeScript.DiagnosticInfo;
        Cannot_convert__0__to__1__NL__2: TypeScript.DiagnosticInfo;
        Expected_var__class__interface__or_module: TypeScript.DiagnosticInfo;
        Operator__0__cannot_be_applied_to_type__1_: TypeScript.DiagnosticInfo;
        Getter__0__already_declared: TypeScript.DiagnosticInfo;
        Setter__0__already_declared: TypeScript.DiagnosticInfo;
        Accessor_cannot_have_type_parameters: TypeScript.DiagnosticInfo;
        _set__accessor_must_have_only_one_parameter: TypeScript.DiagnosticInfo;
        Use_of_deprecated__bool__type__Use__boolean__instead: TypeScript.DiagnosticInfo;
        Exported_class__0__extends_private_class__1_: TypeScript.DiagnosticInfo;
        Exported_class__0__implements_private_interface__1_: TypeScript.DiagnosticInfo;
        Exported_interface__0__extends_private_interface__1_: TypeScript.DiagnosticInfo;
        Exported_class__0__extends_class_from_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Exported_class__0__implements_interface_from_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Exported_interface__0__extends_interface_from_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Property__0__of__exported_interface_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Exported_variable__0__has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Property__0__of__exported_interface_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Exported_variable__0__is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_: TypeScript.DiagnosticInfo;
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_exported_function_has_or_is_using_private_type__0_: TypeScript.DiagnosticInfo;
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_: TypeScript.DiagnosticInfo;
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead: TypeScript.DiagnosticInfo;
        A_parameter_list_must_follow_a_generic_type_argument_list______expected: TypeScript.DiagnosticInfo;
        Multiple_constructor_implementations_are_not_allowed: TypeScript.DiagnosticInfo;
        Unable_to_resolve_external_module__0_: TypeScript.DiagnosticInfo;
        Module_cannot_be_aliased_to_a_non_module_type: TypeScript.DiagnosticInfo;
        A_class_may_only_extend_another_class: TypeScript.DiagnosticInfo;
        A_class_may_only_implement_another_class_or_interface: TypeScript.DiagnosticInfo;
        An_interface_may_only_extend_another_class_or_interface: TypeScript.DiagnosticInfo;
        An_interface_cannot_implement_another_type: TypeScript.DiagnosticInfo;
        Unable_to_resolve_type: TypeScript.DiagnosticInfo;
        Unable_to_resolve_type_of__0_: TypeScript.DiagnosticInfo;
        Unable_to_resolve_type_parameter_constraint: TypeScript.DiagnosticInfo;
        Type_parameter_constraint_cannot_be_a_primitive_type: TypeScript.DiagnosticInfo;
        Supplied_parameters_do_not_match_any_signature_of_call_target: TypeScript.DiagnosticInfo;
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0: TypeScript.DiagnosticInfo;
        Invalid__new__expression: TypeScript.DiagnosticInfo;
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type: TypeScript.DiagnosticInfo;
        Could_not_select_overload_for__new__expression: TypeScript.DiagnosticInfo;
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_: TypeScript.DiagnosticInfo;
        Could_not_select_overload_for__call__expression: TypeScript.DiagnosticInfo;
        Unable_to_invoke_type_with_no_call_signatures: TypeScript.DiagnosticInfo;
        Calls_to__super__are_only_valid_inside_a_class: TypeScript.DiagnosticInfo;
        Generic_type__0__requires_1_type_argument_s_: TypeScript.DiagnosticInfo;
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_: TypeScript.DiagnosticInfo;
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements: TypeScript.DiagnosticInfo;
        Could_not_find_enclosing_symbol_for_dotted_name__0_: TypeScript.DiagnosticInfo;
        The_property__0__does_not_exist_on_value_of_type__1__: TypeScript.DiagnosticInfo;
        Could_not_find_symbol__0_: TypeScript.DiagnosticInfo;
        _get__and__set__accessor_must_have_the_same_type: TypeScript.DiagnosticInfo;
        _this__cannot_be_referenced_in_current_location: TypeScript.DiagnosticInfo;
        Class__0__is_recursively_referenced_as_a_base_type_of_itself: TypeScript.DiagnosticInfo;
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself: TypeScript.DiagnosticInfo;
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class: TypeScript.DiagnosticInfo;
        _super__cannot_be_referenced_in_non_derived_classes: TypeScript.DiagnosticInfo;
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties: TypeScript.DiagnosticInfo;
        Constructors_for_derived_classes_must_contain_a__super__call: TypeScript.DiagnosticInfo;
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: TypeScript.DiagnosticInfo;
        _0_1__is_inaccessible: TypeScript.DiagnosticInfo;
        _this__cannot_be_referenced_within_module_bodies: TypeScript.DiagnosticInfo;
        _this__must_only_be_used_inside_a_function_or_script_context: TypeScript.DiagnosticInfo;
        Invalid__addition__expression___types_do_not_agree: TypeScript.DiagnosticInfo;
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: TypeScript.DiagnosticInfo;
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: TypeScript.DiagnosticInfo;
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type: TypeScript.DiagnosticInfo;
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation: TypeScript.DiagnosticInfo;
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_: TypeScript.DiagnosticInfo;
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter: TypeScript.DiagnosticInfo;
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_: TypeScript.DiagnosticInfo;
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: TypeScript.DiagnosticInfo;
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: TypeScript.DiagnosticInfo;
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type: TypeScript.DiagnosticInfo;
        Setters_cannot_return_a_value: TypeScript.DiagnosticInfo;
        Tried_to_set_variable_type_to_module_type__0__: TypeScript.DiagnosticInfo;
        Tried_to_set_variable_type_to_uninitialized_module_type__0__: TypeScript.DiagnosticInfo;
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression: TypeScript.DiagnosticInfo;
        Getters_must_return_a_value: TypeScript.DiagnosticInfo;
        Getter_and_setter_accessors_do_not_agree_in_visibility: TypeScript.DiagnosticInfo;
        Invalid_left_hand_side_of_assignment_expression: TypeScript.DiagnosticInfo;
        Function_declared_a_non_void_return_type__but_has_no_return_expression: TypeScript.DiagnosticInfo;
        Cannot_resolve_return_type_reference: TypeScript.DiagnosticInfo;
        Constructors_cannot_have_a_return_type_of__void_: TypeScript.DiagnosticInfo;
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module: TypeScript.DiagnosticInfo;
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2: TypeScript.DiagnosticInfo;
        Class__0__declares_class__1__but_does_not_implement_it__NL__2: TypeScript.DiagnosticInfo;
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer: TypeScript.DiagnosticInfo;
        _this__cannot_be_referenced_in_initializers_in_a_class_body: TypeScript.DiagnosticInfo;
        Class__0__cannot_extend_class__1__NL__2: TypeScript.DiagnosticInfo;
        Interface__0__cannot_extend_class__1__NL__2: TypeScript.DiagnosticInfo;
        Interface__0__cannot_extend_interface__1__NL__2: TypeScript.DiagnosticInfo;
        Duplicate_overload_signature_for__0_: TypeScript.DiagnosticInfo;
        Duplicate_constructor_overload_signature: TypeScript.DiagnosticInfo;
        Duplicate_overload_call_signature: TypeScript.DiagnosticInfo;
        Duplicate_overload_construct_signature: TypeScript.DiagnosticInfo;
        Overload_signature_is_not_compatible_with_function_definition: TypeScript.DiagnosticInfo;
        Overload_signature_is_not_compatible_with_function_definition__NL__0: TypeScript.DiagnosticInfo;
        Overload_signatures_must_all_be_public_or_private: TypeScript.DiagnosticInfo;
        Overload_signatures_must_all_be_exported_or_local: TypeScript.DiagnosticInfo;
        Overload_signatures_must_all_be_ambient_or_non_ambient: TypeScript.DiagnosticInfo;
        Overload_signatures_must_all_be_optional_or_required: TypeScript.DiagnosticInfo;
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature: TypeScript.DiagnosticInfo;
        _this__cannot_be_referenced_in_constructor_arguments: TypeScript.DiagnosticInfo;
        Static_member_cannot_be_accessed_off_an_instance_variable: TypeScript.DiagnosticInfo;
        Instance_member_cannot_be_accessed_off_a_class: TypeScript.DiagnosticInfo;
        Untyped_function_calls_may_not_accept_type_arguments: TypeScript.DiagnosticInfo;
        Non_generic_functions_may_not_accept_type_arguments: TypeScript.DiagnosticInfo;
        Static_methods_cannot_reference_class_type_parameters: TypeScript.DiagnosticInfo;
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___: TypeScript.DiagnosticInfo;
        Rest_parameters_must_be_array_types: TypeScript.DiagnosticInfo;
        Overload_signature_implementation_cannot_use_specialized_type: TypeScript.DiagnosticInfo;
        Export_assignments_may_only_be_used_in_External_modules: TypeScript.DiagnosticInfo;
        Export_assignments_may_only_be_made_with_acceptable_kinds: TypeScript.DiagnosticInfo;
        Only_public_instance_methods_of_the_base_class_are_accessible_via_the_super_keyword: TypeScript.DiagnosticInfo;
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1__: TypeScript.DiagnosticInfo;
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1____NL__2: TypeScript.DiagnosticInfo;
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0__: TypeScript.DiagnosticInfo;
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0____NL__1: TypeScript.DiagnosticInfo;
        All_named_properties_must_be_subtypes_of_string_indexer_type___0__: TypeScript.DiagnosticInfo;
        All_named_properties_must_be_subtypes_of_string_indexer_type___0____NL__1: TypeScript.DiagnosticInfo;
        Generic_type_references_must_include_all_type_arguments: TypeScript.DiagnosticInfo;
        Type__0__is_missing_property__1__from_type__2_: TypeScript.DiagnosticInfo;
        Types_of_property__0__of_types__1__and__2__are_incompatible: TypeScript.DiagnosticInfo;
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3: TypeScript.DiagnosticInfo;
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_: TypeScript.DiagnosticInfo;
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_: TypeScript.DiagnosticInfo;
        Types__0__and__1__define_property__2__as_private: TypeScript.DiagnosticInfo;
        Call_signatures_of_types__0__and__1__are_incompatible: TypeScript.DiagnosticInfo;
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2: TypeScript.DiagnosticInfo;
        Type__0__requires_a_call_signature__but_Type__1__lacks_one: TypeScript.DiagnosticInfo;
        Construct_signatures_of_types__0__and__1__are_incompatible: TypeScript.DiagnosticInfo;
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2: TypeScript.DiagnosticInfo;
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one: TypeScript.DiagnosticInfo;
        Index_signatures_of_types__0__and__1__are_incompatible: TypeScript.DiagnosticInfo;
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2: TypeScript.DiagnosticInfo;
        Call_signature_expects__0__or_fewer_parameters: TypeScript.DiagnosticInfo;
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_: TypeScript.DiagnosticInfo;
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function: TypeScript.DiagnosticInfo;
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function: TypeScript.DiagnosticInfo;
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor: TypeScript.DiagnosticInfo;
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property: TypeScript.DiagnosticInfo;
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible: TypeScript.DiagnosticInfo;
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3: TypeScript.DiagnosticInfo;
        Current_host_does_not_support__w_atch_option: TypeScript.DiagnosticInfo;
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation: TypeScript.DiagnosticInfo;
        Module_code_generation__0__not_supported___Using_default__1__code_generation: TypeScript.DiagnosticInfo;
        Could_not_find_file___0_: TypeScript.DiagnosticInfo;
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed: TypeScript.DiagnosticInfo;
        A_file_cannot_have_a_reference_itself: TypeScript.DiagnosticInfo;
        Cannot_resolve_referenced_file___0_: TypeScript.DiagnosticInfo;
        Cannot_resolve_imported_file___0_: TypeScript.DiagnosticInfo;
        Cannot_find_the_common_subdirectory_path_for_the_input_files: TypeScript.DiagnosticInfo;
        Cannot_compile_dynamic_modules_when_emitting_into_single_file: TypeScript.DiagnosticInfo;
        Emit_Error__0: TypeScript.DiagnosticInfo;
        Unsupported_encoding_for_file__0: TypeScript.DiagnosticInfo;
    }
    var diagnosticMessages: IDiagnosticMessages;
}
declare module TypeScript {
    class Errors {
        static argument(argument: string, message?: string): Error;
        static argumentOutOfRange(argument: string): Error;
        static argumentNull(argument: string): Error;
        static abstract(): Error;
        static notYetImplemented(): Error;
        static invalidOperation(message?: string): Error;
    }
}
declare module TypeScript {
    class Hash {
        private static FNV_BASE;
        private static FNV_PRIME;
        private static computeFnv1aCharArrayHashCode(text, start, len);
        static computeSimple31BitCharArrayHashCode(key: number[], start: number, len: number): number;
        static computeSimple31BitStringHashCode(key: string): number;
        static computeMurmur2CharArrayHashCode(key: number[], start: number, len: number): number;
        static computeMurmur2StringHashCode(key: string): number;
        private static primes;
        static getPrime(min: number): number;
        static expandPrime(oldSize: number): number;
        static combine(value: number, currentHash: number): number;
    }
}
declare module TypeScript.Collections {
    var DefaultHashTableCapacity: number;
    class HashTable {
        private hash;
        private equals;
        private entries;
        private count;
        constructor(capacity: number, hash: (k: any) => number, equals: (k1: any, k2: any) => boolean);
        public set(key: any, value: any): void;
        public add(key: any, value: any): void;
        public containsKey(key: any): boolean;
        public get(key: any): any;
        private computeHashCode(key);
        private addOrSet(key, value, throwOnExistingEntry);
        private findEntry(key, hashCode);
        private addEntry(key, value, hashCode);
        private grow();
    }
    function createHashTable(capacity?: number, hash?: (k: any) => number, equals?: (k1: any, k2: any) => boolean): HashTable;
    function identityHashCode(value: any): number;
}
declare module TypeScript {
    interface IDiagnostic {
        fileName(): string;
        start(): number;
        length(): number;
        diagnosticCode(): TypeScript.DiagnosticCode;
        text(): string;
        message(): string;
    }
    class Diagnostic implements IDiagnostic {
        private _fileName;
        private _start;
        private _originalStart;
        private _length;
        private _diagnosticCode;
        private _arguments;
        constructor(fileName: string, start: number, length: number, diagnosticCode: TypeScript.DiagnosticCode, arguments?: any[]);
        public toJSON(key);
        public fileName(): string;
        public start(): number;
        public length(): number;
        public diagnosticCode(): TypeScript.DiagnosticCode;
        public arguments(): any[];
        public text(): string;
        public message(): string;
        public adjustOffset(pos: number): void;
        public additionalLocations(): Location[];
        static equals(diagnostic1: Diagnostic, diagnostic2: Diagnostic): boolean;
    }
    function getDiagnosticInfoFromCode(diagnosticCode: DiagnosticCode): DiagnosticInfo;
    function getDiagnosticText(diagnosticCode: DiagnosticCode, args: any[]): string;
    function getDiagnosticMessage(diagnosticCode: DiagnosticCode, args: any[]): string;
}
declare class Enumerator {
    public atEnd(): boolean;
    public moveNext();
    public item(): any;
    constructor(o: any);
}
declare module process {
    var argv: string[];
    var platform: string;
    function on(event: string, handler: (any: any) => void): void;
    module stdout {
        function write(str: string);
    }
    module stderr {
        function write(str: string);
    }
    module mainModule {
        var filename: string;
    }
    function exit(exitCode?: number);
}
declare enum ByteOrderMark {
    None,
    Utf8,
    Utf16BigEndian,
    Utf16LittleEndian,
}
declare class FileInformation {
    private _contents;
    private _byteOrderMark;
    constructor(contents: string, byteOrderMark: ByteOrderMark);
    public contents(): string;
    public byteOrderMark(): ByteOrderMark;
}
interface IEnvironment {
    readFile(path: string): FileInformation;
    writeFile(path: string, contents: string, writeByteOrderMark: boolean): void;
    deleteFile(path: string): void;
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
    listFiles(path: string, re?: RegExp, options?: {
        recursive?: boolean;
    }): string[];
    arguments: string[];
    standardOut: ITextWriter;
    currentDirectory(): string;
}
declare var Environment: IEnvironment;
declare module TypeScript {
    class IntegerUtilities {
        static integerDivide(numerator: number, denominator: number): number;
        static integerMultiplyLow32Bits(n1: number, n2: number): number;
        static integerMultiplyHigh32Bits(n1: number, n2: number): number;
    }
}
declare module TypeScript {
    class MathPrototype {
        static max(a: number, b: number): number;
        static min(a: number, b: number): number;
    }
}
declare module TypeScript.Collections {
    var DefaultStringTableCapacity: number;
    class StringTable {
        private entries;
        private count;
        constructor(capacity);
        public addCharArray(key: number[], start: number, len: number): string;
        private findCharArrayEntry(key, start, len, hashCode);
        private addEntry(text, hashCode);
        private grow();
        private static textCharArrayEquals(text, array, start, length);
    }
    var DefaultStringTable: StringTable;
}
declare module TypeScript {
    class StringUtilities {
        static isString(value: any): boolean;
        static fromCharCodeArray(array: number[]): string;
        static endsWith(string: string, value: string): boolean;
        static startsWith(string: string, value: string): boolean;
        static copyTo(source: string, sourceIndex: number, destination: number[], destinationIndex: number, count: number): void;
        static repeat(value: string, count: number): string;
        static stringEquals(val1: string, val2: string): boolean;
    }
}
declare var global;
declare module TypeScript {
    class Timer {
        public startTime;
        public time: number;
        public start(): void;
        public end(): void;
    }
}
declare module TypeScript {
    enum CharacterCodes {
        nullCharacter,
        maxAsciiCharacter,
        lineFeed,
        carriageReturn,
        lineSeparator,
        paragraphSeparator,
        nextLine,
        space,
        nonBreakingSpace,
        enQuad,
        emQuad,
        enSpace,
        emSpace,
        threePerEmSpace,
        fourPerEmSpace,
        sixPerEmSpace,
        figureSpace,
        punctuationSpace,
        thinSpace,
        hairSpace,
        zeroWidthSpace,
        narrowNoBreakSpace,
        ideographicSpace,
        _,
        $,
        _0,
        _9,
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u,
        v,
        w,
        x,
        y,
        z,
        A,
        E,
        F,
        X,
        Z,
        ampersand,
        asterisk,
        at,
        backslash,
        bar,
        caret,
        closeBrace,
        closeBracket,
        closeParen,
        colon,
        comma,
        dot,
        doubleQuote,
        equals,
        exclamation,
        greaterThan,
        lessThan,
        minus,
        openBrace,
        openBracket,
        openParen,
        percent,
        plus,
        question,
        semicolon,
        singleQuote,
        slash,
        tilde,
        backspace,
        formFeed,
        byteOrderMark,
        tab,
        verticalTab,
    }
}
declare module TypeScript {
    interface ILineAndCharacter {
        line: number;
        character: number;
    }
}
declare module TypeScript {
    interface IScriptSnapshot {
        getText(start: number, end: number): string;
        getLength(): number;
        getLineStartPositions(): number[];
        getTextChangeRangeSinceVersion(scriptVersion: number): TypeScript.TextChangeRange;
    }
    module ScriptSnapshot {
        function fromString(text: string): IScriptSnapshot;
    }
}
declare module TypeScript {
    interface ISimpleText {
        length(): number;
        copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void;
        substr(start: number, length: number, intern: boolean): string;
        subText(span: TypeScript.TextSpan): ISimpleText;
        charCodeAt(index: number): number;
        lineMap(): TypeScript.LineMap;
    }
    interface IText extends ISimpleText {
        lineCount(): number;
        lines(): TypeScript.ITextLine[];
        charCodeAt(position: number): number;
        getLineFromLineNumber(lineNumber: number): TypeScript.ITextLine;
        getLineFromPosition(position: number): TypeScript.ITextLine;
        getLineNumberFromPosition(position: number): number;
        getLinePosition(position: number): TypeScript.LineAndCharacter;
        toString(span?: TypeScript.TextSpan): string;
    }
}
declare module TypeScript {
    interface ITextLine {
        start(): number;
        end(): number;
        endIncludingLineBreak(): number;
        extent(): TypeScript.TextSpan;
        extentIncludingLineBreak(): TypeScript.TextSpan;
        toString(): string;
        lineNumber(): number;
    }
}
declare module TypeScript {
    class LineMap {
        private _lineStarts;
        private length;
        static empty: LineMap;
        constructor(_lineStarts: number[], length: number);
        public toJSON(key): {
            lineStarts: number[];
            length: number;
        };
        public equals(other: LineMap): boolean;
        public lineStarts(): number[];
        public lineCount(): number;
        public getPosition(line: number, character: number): number;
        public getLineNumberFromPosition(position: number): number;
        public getLineStartPosition(lineNumber: number): number;
        public fillLineAndCharacterFromPosition(position: number, lineAndCharacter: TypeScript.ILineAndCharacter): void;
        public getLineAndCharacterFromPosition(position: number): TypeScript.LineAndCharacter;
        static fromSimpleText(text: TypeScript.ISimpleText): LineMap;
        static fromScriptSnapshot(scriptSnapshot: TypeScript.IScriptSnapshot): LineMap;
        static fromString(text: string): LineMap;
    }
}
declare module TypeScript {
    class LineAndCharacter {
        private _line;
        private _character;
        constructor(line: number, character: number);
        public line(): number;
        public character(): number;
    }
}
declare module TypeScript.TextFactory {
    function createText(value: string): TypeScript.IText;
}
declare module TypeScript.SimpleText {
    function fromString(value: string): TypeScript.ISimpleText;
    function fromScriptSnapshot(scriptSnapshot: TypeScript.IScriptSnapshot): TypeScript.ISimpleText;
}
declare module TypeScript.TextUtilities {
    function parseLineStarts(text: TypeScript.ISimpleText): number[];
    function getLengthOfLineBreakSlow(text: TypeScript.ISimpleText, index: number, c: number): number;
    function getLengthOfLineBreak(text: TypeScript.ISimpleText, index: number): number;
    function isAnyLineBreakCharacter(c: number): boolean;
}
declare module TypeScript {
    class TextSpan {
        private _start;
        private _length;
        constructor(start: number, length: number);
        public start(): number;
        public length(): number;
        public end(): number;
        public isEmpty(): boolean;
        public containsPosition(position: number): boolean;
        public containsTextSpan(span: TextSpan): boolean;
        public overlapsWith(span: TextSpan): boolean;
        public overlap(span: TextSpan): TextSpan;
        public intersectsWithTextSpan(span: TextSpan): boolean;
        public intersectsWith(start: number, length: number): boolean;
        public intersectsWithPosition(position: number): boolean;
        public intersection(span: TextSpan): TextSpan;
        static fromBounds(start: number, end: number): TextSpan;
    }
}
declare module TypeScript {
    class TextChangeRange {
        static unchanged: TextChangeRange;
        private _span;
        private _newLength;
        constructor(span: TypeScript.TextSpan, newLength: number);
        public span(): TypeScript.TextSpan;
        public newLength(): number;
        public newSpan(): TypeScript.TextSpan;
        public isUnchanged(): boolean;
        static collapseChangesFromSingleVersion(changes: TextChangeRange[]): TextChangeRange;
        static collapseChangesAcrossMultipleVersions(changes: TextChangeRange[]): TextChangeRange;
    }
}
declare module TypeScript {
    class CharacterInfo {
        static isDecimalDigit(c: number): boolean;
        static isHexDigit(c: number): boolean;
        static hexValue(c: number): number;
        static isWhitespace(ch: number): boolean;
        static isLineTerminator(ch: number): boolean;
    }
}
declare module TypeScript {
    enum SyntaxConstants {
        TriviaNewLineMask,
        TriviaCommentMask,
        TriviaFullWidthShift,
        NodeDataComputed,
        NodeIncrementallyUnusableMask,
        NodeParsedInStrictModeMask,
        NodeFullWidthShift,
    }
}
declare class FormattingOptions {
    public useTabs: boolean;
    public spacesPerTab: number;
    public indentSpaces: number;
    public newLineCharacter: string;
    constructor(useTabs: boolean, spacesPerTab: number, indentSpaces: number, newLineCharacter: string);
    static defaultOptions: FormattingOptions;
}
declare module TypeScript.Indentation {
    function columnForEndOfToken(token: TypeScript.ISyntaxToken, syntaxInformationMap: TypeScript.SyntaxInformationMap, options: FormattingOptions): number;
    function columnForStartOfToken(token: TypeScript.ISyntaxToken, syntaxInformationMap: TypeScript.SyntaxInformationMap, options: FormattingOptions): number;
    function columnForStartOfFirstTokenInLineContainingToken(token: TypeScript.ISyntaxToken, syntaxInformationMap: TypeScript.SyntaxInformationMap, options: FormattingOptions): number;
    function columnForPositionInString(input: string, position: number, options: FormattingOptions): number;
    function indentationString(column: number, options: FormattingOptions): string;
    function indentationTrivia(column: number, options: FormattingOptions): TypeScript.ISyntaxTrivia;
    function firstNonWhitespacePosition(value: string): number;
}
declare module TypeScript {
    enum LanguageVersion {
        EcmaScript3,
        EcmaScript5,
    }
}
declare module TypeScript {
    class ParseOptions {
        private _allowAutomaticSemicolonInsertion;
        private _allowModuleKeywordInExternalModuleReference;
        constructor(allowAutomaticSemicolonInsertion, allowModuleKeywordInExternalModuleReference);
        public toJSON(key): {
            allowAutomaticSemicolonInsertion: boolean;
            allowModuleKeywordInExternalModuleReference: boolean;
        };
        public allowAutomaticSemicolonInsertion(): boolean;
        public allowModuleKeywordInExternalModuleReference(): boolean;
    }
}
declare module TypeScript {
    class PositionedElement {
        private _parent;
        private _element;
        private _fullStart;
        constructor(parent: PositionedElement, element: TypeScript.ISyntaxElement, fullStart: number);
        static create(parent: PositionedElement, element: TypeScript.ISyntaxElement, fullStart: number): PositionedElement;
        public parent(): PositionedElement;
        public parentElement(): TypeScript.ISyntaxElement;
        public element(): TypeScript.ISyntaxElement;
        public kind(): TypeScript.SyntaxKind;
        public childIndex(child: TypeScript.ISyntaxElement): number;
        public childCount(): number;
        public childAt(index: number): PositionedElement;
        public childStart(child: TypeScript.ISyntaxElement): number;
        public childEnd(child: TypeScript.ISyntaxElement): number;
        public childStartAt(index: number): number;
        public childEndAt(index: number): number;
        public getPositionedChild(child: TypeScript.ISyntaxElement): PositionedElement;
        public fullStart(): number;
        public fullEnd(): number;
        public fullWidth(): number;
        public start(): number;
        public end(): number;
        public root(): PositionedNode;
        public containingNode(): PositionedNode;
    }
    class PositionedNodeOrToken extends PositionedElement {
        constructor(parent: PositionedElement, nodeOrToken: TypeScript.ISyntaxNodeOrToken, fullStart: number);
        public nodeOrToken(): TypeScript.ISyntaxNodeOrToken;
    }
    class PositionedNode extends PositionedNodeOrToken {
        constructor(parent: PositionedElement, node: TypeScript.SyntaxNode, fullStart: number);
        public node(): TypeScript.SyntaxNode;
    }
    class PositionedToken extends PositionedNodeOrToken {
        constructor(parent: PositionedElement, token: TypeScript.ISyntaxToken, fullStart: number);
        public token(): TypeScript.ISyntaxToken;
        public previousToken(includeSkippedTokens?: boolean): PositionedToken;
        public nextToken(includeSkippedTokens?: boolean): PositionedToken;
    }
    class PositionedList extends PositionedElement {
        constructor(parent: PositionedElement, list: TypeScript.ISyntaxList, fullStart: number);
        public list(): TypeScript.ISyntaxList;
    }
    class PositionedSeparatedList extends PositionedElement {
        constructor(parent: PositionedElement, list: TypeScript.ISeparatedSyntaxList, fullStart: number);
        public list(): TypeScript.ISeparatedSyntaxList;
    }
    class PositionedSkippedToken extends PositionedToken {
        private _parentToken;
        constructor(parentToken: PositionedToken, token: TypeScript.ISyntaxToken, fullStart: number);
        public parentToken(): PositionedToken;
        public previousToken(includeSkippedTokens?: boolean): PositionedToken;
        public nextToken(includeSkippedTokens?: boolean): PositionedToken;
    }
}
declare module TypeScript {
    class Scanner implements TypeScript.ISlidingWindowSource {
        private slidingWindow;
        private fileName;
        private text;
        private _languageVersion;
        private static isKeywordStartCharacter;
        private static isIdentifierStartCharacter;
        static isIdentifierPartCharacter: boolean[];
        private static isNumericLiteralStart;
        private static initializeStaticData();
        constructor(fileName: string, text: TypeScript.ISimpleText, languageVersion: TypeScript.LanguageVersion, window?: number[]);
        public languageVersion(): TypeScript.LanguageVersion;
        public fetchMoreItems(argument: any, sourceIndex: number, window: number[], destinationIndex: number, spaceAvailable: number): number;
        private currentCharCode();
        public absoluteIndex(): number;
        public setAbsoluteIndex(index: number): void;
        public scan(diagnostics: TypeScript.SyntaxDiagnostic[], allowRegularExpression: boolean): TypeScript.ISyntaxToken;
        private createToken(fullStart, leadingTriviaInfo, start, kind, end, trailingTriviaInfo);
        private static triviaWindow;
        static scanTrivia(text: TypeScript.ISimpleText, start: number, length: number, isTrailing: boolean): TypeScript.ISyntaxTriviaList;
        private scanTrivia(isTrailing);
        private scanTriviaInfo(diagnostics, isTrailing);
        private isNewLineCharacter(ch);
        private scanWhitespaceTrivia();
        private scanSingleLineCommentTrivia();
        private scanSingleLineCommentTriviaLength();
        private scanMultiLineCommentTrivia();
        private scanMultiLineCommentTriviaLength(diagnostics);
        private scanLineTerminatorSequenceTrivia(ch);
        private scanLineTerminatorSequenceLength(ch);
        private scanSyntaxToken(diagnostics, allowRegularExpression);
        private isIdentifierStart(interpretedChar);
        private isIdentifierPart(interpretedChar);
        private tryFastScanIdentifierOrKeyword(firstCharacter);
        private slowScanIdentifier(diagnostics);
        private scanNumericLiteral();
        private scanDecimalNumericLiteral();
        private scanHexNumericLiteral();
        private isHexNumericLiteral();
        private advanceAndSetTokenKind(kind);
        private scanLessThanToken();
        private scanBarToken();
        private scanCaretToken();
        private scanAmpersandToken();
        private scanPercentToken();
        private scanMinusToken();
        private scanPlusToken();
        private scanAsteriskToken();
        private scanEqualsToken();
        private isDotPrefixedNumericLiteral();
        private scanDotToken();
        private scanSlashToken(allowRegularExpression);
        private tryScanRegularExpressionToken();
        private scanExclamationToken();
        private scanDefaultCharacter(character, diagnostics);
        private getErrorMessageText(text);
        private skipEscapeSequence(diagnostics);
        private scanStringLiteral(diagnostics);
        private isUnicodeOrHexEscape(character);
        private isUnicodeEscape(character);
        private isHexEscape(character);
        private peekCharOrUnicodeOrHexEscape();
        private peekCharOrUnicodeEscape();
        private peekUnicodeOrHexEscape();
        private scanCharOrUnicodeEscape(errors);
        private scanCharOrUnicodeOrHexEscape(errors);
        private scanUnicodeOrHexEscape(errors);
        public substring(start: number, end: number, intern: boolean): string;
        private createIllegalEscapeDiagnostic(start, end);
        static isValidIdentifier(text: TypeScript.ISimpleText, languageVersion: TypeScript.LanguageVersion): boolean;
    }
}
declare module TypeScript {
    class ScannerUtilities {
        static identifierKind(array: number[], startIndex: number, length: number): TypeScript.SyntaxKind;
    }
}
declare module TypeScript {
    interface ISeparatedSyntaxList extends TypeScript.ISyntaxElement {
        childAt(index: number): TypeScript.ISyntaxNodeOrToken;
        toArray(): TypeScript.ISyntaxNodeOrToken[];
        toNonSeparatorArray(): TypeScript.ISyntaxNodeOrToken[];
        separatorCount();
        separatorAt(index: number): TypeScript.ISyntaxToken;
        nonSeparatorCount();
        nonSeparatorAt(index: number): TypeScript.ISyntaxNodeOrToken;
        insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
    }
}
declare module TypeScript.Syntax {
    var emptySeparatedList: TypeScript.ISeparatedSyntaxList;
    function separatedList(nodes: TypeScript.ISyntaxNodeOrToken[]): TypeScript.ISeparatedSyntaxList;
}
declare module TypeScript {
    interface ISlidingWindowSource {
        fetchMoreItems(argument: any, sourceIndex: number, window: any[], destinationIndex: number, spaceAvailable: number): number;
    }
    class SlidingWindow {
        private source;
        public window: any[];
        private defaultValue;
        private sourceLength;
        private windowCount;
        public windowAbsoluteStartIndex: number;
        private currentRelativeItemIndex;
        private _pinCount;
        private firstPinnedAbsoluteIndex;
        constructor(source: ISlidingWindowSource, window: any[], defaultValue: any, sourceLength?: number);
        private windowAbsoluteEndIndex();
        private addMoreItemsToWindow(argument);
        private tryShiftOrGrowWindow();
        public absoluteIndex(): number;
        public isAtEndOfSource(): boolean;
        public getAndPinAbsoluteIndex(): number;
        public releaseAndUnpinAbsoluteIndex(absoluteIndex: number): void;
        public rewindToPinnedIndex(absoluteIndex: number): void;
        public currentItem(argument: any): any;
        public peekItemN(n: number): any;
        public moveToNextItem(): void;
        public disgardAllItemsFromCurrentIndexOnwards(): void;
        public setAbsoluteIndex(absoluteIndex: number): void;
        public pinCount(): number;
    }
}
declare module TypeScript {
    class Strings {
        static module__class__interface__enum__import_or_statement: string;
        static constructor__function__accessor_or_variable: string;
        static statement: string;
        static case_or_default_clause: string;
        static identifier: string;
        static call__construct__index__property_or_function_signature: string;
        static expression: string;
        static type_name: string;
        static property_or_accessor: string;
        static parameter: string;
        static type: string;
        static type_parameter: string;
    }
}
declare module TypeScript.Syntax {
    function emptySourceUnit(): TypeScript.SourceUnitSyntax;
    function getStandaloneExpression(positionedToken: TypeScript.PositionedToken): TypeScript.PositionedNodeOrToken;
    function isInModuleOrTypeContext(positionedToken: TypeScript.PositionedToken): boolean;
    function isInTypeOnlyContext(positionedToken: TypeScript.PositionedToken): boolean;
    function childOffset(parent: TypeScript.ISyntaxElement, child: TypeScript.ISyntaxElement): number;
    function childOffsetAt(parent: TypeScript.ISyntaxElement, index: number): number;
    function childIndex(parent: TypeScript.ISyntaxElement, child: TypeScript.ISyntaxElement): number;
    function nodeStructuralEquals(node1: TypeScript.SyntaxNode, node2: TypeScript.SyntaxNode): boolean;
    function nodeOrTokenStructuralEquals(node1: TypeScript.ISyntaxNodeOrToken, node2: TypeScript.ISyntaxNodeOrToken): boolean;
    function tokenStructuralEquals(token1: TypeScript.ISyntaxToken, token2: TypeScript.ISyntaxToken): boolean;
    function triviaListStructuralEquals(triviaList1: TypeScript.ISyntaxTriviaList, triviaList2: TypeScript.ISyntaxTriviaList): boolean;
    function triviaStructuralEquals(trivia1: TypeScript.ISyntaxTrivia, trivia2: TypeScript.ISyntaxTrivia): boolean;
    function listStructuralEquals(list1: TypeScript.ISyntaxList, list2: TypeScript.ISyntaxList): boolean;
    function separatedListStructuralEquals(list1: TypeScript.ISeparatedSyntaxList, list2: TypeScript.ISeparatedSyntaxList): boolean;
    function elementStructuralEquals(element1: TypeScript.ISyntaxElement, element2: TypeScript.ISyntaxElement): boolean;
    function identifierName(text: string, info?: TypeScript.ITokenInfo): TypeScript.ISyntaxToken;
    function trueExpression(): TypeScript.IUnaryExpressionSyntax;
    function falseExpression(): TypeScript.IUnaryExpressionSyntax;
    function numericLiteralExpression(text: string): TypeScript.IUnaryExpressionSyntax;
    function stringLiteralExpression(text: string): TypeScript.IUnaryExpressionSyntax;
    function isSuperInvocationExpression(node: TypeScript.IExpressionSyntax): boolean;
    function isSuperInvocationExpressionStatement(node: TypeScript.SyntaxNode): boolean;
    function isSuperMemberAccessExpression(node: TypeScript.IExpressionSyntax): boolean;
    function isSuperMemberAccessInvocationExpression(node: TypeScript.SyntaxNode): boolean;
    function assignmentExpression(left: TypeScript.IExpressionSyntax, token: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
    function nodeHasSkippedOrMissingTokens(node: TypeScript.SyntaxNode): boolean;
    function isUnterminatedStringLiteral(token: TypeScript.ISyntaxToken): boolean;
    function isUnterminatedMultilineCommentTrivia(trivia: TypeScript.ISyntaxTrivia): boolean;
    function isEntirelyInsideCommentTrivia(trivia: TypeScript.ISyntaxTrivia, fullStart: number, position: number): boolean;
    function isEntirelyInsideComment(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
    function isEntirelyInStringOrRegularExpressionLiteral(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
    function findSkippedTokenInLeadingTriviaList(positionedToken: TypeScript.PositionedToken, position: number): TypeScript.PositionedSkippedToken;
    function findSkippedTokenInTrailingTriviaList(positionedToken: TypeScript.PositionedToken, position: number): TypeScript.PositionedSkippedToken;
    function findSkippedTokenInPositionedToken(positionedToken: TypeScript.PositionedToken, position: number): TypeScript.PositionedSkippedToken;
    function getAncestorOfKind(positionedToken: TypeScript.PositionedElement, kind: TypeScript.SyntaxKind): TypeScript.PositionedElement;
    function hasAncestorOfKind(positionedToken: TypeScript.PositionedElement, kind: TypeScript.SyntaxKind): boolean;
}
declare module TypeScript {
    class SyntaxDiagnostic extends TypeScript.Diagnostic {
        static equals(diagnostic1: SyntaxDiagnostic, diagnostic2: SyntaxDiagnostic): boolean;
    }
}
declare module TypeScript {
    interface ISyntaxElement {
        kind(): TypeScript.SyntaxKind;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        fullWidth(): number;
        width(): number;
        fullText(): string;
        leadingTrivia(): TypeScript.ISyntaxTriviaList;
        trailingTrivia(): TypeScript.ISyntaxTriviaList;
        leadingTriviaWidth(): number;
        trailingTriviaWidth(): number;
        firstToken(): TypeScript.ISyntaxToken;
        lastToken(): TypeScript.ISyntaxToken;
        collectTextElements(elements: string[]): void;
    }
    interface ISyntaxNode extends TypeScript.ISyntaxNodeOrToken {
    }
    interface IModuleReferenceSyntax extends ISyntaxNode {
    }
    interface IModuleElementSyntax extends ISyntaxNode {
    }
    interface IStatementSyntax extends IModuleElementSyntax {
    }
    interface ITypeMemberSyntax extends ISyntaxNode {
    }
    interface IClassElementSyntax extends ISyntaxNode {
    }
    interface IMemberDeclarationSyntax extends IClassElementSyntax {
    }
    interface ISwitchClauseSyntax extends ISyntaxNode {
    }
    interface IExpressionSyntax extends TypeScript.ISyntaxNodeOrToken {
    }
    interface IUnaryExpressionSyntax extends IExpressionSyntax {
    }
    interface ITypeSyntax extends IUnaryExpressionSyntax {
    }
    interface INameSyntax extends ITypeSyntax {
    }
}
declare module TypeScript.Syntax {
    interface IFactory {
        sourceUnit(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): TypeScript.SourceUnitSyntax;
        externalModuleReference(moduleOrRequireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ExternalModuleReferenceSyntax;
        moduleNameModuleReference(moduleName: TypeScript.INameSyntax): TypeScript.ModuleNameModuleReferenceSyntax;
        importDeclaration(importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.ModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ImportDeclarationSyntax;
        exportAssignment(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExportAssignmentSyntax;
        classDeclaration(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ClassDeclarationSyntax;
        interfaceDeclaration(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: TypeScript.ObjectTypeSyntax): TypeScript.InterfaceDeclarationSyntax;
        heritageClause(extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): TypeScript.HeritageClauseSyntax;
        moduleDeclaration(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, moduleName: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ModuleDeclarationSyntax;
        functionDeclaration(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.FunctionDeclarationSyntax;
        variableStatement(modifiers: TypeScript.ISyntaxList, variableDeclaration: TypeScript.VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.VariableStatementSyntax;
        variableDeclaration(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): TypeScript.VariableDeclarationSyntax;
        variableDeclarator(identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.VariableDeclaratorSyntax;
        equalsValueClause(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): TypeScript.EqualsValueClauseSyntax;
        prefixUnaryExpression(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): TypeScript.PrefixUnaryExpressionSyntax;
        arrayLiteralExpression(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayLiteralExpressionSyntax;
        omittedExpression(): TypeScript.OmittedExpressionSyntax;
        parenthesizedExpression(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParenthesizedExpressionSyntax;
        simpleArrowFunctionExpression(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): TypeScript.SimpleArrowFunctionExpressionSyntax;
        parenthesizedArrowFunctionExpression(callSignature: TypeScript.CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): TypeScript.ParenthesizedArrowFunctionExpressionSyntax;
        qualifiedName(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): TypeScript.QualifiedNameSyntax;
        typeArgumentList(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeArgumentListSyntax;
        constructorType(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstructorTypeSyntax;
        functionType(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.FunctionTypeSyntax;
        objectType(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectTypeSyntax;
        arrayType(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayTypeSyntax;
        genericType(name: TypeScript.INameSyntax, typeArgumentList: TypeScript.TypeArgumentListSyntax): TypeScript.GenericTypeSyntax;
        typeAnnotation(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.TypeAnnotationSyntax;
        block(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.BlockSyntax;
        parameter(dotDotDotToken: TypeScript.ISyntaxToken, publicOrPrivateKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.ParameterSyntax;
        memberAccessExpression(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): TypeScript.MemberAccessExpressionSyntax;
        postfixUnaryExpression(kind: TypeScript.SyntaxKind, operand: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): TypeScript.PostfixUnaryExpressionSyntax;
        elementAccessExpression(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ElementAccessExpressionSyntax;
        invocationExpression(expression: TypeScript.IExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.InvocationExpressionSyntax;
        argumentList(typeArgumentList: TypeScript.TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ArgumentListSyntax;
        binaryExpression(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
        conditionalExpression(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): TypeScript.ConditionalExpressionSyntax;
        constructSignature(newKeyword: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.ConstructSignatureSyntax;
        methodSignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.MethodSignatureSyntax;
        indexSignature(openBracketToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.IndexSignatureSyntax;
        propertySignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.PropertySignatureSyntax;
        callSignature(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.CallSignatureSyntax;
        parameterList(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParameterListSyntax;
        typeParameterList(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeParameterListSyntax;
        typeParameter(identifier: TypeScript.ISyntaxToken, constraint: TypeScript.ConstraintSyntax): TypeScript.TypeParameterSyntax;
        constraint(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstraintSyntax;
        elseClause(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ElseClauseSyntax;
        ifStatement(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: TypeScript.ElseClauseSyntax): TypeScript.IfStatementSyntax;
        expressionStatement(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExpressionStatementSyntax;
        constructorDeclaration(constructorKeyword: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ConstructorDeclarationSyntax;
        memberFunctionDeclaration(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberFunctionDeclarationSyntax;
        getMemberAccessorDeclaration(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetMemberAccessorDeclarationSyntax;
        setMemberAccessorDeclaration(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax): TypeScript.SetMemberAccessorDeclarationSyntax;
        memberVariableDeclaration(modifiers: TypeScript.ISyntaxList, variableDeclarator: TypeScript.VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberVariableDeclarationSyntax;
        throwStatement(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ThrowStatementSyntax;
        returnStatement(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ReturnStatementSyntax;
        objectCreationExpression(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.ObjectCreationExpressionSyntax;
        switchStatement(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.SwitchStatementSyntax;
        caseSwitchClause(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.CaseSwitchClauseSyntax;
        defaultSwitchClause(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.DefaultSwitchClauseSyntax;
        breakStatement(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.BreakStatementSyntax;
        continueStatement(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ContinueStatementSyntax;
        forStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForStatementSyntax;
        forInStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForInStatementSyntax;
        whileStatement(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WhileStatementSyntax;
        withStatement(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WithStatementSyntax;
        enumDeclaration(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.EnumDeclarationSyntax;
        enumElement(propertyName: TypeScript.ISyntaxToken, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.EnumElementSyntax;
        castExpression(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.CastExpressionSyntax;
        objectLiteralExpression(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectLiteralExpressionSyntax;
        simplePropertyAssignment(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.SimplePropertyAssignmentSyntax;
        functionPropertyAssignment(propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionPropertyAssignmentSyntax;
        getAccessorPropertyAssignment(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetAccessorPropertyAssignmentSyntax;
        setAccessorPropertyAssignment(setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.SetAccessorPropertyAssignmentSyntax;
        functionExpression(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionExpressionSyntax;
        emptyStatement(semicolonToken: TypeScript.ISyntaxToken): TypeScript.EmptyStatementSyntax;
        tryStatement(tryKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, catchClause: TypeScript.CatchClauseSyntax, finallyClause: TypeScript.FinallyClauseSyntax): TypeScript.TryStatementSyntax;
        catchClause(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.CatchClauseSyntax;
        finallyClause(finallyKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.FinallyClauseSyntax;
        labeledStatement(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.LabeledStatementSyntax;
        doStatement(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DoStatementSyntax;
        typeOfExpression(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.TypeOfExpressionSyntax;
        deleteExpression(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.DeleteExpressionSyntax;
        voidExpression(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.VoidExpressionSyntax;
        debuggerStatement(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DebuggerStatementSyntax;
    }
    class NormalModeFactory implements IFactory {
        public sourceUnit(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): TypeScript.SourceUnitSyntax;
        public externalModuleReference(moduleOrRequireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ExternalModuleReferenceSyntax;
        public moduleNameModuleReference(moduleName: TypeScript.INameSyntax): TypeScript.ModuleNameModuleReferenceSyntax;
        public importDeclaration(importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.ModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ImportDeclarationSyntax;
        public exportAssignment(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExportAssignmentSyntax;
        public classDeclaration(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ClassDeclarationSyntax;
        public interfaceDeclaration(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: TypeScript.ObjectTypeSyntax): TypeScript.InterfaceDeclarationSyntax;
        public heritageClause(extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): TypeScript.HeritageClauseSyntax;
        public moduleDeclaration(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, moduleName: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ModuleDeclarationSyntax;
        public functionDeclaration(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.FunctionDeclarationSyntax;
        public variableStatement(modifiers: TypeScript.ISyntaxList, variableDeclaration: TypeScript.VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.VariableStatementSyntax;
        public variableDeclaration(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): TypeScript.VariableDeclarationSyntax;
        public variableDeclarator(identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.VariableDeclaratorSyntax;
        public equalsValueClause(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): TypeScript.EqualsValueClauseSyntax;
        public prefixUnaryExpression(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): TypeScript.PrefixUnaryExpressionSyntax;
        public arrayLiteralExpression(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayLiteralExpressionSyntax;
        public omittedExpression(): TypeScript.OmittedExpressionSyntax;
        public parenthesizedExpression(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParenthesizedExpressionSyntax;
        public simpleArrowFunctionExpression(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): TypeScript.SimpleArrowFunctionExpressionSyntax;
        public parenthesizedArrowFunctionExpression(callSignature: TypeScript.CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): TypeScript.ParenthesizedArrowFunctionExpressionSyntax;
        public qualifiedName(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): TypeScript.QualifiedNameSyntax;
        public typeArgumentList(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeArgumentListSyntax;
        public constructorType(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstructorTypeSyntax;
        public functionType(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.FunctionTypeSyntax;
        public objectType(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectTypeSyntax;
        public arrayType(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayTypeSyntax;
        public genericType(name: TypeScript.INameSyntax, typeArgumentList: TypeScript.TypeArgumentListSyntax): TypeScript.GenericTypeSyntax;
        public typeAnnotation(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.TypeAnnotationSyntax;
        public block(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.BlockSyntax;
        public parameter(dotDotDotToken: TypeScript.ISyntaxToken, publicOrPrivateKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.ParameterSyntax;
        public memberAccessExpression(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): TypeScript.MemberAccessExpressionSyntax;
        public postfixUnaryExpression(kind: TypeScript.SyntaxKind, operand: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): TypeScript.PostfixUnaryExpressionSyntax;
        public elementAccessExpression(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ElementAccessExpressionSyntax;
        public invocationExpression(expression: TypeScript.IExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.InvocationExpressionSyntax;
        public argumentList(typeArgumentList: TypeScript.TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, _arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ArgumentListSyntax;
        public binaryExpression(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
        public conditionalExpression(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): TypeScript.ConditionalExpressionSyntax;
        public constructSignature(newKeyword: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.ConstructSignatureSyntax;
        public methodSignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.MethodSignatureSyntax;
        public indexSignature(openBracketToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.IndexSignatureSyntax;
        public propertySignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.PropertySignatureSyntax;
        public callSignature(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.CallSignatureSyntax;
        public parameterList(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParameterListSyntax;
        public typeParameterList(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeParameterListSyntax;
        public typeParameter(identifier: TypeScript.ISyntaxToken, constraint: TypeScript.ConstraintSyntax): TypeScript.TypeParameterSyntax;
        public constraint(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstraintSyntax;
        public elseClause(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ElseClauseSyntax;
        public ifStatement(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: TypeScript.ElseClauseSyntax): TypeScript.IfStatementSyntax;
        public expressionStatement(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExpressionStatementSyntax;
        public constructorDeclaration(constructorKeyword: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ConstructorDeclarationSyntax;
        public memberFunctionDeclaration(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberFunctionDeclarationSyntax;
        public getMemberAccessorDeclaration(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetMemberAccessorDeclarationSyntax;
        public setMemberAccessorDeclaration(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax): TypeScript.SetMemberAccessorDeclarationSyntax;
        public memberVariableDeclaration(modifiers: TypeScript.ISyntaxList, variableDeclarator: TypeScript.VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberVariableDeclarationSyntax;
        public throwStatement(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ThrowStatementSyntax;
        public returnStatement(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ReturnStatementSyntax;
        public objectCreationExpression(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.ObjectCreationExpressionSyntax;
        public switchStatement(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.SwitchStatementSyntax;
        public caseSwitchClause(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.CaseSwitchClauseSyntax;
        public defaultSwitchClause(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.DefaultSwitchClauseSyntax;
        public breakStatement(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.BreakStatementSyntax;
        public continueStatement(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ContinueStatementSyntax;
        public forStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForStatementSyntax;
        public forInStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForInStatementSyntax;
        public whileStatement(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WhileStatementSyntax;
        public withStatement(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WithStatementSyntax;
        public enumDeclaration(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.EnumDeclarationSyntax;
        public enumElement(propertyName: TypeScript.ISyntaxToken, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.EnumElementSyntax;
        public castExpression(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.CastExpressionSyntax;
        public objectLiteralExpression(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectLiteralExpressionSyntax;
        public simplePropertyAssignment(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.SimplePropertyAssignmentSyntax;
        public functionPropertyAssignment(propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionPropertyAssignmentSyntax;
        public getAccessorPropertyAssignment(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetAccessorPropertyAssignmentSyntax;
        public setAccessorPropertyAssignment(setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.SetAccessorPropertyAssignmentSyntax;
        public functionExpression(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionExpressionSyntax;
        public emptyStatement(semicolonToken: TypeScript.ISyntaxToken): TypeScript.EmptyStatementSyntax;
        public tryStatement(tryKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, catchClause: TypeScript.CatchClauseSyntax, finallyClause: TypeScript.FinallyClauseSyntax): TypeScript.TryStatementSyntax;
        public catchClause(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.CatchClauseSyntax;
        public finallyClause(finallyKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.FinallyClauseSyntax;
        public labeledStatement(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.LabeledStatementSyntax;
        public doStatement(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DoStatementSyntax;
        public typeOfExpression(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.TypeOfExpressionSyntax;
        public deleteExpression(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.DeleteExpressionSyntax;
        public voidExpression(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.VoidExpressionSyntax;
        public debuggerStatement(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DebuggerStatementSyntax;
    }
    class StrictModeFactory implements IFactory {
        public sourceUnit(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): TypeScript.SourceUnitSyntax;
        public externalModuleReference(moduleOrRequireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ExternalModuleReferenceSyntax;
        public moduleNameModuleReference(moduleName: TypeScript.INameSyntax): TypeScript.ModuleNameModuleReferenceSyntax;
        public importDeclaration(importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.ModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ImportDeclarationSyntax;
        public exportAssignment(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExportAssignmentSyntax;
        public classDeclaration(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ClassDeclarationSyntax;
        public interfaceDeclaration(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: TypeScript.ObjectTypeSyntax): TypeScript.InterfaceDeclarationSyntax;
        public heritageClause(extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): TypeScript.HeritageClauseSyntax;
        public moduleDeclaration(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, moduleName: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ModuleDeclarationSyntax;
        public functionDeclaration(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.FunctionDeclarationSyntax;
        public variableStatement(modifiers: TypeScript.ISyntaxList, variableDeclaration: TypeScript.VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.VariableStatementSyntax;
        public variableDeclaration(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): TypeScript.VariableDeclarationSyntax;
        public variableDeclarator(identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.VariableDeclaratorSyntax;
        public equalsValueClause(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): TypeScript.EqualsValueClauseSyntax;
        public prefixUnaryExpression(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): TypeScript.PrefixUnaryExpressionSyntax;
        public arrayLiteralExpression(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayLiteralExpressionSyntax;
        public omittedExpression(): TypeScript.OmittedExpressionSyntax;
        public parenthesizedExpression(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParenthesizedExpressionSyntax;
        public simpleArrowFunctionExpression(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): TypeScript.SimpleArrowFunctionExpressionSyntax;
        public parenthesizedArrowFunctionExpression(callSignature: TypeScript.CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): TypeScript.ParenthesizedArrowFunctionExpressionSyntax;
        public qualifiedName(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): TypeScript.QualifiedNameSyntax;
        public typeArgumentList(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeArgumentListSyntax;
        public constructorType(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstructorTypeSyntax;
        public functionType(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.FunctionTypeSyntax;
        public objectType(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectTypeSyntax;
        public arrayType(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayTypeSyntax;
        public genericType(name: TypeScript.INameSyntax, typeArgumentList: TypeScript.TypeArgumentListSyntax): TypeScript.GenericTypeSyntax;
        public typeAnnotation(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.TypeAnnotationSyntax;
        public block(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.BlockSyntax;
        public parameter(dotDotDotToken: TypeScript.ISyntaxToken, publicOrPrivateKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.ParameterSyntax;
        public memberAccessExpression(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): TypeScript.MemberAccessExpressionSyntax;
        public postfixUnaryExpression(kind: TypeScript.SyntaxKind, operand: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): TypeScript.PostfixUnaryExpressionSyntax;
        public elementAccessExpression(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ElementAccessExpressionSyntax;
        public invocationExpression(expression: TypeScript.IExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.InvocationExpressionSyntax;
        public argumentList(typeArgumentList: TypeScript.TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, _arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ArgumentListSyntax;
        public binaryExpression(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
        public conditionalExpression(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): TypeScript.ConditionalExpressionSyntax;
        public constructSignature(newKeyword: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.ConstructSignatureSyntax;
        public methodSignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.MethodSignatureSyntax;
        public indexSignature(openBracketToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.IndexSignatureSyntax;
        public propertySignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.PropertySignatureSyntax;
        public callSignature(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.CallSignatureSyntax;
        public parameterList(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParameterListSyntax;
        public typeParameterList(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeParameterListSyntax;
        public typeParameter(identifier: TypeScript.ISyntaxToken, constraint: TypeScript.ConstraintSyntax): TypeScript.TypeParameterSyntax;
        public constraint(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstraintSyntax;
        public elseClause(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ElseClauseSyntax;
        public ifStatement(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: TypeScript.ElseClauseSyntax): TypeScript.IfStatementSyntax;
        public expressionStatement(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExpressionStatementSyntax;
        public constructorDeclaration(constructorKeyword: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ConstructorDeclarationSyntax;
        public memberFunctionDeclaration(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberFunctionDeclarationSyntax;
        public getMemberAccessorDeclaration(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetMemberAccessorDeclarationSyntax;
        public setMemberAccessorDeclaration(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax): TypeScript.SetMemberAccessorDeclarationSyntax;
        public memberVariableDeclaration(modifiers: TypeScript.ISyntaxList, variableDeclarator: TypeScript.VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberVariableDeclarationSyntax;
        public throwStatement(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ThrowStatementSyntax;
        public returnStatement(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ReturnStatementSyntax;
        public objectCreationExpression(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.ObjectCreationExpressionSyntax;
        public switchStatement(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.SwitchStatementSyntax;
        public caseSwitchClause(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.CaseSwitchClauseSyntax;
        public defaultSwitchClause(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.DefaultSwitchClauseSyntax;
        public breakStatement(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.BreakStatementSyntax;
        public continueStatement(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ContinueStatementSyntax;
        public forStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForStatementSyntax;
        public forInStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForInStatementSyntax;
        public whileStatement(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WhileStatementSyntax;
        public withStatement(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WithStatementSyntax;
        public enumDeclaration(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.EnumDeclarationSyntax;
        public enumElement(propertyName: TypeScript.ISyntaxToken, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.EnumElementSyntax;
        public castExpression(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.CastExpressionSyntax;
        public objectLiteralExpression(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectLiteralExpressionSyntax;
        public simplePropertyAssignment(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.SimplePropertyAssignmentSyntax;
        public functionPropertyAssignment(propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionPropertyAssignmentSyntax;
        public getAccessorPropertyAssignment(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetAccessorPropertyAssignmentSyntax;
        public setAccessorPropertyAssignment(setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.SetAccessorPropertyAssignmentSyntax;
        public functionExpression(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionExpressionSyntax;
        public emptyStatement(semicolonToken: TypeScript.ISyntaxToken): TypeScript.EmptyStatementSyntax;
        public tryStatement(tryKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, catchClause: TypeScript.CatchClauseSyntax, finallyClause: TypeScript.FinallyClauseSyntax): TypeScript.TryStatementSyntax;
        public catchClause(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.CatchClauseSyntax;
        public finallyClause(finallyKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.FinallyClauseSyntax;
        public labeledStatement(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.LabeledStatementSyntax;
        public doStatement(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DoStatementSyntax;
        public typeOfExpression(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.TypeOfExpressionSyntax;
        public deleteExpression(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.DeleteExpressionSyntax;
        public voidExpression(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.VoidExpressionSyntax;
        public debuggerStatement(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DebuggerStatementSyntax;
    }
    var normalModeFactory: IFactory;
    var strictModeFactory: IFactory;
}
declare module TypeScript {
    enum SyntaxKind {
        None,
        List,
        SeparatedList,
        TriviaList,
        WhitespaceTrivia,
        NewLineTrivia,
        MultiLineCommentTrivia,
        SingleLineCommentTrivia,
        SkippedTokenTrivia,
        ErrorToken,
        EndOfFileToken,
        IdentifierName,
        RegularExpressionLiteral,
        NumericLiteral,
        StringLiteral,
        BreakKeyword,
        CaseKeyword,
        CatchKeyword,
        ContinueKeyword,
        DebuggerKeyword,
        DefaultKeyword,
        DeleteKeyword,
        DoKeyword,
        ElseKeyword,
        FalseKeyword,
        FinallyKeyword,
        ForKeyword,
        FunctionKeyword,
        IfKeyword,
        InKeyword,
        InstanceOfKeyword,
        NewKeyword,
        NullKeyword,
        ReturnKeyword,
        SwitchKeyword,
        ThisKeyword,
        ThrowKeyword,
        TrueKeyword,
        TryKeyword,
        TypeOfKeyword,
        VarKeyword,
        VoidKeyword,
        WhileKeyword,
        WithKeyword,
        ClassKeyword,
        ConstKeyword,
        EnumKeyword,
        ExportKeyword,
        ExtendsKeyword,
        ImportKeyword,
        SuperKeyword,
        ImplementsKeyword,
        InterfaceKeyword,
        LetKeyword,
        PackageKeyword,
        PrivateKeyword,
        ProtectedKeyword,
        PublicKeyword,
        StaticKeyword,
        YieldKeyword,
        AnyKeyword,
        BooleanKeyword,
        BoolKeyword,
        ConstructorKeyword,
        DeclareKeyword,
        GetKeyword,
        ModuleKeyword,
        RequireKeyword,
        NumberKeyword,
        SetKeyword,
        StringKeyword,
        OpenBraceToken,
        CloseBraceToken,
        OpenParenToken,
        CloseParenToken,
        OpenBracketToken,
        CloseBracketToken,
        DotToken,
        DotDotDotToken,
        SemicolonToken,
        CommaToken,
        LessThanToken,
        GreaterThanToken,
        LessThanEqualsToken,
        GreaterThanEqualsToken,
        EqualsEqualsToken,
        EqualsGreaterThanToken,
        ExclamationEqualsToken,
        EqualsEqualsEqualsToken,
        ExclamationEqualsEqualsToken,
        PlusToken,
        MinusToken,
        AsteriskToken,
        PercentToken,
        PlusPlusToken,
        MinusMinusToken,
        LessThanLessThanToken,
        GreaterThanGreaterThanToken,
        GreaterThanGreaterThanGreaterThanToken,
        AmpersandToken,
        BarToken,
        CaretToken,
        ExclamationToken,
        TildeToken,
        AmpersandAmpersandToken,
        BarBarToken,
        QuestionToken,
        ColonToken,
        EqualsToken,
        PlusEqualsToken,
        MinusEqualsToken,
        AsteriskEqualsToken,
        PercentEqualsToken,
        LessThanLessThanEqualsToken,
        GreaterThanGreaterThanEqualsToken,
        GreaterThanGreaterThanGreaterThanEqualsToken,
        AmpersandEqualsToken,
        BarEqualsToken,
        CaretEqualsToken,
        SlashToken,
        SlashEqualsToken,
        SourceUnit,
        QualifiedName,
        ObjectType,
        FunctionType,
        ArrayType,
        ConstructorType,
        GenericType,
        InterfaceDeclaration,
        FunctionDeclaration,
        ModuleDeclaration,
        ClassDeclaration,
        EnumDeclaration,
        ImportDeclaration,
        ExportAssignment,
        MemberFunctionDeclaration,
        MemberVariableDeclaration,
        ConstructorDeclaration,
        GetMemberAccessorDeclaration,
        SetMemberAccessorDeclaration,
        PropertySignature,
        CallSignature,
        ConstructSignature,
        IndexSignature,
        MethodSignature,
        Block,
        IfStatement,
        VariableStatement,
        ExpressionStatement,
        ReturnStatement,
        SwitchStatement,
        BreakStatement,
        ContinueStatement,
        ForStatement,
        ForInStatement,
        EmptyStatement,
        ThrowStatement,
        WhileStatement,
        TryStatement,
        LabeledStatement,
        DoStatement,
        DebuggerStatement,
        WithStatement,
        PlusExpression,
        NegateExpression,
        BitwiseNotExpression,
        LogicalNotExpression,
        PreIncrementExpression,
        PreDecrementExpression,
        DeleteExpression,
        TypeOfExpression,
        VoidExpression,
        CommaExpression,
        AssignmentExpression,
        AddAssignmentExpression,
        SubtractAssignmentExpression,
        MultiplyAssignmentExpression,
        DivideAssignmentExpression,
        ModuloAssignmentExpression,
        AndAssignmentExpression,
        ExclusiveOrAssignmentExpression,
        OrAssignmentExpression,
        LeftShiftAssignmentExpression,
        SignedRightShiftAssignmentExpression,
        UnsignedRightShiftAssignmentExpression,
        ConditionalExpression,
        LogicalOrExpression,
        LogicalAndExpression,
        BitwiseOrExpression,
        BitwiseExclusiveOrExpression,
        BitwiseAndExpression,
        EqualsWithTypeConversionExpression,
        NotEqualsWithTypeConversionExpression,
        EqualsExpression,
        NotEqualsExpression,
        LessThanExpression,
        GreaterThanExpression,
        LessThanOrEqualExpression,
        GreaterThanOrEqualExpression,
        InstanceOfExpression,
        InExpression,
        LeftShiftExpression,
        SignedRightShiftExpression,
        UnsignedRightShiftExpression,
        MultiplyExpression,
        DivideExpression,
        ModuloExpression,
        AddExpression,
        SubtractExpression,
        PostIncrementExpression,
        PostDecrementExpression,
        MemberAccessExpression,
        InvocationExpression,
        ArrayLiteralExpression,
        ObjectLiteralExpression,
        ObjectCreationExpression,
        ParenthesizedExpression,
        ParenthesizedArrowFunctionExpression,
        SimpleArrowFunctionExpression,
        CastExpression,
        ElementAccessExpression,
        FunctionExpression,
        OmittedExpression,
        VariableDeclaration,
        VariableDeclarator,
        ArgumentList,
        ParameterList,
        TypeArgumentList,
        TypeParameterList,
        HeritageClause,
        EqualsValueClause,
        CaseSwitchClause,
        DefaultSwitchClause,
        ElseClause,
        CatchClause,
        FinallyClause,
        TypeParameter,
        Constraint,
        SimplePropertyAssignment,
        GetAccessorPropertyAssignment,
        SetAccessorPropertyAssignment,
        FunctionPropertyAssignment,
        Parameter,
        EnumElement,
        TypeAnnotation,
        ExternalModuleReference,
        ModuleNameModuleReference,
        FirstStandardKeyword,
        LastStandardKeyword,
        FirstFutureReservedKeyword,
        LastFutureReservedKeyword,
        FirstFutureReservedStrictKeyword,
        LastFutureReservedStrictKeyword,
        FirstTypeScriptKeyword,
        LastTypeScriptKeyword,
        FirstKeyword,
        LastKeyword,
        FirstToken,
        LastToken,
        FirstPunctuation,
        LastPunctuation,
        FirstFixedWidth,
        LastFixedWidth,
    }
}
declare module TypeScript.SyntaxFacts {
    function getTokenKind(text: string): TypeScript.SyntaxKind;
    function getText(kind: TypeScript.SyntaxKind): string;
    function isTokenKind(kind: TypeScript.SyntaxKind): boolean;
    function isAnyKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isStandardKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isFutureReservedKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isFutureReservedStrictKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isAnyPunctuation(kind: TypeScript.SyntaxKind): boolean;
    function isPrefixUnaryExpressionOperatorToken(tokenKind: TypeScript.SyntaxKind): boolean;
    function isBinaryExpressionOperatorToken(tokenKind: TypeScript.SyntaxKind): boolean;
    function getPrefixUnaryExpressionFromOperatorToken(tokenKind: TypeScript.SyntaxKind): TypeScript.SyntaxKind;
    function getPostfixUnaryExpressionFromOperatorToken(tokenKind: TypeScript.SyntaxKind): TypeScript.SyntaxKind;
    function getBinaryExpressionFromOperatorToken(tokenKind: TypeScript.SyntaxKind): TypeScript.SyntaxKind;
    function isAnyDivideToken(kind: TypeScript.SyntaxKind): boolean;
    function isAnyDivideOrRegularExpressionToken(kind: TypeScript.SyntaxKind): boolean;
    function isParserGenerated(kind: TypeScript.SyntaxKind): boolean;
    function isAnyBinaryExpression(kind: TypeScript.SyntaxKind): boolean;
}
declare module TypeScript.SyntaxFacts {
    function isDirectivePrologueElement(node: TypeScript.ISyntaxNodeOrToken): boolean;
    function isUseStrictDirective(node: TypeScript.ISyntaxNodeOrToken): boolean;
    function isIdentifierNameOrAnyKeyword(token: TypeScript.ISyntaxToken): boolean;
}
declare module TypeScript {
    interface ISyntaxList extends TypeScript.ISyntaxElement {
        childAt(index: number): TypeScript.ISyntaxNodeOrToken;
        toArray(): TypeScript.ISyntaxNodeOrToken[];
        insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
    }
}
declare module TypeScript.Syntax {
    class EmptySyntaxList implements TypeScript.ISyntaxList {
        public kind(): TypeScript.SyntaxKind;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public toJSON(key): any[];
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxNodeOrToken;
        public toArray(): TypeScript.ISyntaxNodeOrToken[];
        public collectTextElements(elements: string[]): void;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public fullWidth(): number;
        public width(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public leadingTriviaWidth(): number;
        public trailingTriviaWidth(): number;
        public fullText(): string;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public findTokenInternal(parent: TypeScript.PositionedElement, position: number, fullStart: number): TypeScript.PositionedToken;
        public insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
    }
    var emptyList: TypeScript.ISyntaxList;
    function list(nodes: TypeScript.ISyntaxNodeOrToken[]): TypeScript.ISyntaxList;
}
declare module TypeScript {
    class SyntaxNode implements TypeScript.ISyntaxNodeOrToken {
        private _data;
        constructor(parsedInStrictMode: boolean);
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public toJSON(key);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public fullText(): string;
        public collectTextElements(elements: string[]): void;
        public replaceToken(token1: TypeScript.ISyntaxToken, token2: TypeScript.ISyntaxToken): SyntaxNode;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SyntaxNode;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SyntaxNode;
        public hasLeadingTrivia(): boolean;
        public hasTrailingTrivia(): boolean;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public parsedInStrictMode(): boolean;
        public fullWidth(): number;
        private computeData();
        private data();
        public findToken(position: number, includeSkippedTokens?: boolean): TypeScript.PositionedToken;
        private tryGetEndOfFileAt(position);
        private findTokenInternal(parent, position, fullStart);
        public findTokenOnLeft(position: number, includeSkippedTokens?: boolean): TypeScript.PositionedToken;
        public findCompleteTokenOnLeft(position: number, includeSkippedTokens?: boolean): TypeScript.PositionedToken;
        public isModuleElement(): boolean;
        public isClassElement(): boolean;
        public isTypeMember(): boolean;
        public isStatement(): boolean;
        public isSwitchClause(): boolean;
        public structuralEquals(node: SyntaxNode): boolean;
        public width(): number;
        public leadingTriviaWidth(): number;
        public trailingTriviaWidth(): number;
    }
}
declare module TypeScript {
    interface ISyntaxNodeOrToken extends TypeScript.ISyntaxElement {
        withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxNodeOrToken;
        withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxNodeOrToken;
        accept(visitor: TypeScript.ISyntaxVisitor): any;
    }
}
declare module TypeScript {
    class SourceUnitSyntax extends TypeScript.SyntaxNode {
        public moduleElements: TypeScript.ISyntaxList;
        public endOfFileToken: TypeScript.ISyntaxToken;
        constructor(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        static create(endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        static create1(endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SourceUnitSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SourceUnitSyntax;
        public withModuleElements(moduleElements: TypeScript.ISyntaxList): SourceUnitSyntax;
        public withModuleElement(moduleElement: TypeScript.IModuleElementSyntax): SourceUnitSyntax;
        public withEndOfFileToken(endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ModuleReferenceSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleReferenceSyntax {
        constructor(parsedInStrictMode: boolean);
        public isModuleReference(): boolean;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleReferenceSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleReferenceSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ExternalModuleReferenceSyntax extends ModuleReferenceSyntax {
        public moduleOrRequireKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public stringLiteral: TypeScript.ISyntaxToken;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(moduleOrRequireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(moduleOrRequireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        static create1(moduleOrRequireKeyword: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExternalModuleReferenceSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExternalModuleReferenceSyntax;
        public withModuleOrRequireKeyword(moduleOrRequireKeyword: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withStringLiteral(stringLiteral: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ModuleNameModuleReferenceSyntax extends ModuleReferenceSyntax {
        public moduleName: TypeScript.INameSyntax;
        constructor(moduleName: TypeScript.INameSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(moduleName: TypeScript.INameSyntax): ModuleNameModuleReferenceSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleNameModuleReferenceSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleNameModuleReferenceSyntax;
        public withModuleName(moduleName: TypeScript.INameSyntax): ModuleNameModuleReferenceSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ImportDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public importKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public equalsToken: TypeScript.ISyntaxToken;
        public moduleReference: ModuleReferenceSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: ModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken, moduleReference: ModuleReferenceSyntax): ImportDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ImportDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ImportDeclarationSyntax;
        public withImportKeyword(importKeyword: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public withEqualsToken(equalsToken: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public withModuleReference(moduleReference: ModuleReferenceSyntax): ImportDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ExportAssignmentSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public exportKeyword: TypeScript.ISyntaxToken;
        public equalsToken: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExportAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExportAssignmentSyntax;
        public withExportKeyword(exportKeyword: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withEqualsToken(equalsToken: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ClassDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public classKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public typeParameterList: TypeParameterListSyntax;
        public heritageClauses: TypeScript.ISyntaxList;
        public openBraceToken: TypeScript.ISyntaxToken;
        public classElements: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        static create(classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ClassDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ClassDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): ClassDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withClassKeyword(classKeyword: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ClassDeclarationSyntax;
        public withHeritageClauses(heritageClauses: TypeScript.ISyntaxList): ClassDeclarationSyntax;
        public withHeritageClause(heritageClause: HeritageClauseSyntax): ClassDeclarationSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withClassElements(classElements: TypeScript.ISyntaxList): ClassDeclarationSyntax;
        public withClassElement(classElement: TypeScript.IClassElementSyntax): ClassDeclarationSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class InterfaceDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public interfaceKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public typeParameterList: TypeParameterListSyntax;
        public heritageClauses: TypeScript.ISyntaxList;
        public body: ObjectTypeSyntax;
        constructor(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: ObjectTypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        static create(interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): InterfaceDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): InterfaceDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): InterfaceDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withInterfaceKeyword(interfaceKeyword: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): InterfaceDeclarationSyntax;
        public withHeritageClauses(heritageClauses: TypeScript.ISyntaxList): InterfaceDeclarationSyntax;
        public withHeritageClause(heritageClause: HeritageClauseSyntax): InterfaceDeclarationSyntax;
        public withBody(body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class HeritageClauseSyntax extends TypeScript.SyntaxNode {
        public extendsOrImplementsKeyword: TypeScript.ISyntaxToken;
        public typeNames: TypeScript.ISeparatedSyntaxList;
        constructor(extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): HeritageClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): HeritageClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): HeritageClauseSyntax;
        public withExtendsOrImplementsKeyword(extendsOrImplementsKeyword: TypeScript.ISyntaxToken): HeritageClauseSyntax;
        public withTypeNames(typeNames: TypeScript.ISeparatedSyntaxList): HeritageClauseSyntax;
        public withTypeName(typeName: TypeScript.INameSyntax): HeritageClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ModuleDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public moduleKeyword: TypeScript.ISyntaxToken;
        public moduleName: TypeScript.INameSyntax;
        public stringLiteral: TypeScript.ISyntaxToken;
        public openBraceToken: TypeScript.ISyntaxToken;
        public moduleElements: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, moduleName: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, moduleName: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        static create(moduleKeyword: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        static create1(): ModuleDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): ModuleDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withModuleKeyword(moduleKeyword: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withModuleName(moduleName: TypeScript.INameSyntax): ModuleDeclarationSyntax;
        public withStringLiteral(stringLiteral: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withModuleElements(moduleElements: TypeScript.ISyntaxList): ModuleDeclarationSyntax;
        public withModuleElement(moduleElement: TypeScript.IModuleElementSyntax): ModuleDeclarationSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public functionKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        static create(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): FunctionDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): FunctionDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withFunctionKeyword(functionKeyword: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): FunctionDeclarationSyntax;
        public withBlock(block: BlockSyntax): FunctionDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VariableStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public variableDeclaration: VariableDeclarationSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): VariableStatementSyntax;
        static create(variableDeclaration: VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): VariableStatementSyntax;
        static create1(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableStatementSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): VariableStatementSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): VariableStatementSyntax;
        public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): VariableStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VariableDeclarationSyntax extends TypeScript.SyntaxNode {
        public varKeyword: TypeScript.ISyntaxToken;
        public variableDeclarators: TypeScript.ISeparatedSyntaxList;
        constructor(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): VariableDeclarationSyntax;
        static create1(variableDeclarators: TypeScript.ISeparatedSyntaxList): VariableDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclarationSyntax;
        public withVarKeyword(varKeyword: TypeScript.ISyntaxToken): VariableDeclarationSyntax;
        public withVariableDeclarators(variableDeclarators: TypeScript.ISeparatedSyntaxList): VariableDeclarationSyntax;
        public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): VariableDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VariableDeclaratorSyntax extends TypeScript.SyntaxNode {
        public identifier: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        public equalsValueClause: EqualsValueClauseSyntax;
        constructor(identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        static create(identifier: TypeScript.ISyntaxToken): VariableDeclaratorSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): VariableDeclaratorSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclaratorSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclaratorSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): VariableDeclaratorSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): VariableDeclaratorSyntax;
        public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EqualsValueClauseSyntax extends TypeScript.SyntaxNode {
        public equalsToken: TypeScript.ISyntaxToken;
        public value: TypeScript.IExpressionSyntax;
        constructor(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): EqualsValueClauseSyntax;
        static create1(value: TypeScript.IExpressionSyntax): EqualsValueClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EqualsValueClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EqualsValueClauseSyntax;
        public withEqualsToken(equalsToken: TypeScript.ISyntaxToken): EqualsValueClauseSyntax;
        public withValue(value: TypeScript.IExpressionSyntax): EqualsValueClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class PrefixUnaryExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public operatorToken: TypeScript.ISyntaxToken;
        public operand: TypeScript.IUnaryExpressionSyntax;
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public update(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): PrefixUnaryExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): PrefixUnaryExpressionSyntax;
        public withKind(kind: TypeScript.SyntaxKind): PrefixUnaryExpressionSyntax;
        public withOperatorToken(operatorToken: TypeScript.ISyntaxToken): PrefixUnaryExpressionSyntax;
        public withOperand(operand: TypeScript.IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ArrayLiteralExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public openBracketToken: TypeScript.ISyntaxToken;
        public expressions: TypeScript.ISeparatedSyntaxList;
        public closeBracketToken: TypeScript.ISyntaxToken;
        constructor(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        static create(openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        static create1(): ArrayLiteralExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayLiteralExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayLiteralExpressionSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        public withExpressions(expressions: TypeScript.ISeparatedSyntaxList): ArrayLiteralExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ArrayLiteralExpressionSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class OmittedExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IExpressionSyntax {
        constructor(parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isExpression(): boolean;
        public update(): OmittedExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): OmittedExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): OmittedExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParenthesizedExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public openParenToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): ParenthesizedExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): ParenthesizedExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedExpressionSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ParenthesizedExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ParenthesizedExpressionSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ParenthesizedExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ArrowFunctionExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public equalsGreaterThanToken: TypeScript.ISyntaxToken;
        public body: TypeScript.ISyntaxNodeOrToken;
        constructor(equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken, parsedInStrictMode: boolean);
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrowFunctionExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrowFunctionExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SimpleArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {
        public identifier: TypeScript.ISyntaxToken;
        constructor(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax;
        static create1(identifier: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        public withBody(body: TypeScript.ISyntaxNodeOrToken): SimpleArrowFunctionExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParenthesizedArrowFunctionExpressionSyntax extends ArrowFunctionExpressionSyntax {
        public callSignature: CallSignatureSyntax;
        constructor(callSignature: CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(callSignature: CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, body: TypeScript.ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax;
        static create1(body: TypeScript.ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): ParenthesizedArrowFunctionExpressionSyntax;
        public withBody(body: TypeScript.ISyntaxNodeOrToken): ParenthesizedArrowFunctionExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class QualifiedNameSyntax extends TypeScript.SyntaxNode implements TypeScript.INameSyntax {
        public left: TypeScript.INameSyntax;
        public dotToken: TypeScript.ISyntaxToken;
        public right: TypeScript.ISyntaxToken;
        constructor(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isName(): boolean;
        public isType(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        static create1(left: TypeScript.INameSyntax, right: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): QualifiedNameSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): QualifiedNameSyntax;
        public withLeft(left: TypeScript.INameSyntax): QualifiedNameSyntax;
        public withDotToken(dotToken: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        public withRight(right: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeArgumentListSyntax extends TypeScript.SyntaxNode {
        public lessThanToken: TypeScript.ISyntaxToken;
        public typeArguments: TypeScript.ISeparatedSyntaxList;
        public greaterThanToken: TypeScript.ISyntaxToken;
        constructor(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        static create(lessThanToken: TypeScript.ISyntaxToken, greaterThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        static create1(): TypeArgumentListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeArgumentListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeArgumentListSyntax;
        public withLessThanToken(lessThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        public withTypeArguments(typeArguments: TypeScript.ISeparatedSyntaxList): TypeArgumentListSyntax;
        public withTypeArgument(typeArgument: TypeScript.ITypeSyntax): TypeArgumentListSyntax;
        public withGreaterThanToken(greaterThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstructorTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public newKeyword: TypeScript.ISyntaxToken;
        public typeParameterList: TypeParameterListSyntax;
        public parameterList: ParameterListSyntax;
        public equalsGreaterThanToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        static create(newKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        static create1(type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorTypeSyntax;
        public withNewKeyword(newKeyword: TypeScript.ISyntaxToken): ConstructorTypeSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ConstructorTypeSyntax;
        public withParameterList(parameterList: ParameterListSyntax): ConstructorTypeSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): ConstructorTypeSyntax;
        public withType(type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public typeParameterList: TypeParameterListSyntax;
        public parameterList: ParameterListSyntax;
        public equalsGreaterThanToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        static create(parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        static create1(type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionTypeSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): FunctionTypeSyntax;
        public withParameterList(parameterList: ParameterListSyntax): FunctionTypeSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): FunctionTypeSyntax;
        public withType(type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ObjectTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public openBraceToken: TypeScript.ISyntaxToken;
        public typeMembers: TypeScript.ISeparatedSyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        static create(openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        static create1(): ObjectTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectTypeSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        public withTypeMembers(typeMembers: TypeScript.ISeparatedSyntaxList): ObjectTypeSyntax;
        public withTypeMember(typeMember: TypeScript.ITypeMemberSyntax): ObjectTypeSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ArrayTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public type: TypeScript.ITypeSyntax;
        public openBracketToken: TypeScript.ISyntaxToken;
        public closeBracketToken: TypeScript.ISyntaxToken;
        constructor(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): ArrayTypeSyntax;
        static create1(type: TypeScript.ITypeSyntax): ArrayTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayTypeSyntax;
        public withType(type: TypeScript.ITypeSyntax): ArrayTypeSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): ArrayTypeSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): ArrayTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class GenericTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public name: TypeScript.INameSyntax;
        public typeArgumentList: TypeArgumentListSyntax;
        constructor(name: TypeScript.INameSyntax, typeArgumentList: TypeArgumentListSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(name: TypeScript.INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        static create1(name: TypeScript.INameSyntax): GenericTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): GenericTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): GenericTypeSyntax;
        public withName(name: TypeScript.INameSyntax): GenericTypeSyntax;
        public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeAnnotationSyntax extends TypeScript.SyntaxNode {
        public colonToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeAnnotationSyntax;
        static create1(type: TypeScript.ITypeSyntax): TypeAnnotationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeAnnotationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeAnnotationSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): TypeAnnotationSyntax;
        public withType(type: TypeScript.ITypeSyntax): TypeAnnotationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class BlockSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public openBraceToken: TypeScript.ISyntaxToken;
        public statements: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        static create(openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        static create1(): BlockSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): BlockSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): BlockSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        public withStatements(statements: TypeScript.ISyntaxList): BlockSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): BlockSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParameterSyntax extends TypeScript.SyntaxNode {
        public dotDotDotToken: TypeScript.ISyntaxToken;
        public publicOrPrivateKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public questionToken: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        public equalsValueClause: EqualsValueClauseSyntax;
        constructor(dotDotDotToken: TypeScript.ISyntaxToken, publicOrPrivateKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(dotDotDotToken: TypeScript.ISyntaxToken, publicOrPrivateKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        static create(identifier: TypeScript.ISyntaxToken): ParameterSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): ParameterSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterSyntax;
        public withDotDotDotToken(dotDotDotToken: TypeScript.ISyntaxToken): ParameterSyntax;
        public withPublicOrPrivateKeyword(publicOrPrivateKeyword: TypeScript.ISyntaxToken): ParameterSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ParameterSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): ParameterSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): ParameterSyntax;
        public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MemberAccessExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public expression: TypeScript.IExpressionSyntax;
        public dotToken: TypeScript.ISyntaxToken;
        public name: TypeScript.ISyntaxToken;
        constructor(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax, name: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberAccessExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberAccessExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): MemberAccessExpressionSyntax;
        public withDotToken(dotToken: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        public withName(name: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class PostfixUnaryExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public operand: TypeScript.IExpressionSyntax;
        public operatorToken: TypeScript.ISyntaxToken;
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, operand: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public update(kind: TypeScript.SyntaxKind, operand: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): PostfixUnaryExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): PostfixUnaryExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): PostfixUnaryExpressionSyntax;
        public withKind(kind: TypeScript.SyntaxKind): PostfixUnaryExpressionSyntax;
        public withOperand(operand: TypeScript.IExpressionSyntax): PostfixUnaryExpressionSyntax;
        public withOperatorToken(operatorToken: TypeScript.ISyntaxToken): PostfixUnaryExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ElementAccessExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public expression: TypeScript.IExpressionSyntax;
        public openBracketToken: TypeScript.ISyntaxToken;
        public argumentExpression: TypeScript.IExpressionSyntax;
        public closeBracketToken: TypeScript.ISyntaxToken;
        constructor(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): ElementAccessExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax, argumentExpression: TypeScript.IExpressionSyntax): ElementAccessExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElementAccessExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElementAccessExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ElementAccessExpressionSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): ElementAccessExpressionSyntax;
        public withArgumentExpression(argumentExpression: TypeScript.IExpressionSyntax): ElementAccessExpressionSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): ElementAccessExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class InvocationExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public expression: TypeScript.IExpressionSyntax;
        public argumentList: ArgumentListSyntax;
        constructor(expression: TypeScript.IExpressionSyntax, argumentList: ArgumentListSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(expression: TypeScript.IExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): InvocationExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): InvocationExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): InvocationExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): InvocationExpressionSyntax;
        public withArgumentList(argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ArgumentListSyntax extends TypeScript.SyntaxNode {
        public typeArgumentList: TypeArgumentListSyntax;
        public openParenToken: TypeScript.ISyntaxToken;
        public arguments: TypeScript.ISeparatedSyntaxList;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(typeArgumentList: TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(typeArgumentList: TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, _arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        static create(openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        static create1(): ArgumentListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArgumentListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArgumentListSyntax;
        public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): ArgumentListSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        public withArguments(_arguments: TypeScript.ISeparatedSyntaxList): ArgumentListSyntax;
        public withArgument(_argument: TypeScript.IExpressionSyntax): ArgumentListSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class BinaryExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IExpressionSyntax {
        public left: TypeScript.IExpressionSyntax;
        public operatorToken: TypeScript.ISyntaxToken;
        public right: TypeScript.IExpressionSyntax;
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isExpression(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public update(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): BinaryExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): BinaryExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): BinaryExpressionSyntax;
        public withKind(kind: TypeScript.SyntaxKind): BinaryExpressionSyntax;
        public withLeft(left: TypeScript.IExpressionSyntax): BinaryExpressionSyntax;
        public withOperatorToken(operatorToken: TypeScript.ISyntaxToken): BinaryExpressionSyntax;
        public withRight(right: TypeScript.IExpressionSyntax): BinaryExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConditionalExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IExpressionSyntax {
        public condition: TypeScript.IExpressionSyntax;
        public questionToken: TypeScript.ISyntaxToken;
        public whenTrue: TypeScript.IExpressionSyntax;
        public colonToken: TypeScript.ISyntaxToken;
        public whenFalse: TypeScript.IExpressionSyntax;
        constructor(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isExpression(): boolean;
        public update(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, whenTrue: TypeScript.IExpressionSyntax, whenFalse: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConditionalExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConditionalExpressionSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): ConditionalExpressionSyntax;
        public withWhenTrue(whenTrue: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): ConditionalExpressionSyntax;
        public withWhenFalse(whenFalse: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstructSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public newKeyword: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        constructor(newKeyword: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(newKeyword: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        static create1(): ConstructSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructSignatureSyntax;
        public withNewKeyword(newKeyword: TypeScript.ISyntaxToken): ConstructSignatureSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MethodSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public propertyName: TypeScript.ISyntaxToken;
        public questionToken: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        static create(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): MethodSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MethodSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MethodSignatureSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): MethodSignatureSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): MethodSignatureSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class IndexSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax, TypeScript.IClassElementSyntax {
        public openBracketToken: TypeScript.ISyntaxToken;
        public parameter: ParameterSyntax;
        public closeBracketToken: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(openBracketToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public isClassElement(): boolean;
        public update(openBracketToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        static create(openBracketToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken): IndexSignatureSyntax;
        static create1(parameter: ParameterSyntax): IndexSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): IndexSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): IndexSignatureSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): IndexSignatureSyntax;
        public withParameter(parameter: ParameterSyntax): IndexSignatureSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): IndexSignatureSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class PropertySignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public propertyName: TypeScript.ISyntaxToken;
        public questionToken: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        static create(propertyName: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): PropertySignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): PropertySignatureSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CallSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public typeParameterList: TypeParameterListSyntax;
        public parameterList: ParameterListSyntax;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        static create(parameterList: ParameterListSyntax): CallSignatureSyntax;
        static create1(): CallSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CallSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CallSignatureSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): CallSignatureSyntax;
        public withParameterList(parameterList: ParameterListSyntax): CallSignatureSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParameterListSyntax extends TypeScript.SyntaxNode {
        public openParenToken: TypeScript.ISyntaxToken;
        public parameters: TypeScript.ISeparatedSyntaxList;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        static create(openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        static create1(): ParameterListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterListSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        public withParameters(parameters: TypeScript.ISeparatedSyntaxList): ParameterListSyntax;
        public withParameter(parameter: ParameterSyntax): ParameterListSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeParameterListSyntax extends TypeScript.SyntaxNode {
        public lessThanToken: TypeScript.ISyntaxToken;
        public typeParameters: TypeScript.ISeparatedSyntaxList;
        public greaterThanToken: TypeScript.ISyntaxToken;
        constructor(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        static create(lessThanToken: TypeScript.ISyntaxToken, greaterThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        static create1(): TypeParameterListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterListSyntax;
        public withLessThanToken(lessThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        public withTypeParameters(typeParameters: TypeScript.ISeparatedSyntaxList): TypeParameterListSyntax;
        public withTypeParameter(typeParameter: TypeParameterSyntax): TypeParameterListSyntax;
        public withGreaterThanToken(greaterThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeParameterSyntax extends TypeScript.SyntaxNode {
        public identifier: TypeScript.ISyntaxToken;
        public constraint: ConstraintSyntax;
        constructor(identifier: TypeScript.ISyntaxToken, constraint: ConstraintSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(identifier: TypeScript.ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        static create(identifier: TypeScript.ISyntaxToken): TypeParameterSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): TypeParameterSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): TypeParameterSyntax;
        public withConstraint(constraint: ConstraintSyntax): TypeParameterSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstraintSyntax extends TypeScript.SyntaxNode {
        public extendsKeyword: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): ConstraintSyntax;
        static create1(type: TypeScript.ITypeSyntax): ConstraintSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstraintSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstraintSyntax;
        public withExtendsKeyword(extendsKeyword: TypeScript.ISyntaxToken): ConstraintSyntax;
        public withType(type: TypeScript.ITypeSyntax): ConstraintSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ElseClauseSyntax extends TypeScript.SyntaxNode {
        public elseKeyword: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ElseClauseSyntax;
        static create1(statement: TypeScript.IStatementSyntax): ElseClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElseClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElseClauseSyntax;
        public withElseKeyword(elseKeyword: TypeScript.ISyntaxToken): ElseClauseSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): ElseClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class IfStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public ifKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        public elseClause: ElseClauseSyntax;
        constructor(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: ElseClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        static create(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): IfStatementSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): IfStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): IfStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): IfStatementSyntax;
        public withIfKeyword(ifKeyword: TypeScript.ISyntaxToken): IfStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): IfStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): IfStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): IfStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): IfStatementSyntax;
        public withElseClause(elseClause: ElseClauseSyntax): IfStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ExpressionStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public expression: TypeScript.IExpressionSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): ExpressionStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): ExpressionStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExpressionStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExpressionStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ExpressionStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ExpressionStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstructorDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IClassElementSyntax {
        public constructorKeyword: TypeScript.ISyntaxToken;
        public parameterList: ParameterListSyntax;
        public block: BlockSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(constructorKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isClassElement(): boolean;
        public update(constructorKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): ConstructorDeclarationSyntax;
        static create(constructorKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax): ConstructorDeclarationSyntax;
        static create1(): ConstructorDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorDeclarationSyntax;
        public withConstructorKeyword(constructorKeyword: TypeScript.ISyntaxToken): ConstructorDeclarationSyntax;
        public withParameterList(parameterList: ParameterListSyntax): ConstructorDeclarationSyntax;
        public withBlock(block: BlockSyntax): ConstructorDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ConstructorDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MemberFunctionDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberDeclarationSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public propertyName: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberDeclaration(): boolean;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        static create(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): MemberFunctionDeclarationSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberFunctionDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberFunctionDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): MemberFunctionDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): MemberFunctionDeclarationSyntax;
        public withBlock(block: BlockSyntax): MemberFunctionDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MemberAccessorDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberDeclarationSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public propertyName: TypeScript.ISyntaxToken;
        public parameterList: ParameterListSyntax;
        public block: BlockSyntax;
        constructor(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public isMemberDeclaration(): boolean;
        public isClassElement(): boolean;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberAccessorDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberAccessorDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class GetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {
        public getKeyword: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetMemberAccessorDeclarationSyntax;
        static create(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): GetMemberAccessorDeclarationSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): GetMemberAccessorDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): GetMemberAccessorDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): GetMemberAccessorDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): GetMemberAccessorDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): GetMemberAccessorDeclarationSyntax;
        public withGetKeyword(getKeyword: TypeScript.ISyntaxToken): GetMemberAccessorDeclarationSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): GetMemberAccessorDeclarationSyntax;
        public withParameterList(parameterList: ParameterListSyntax): GetMemberAccessorDeclarationSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): GetMemberAccessorDeclarationSyntax;
        public withBlock(block: BlockSyntax): GetMemberAccessorDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SetMemberAccessorDeclarationSyntax extends MemberAccessorDeclarationSyntax {
        public setKeyword: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetMemberAccessorDeclarationSyntax;
        static create(setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetMemberAccessorDeclarationSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): SetMemberAccessorDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SetMemberAccessorDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SetMemberAccessorDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): SetMemberAccessorDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): SetMemberAccessorDeclarationSyntax;
        public withSetKeyword(setKeyword: TypeScript.ISyntaxToken): SetMemberAccessorDeclarationSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): SetMemberAccessorDeclarationSyntax;
        public withParameterList(parameterList: ParameterListSyntax): SetMemberAccessorDeclarationSyntax;
        public withBlock(block: BlockSyntax): SetMemberAccessorDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MemberVariableDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberDeclarationSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public variableDeclarator: VariableDeclaratorSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberDeclaration(): boolean;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        static create(variableDeclarator: VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        static create1(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberVariableDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberVariableDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): MemberVariableDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ThrowStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public throwKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): ThrowStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): ThrowStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ThrowStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ThrowStatementSyntax;
        public withThrowKeyword(throwKeyword: TypeScript.ISyntaxToken): ThrowStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ThrowStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ThrowStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ReturnStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public returnKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        static create(returnKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        static create1(): ReturnStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ReturnStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ReturnStatementSyntax;
        public withReturnKeyword(returnKeyword: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ReturnStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ObjectCreationExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public newKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public argumentList: ArgumentListSyntax;
        constructor(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, argumentList: ArgumentListSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        static create(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): ObjectCreationExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): ObjectCreationExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectCreationExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectCreationExpressionSyntax;
        public withNewKeyword(newKeyword: TypeScript.ISyntaxToken): ObjectCreationExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ObjectCreationExpressionSyntax;
        public withArgumentList(argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SwitchStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public switchKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public openBraceToken: TypeScript.ISyntaxToken;
        public switchClauses: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        static create(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): SwitchStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SwitchStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SwitchStatementSyntax;
        public withSwitchKeyword(switchKeyword: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): SwitchStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withSwitchClauses(switchClauses: TypeScript.ISyntaxList): SwitchStatementSyntax;
        public withSwitchClause(switchClause: SwitchClauseSyntax): SwitchStatementSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SwitchClauseSyntax extends TypeScript.SyntaxNode implements TypeScript.ISwitchClauseSyntax {
        public colonToken: TypeScript.ISyntaxToken;
        public statements: TypeScript.ISyntaxList;
        constructor(colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, parsedInStrictMode: boolean);
        public isSwitchClause(): boolean;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SwitchClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SwitchClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CaseSwitchClauseSyntax extends SwitchClauseSyntax {
        public caseKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        constructor(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): CaseSwitchClauseSyntax;
        static create(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken): CaseSwitchClauseSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): CaseSwitchClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CaseSwitchClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CaseSwitchClauseSyntax;
        public withCaseKeyword(caseKeyword: TypeScript.ISyntaxToken): CaseSwitchClauseSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): CaseSwitchClauseSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): CaseSwitchClauseSyntax;
        public withStatements(statements: TypeScript.ISyntaxList): CaseSwitchClauseSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): CaseSwitchClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DefaultSwitchClauseSyntax extends SwitchClauseSyntax {
        public defaultKeyword: TypeScript.ISyntaxToken;
        constructor(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): DefaultSwitchClauseSyntax;
        static create(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken): DefaultSwitchClauseSyntax;
        static create1(): DefaultSwitchClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DefaultSwitchClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DefaultSwitchClauseSyntax;
        public withDefaultKeyword(defaultKeyword: TypeScript.ISyntaxToken): DefaultSwitchClauseSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): DefaultSwitchClauseSyntax;
        public withStatements(statements: TypeScript.ISyntaxList): DefaultSwitchClauseSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): DefaultSwitchClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class BreakStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public breakKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): BreakStatementSyntax;
        static create(breakKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): BreakStatementSyntax;
        static create1(): BreakStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): BreakStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): BreakStatementSyntax;
        public withBreakKeyword(breakKeyword: TypeScript.ISyntaxToken): BreakStatementSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): BreakStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): BreakStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ContinueStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public continueKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        static create(continueKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        static create1(): ContinueStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ContinueStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ContinueStatementSyntax;
        public withContinueKeyword(continueKeyword: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class IterationStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public openParenToken: TypeScript.ISyntaxToken;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): IterationStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): IterationStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class BaseForStatementSyntax extends IterationStatementSyntax {
        public forKeyword: TypeScript.ISyntaxToken;
        public variableDeclaration: VariableDeclarationSyntax;
        constructor(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): BaseForStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): BaseForStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ForStatementSyntax extends BaseForStatementSyntax {
        public initializer: TypeScript.IExpressionSyntax;
        public firstSemicolonToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public secondSemicolonToken: TypeScript.ISyntaxToken;
        public incrementor: TypeScript.IExpressionSyntax;
        constructor(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        static create(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, firstSemicolonToken: TypeScript.ISyntaxToken, secondSemicolonToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        static create1(statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForStatementSyntax;
        public withForKeyword(forKeyword: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForStatementSyntax;
        public withInitializer(initializer: TypeScript.IExpressionSyntax): ForStatementSyntax;
        public withFirstSemicolonToken(firstSemicolonToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): ForStatementSyntax;
        public withSecondSemicolonToken(secondSemicolonToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withIncrementor(incrementor: TypeScript.IExpressionSyntax): ForStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ForInStatementSyntax extends BaseForStatementSyntax {
        public left: TypeScript.IExpressionSyntax;
        public inKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        constructor(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        static create(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForInStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForInStatementSyntax;
        public withForKeyword(forKeyword: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForInStatementSyntax;
        public withLeft(left: TypeScript.IExpressionSyntax): ForInStatementSyntax;
        public withInKeyword(inKeyword: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ForInStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class WhileStatementSyntax extends IterationStatementSyntax {
        public whileKeyword: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        constructor(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): WhileStatementSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): WhileStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): WhileStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): WhileStatementSyntax;
        public withWhileKeyword(whileKeyword: TypeScript.ISyntaxToken): WhileStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): WhileStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): WhileStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): WhileStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): WhileStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class WithStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public withKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): WithStatementSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): WithStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): WithStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): WithStatementSyntax;
        public withWithKeyword(withKeyword: TypeScript.ISyntaxToken): WithStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): WithStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): WithStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): WithStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): WithStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EnumDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public enumKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public openBraceToken: TypeScript.ISyntaxToken;
        public enumElements: TypeScript.ISeparatedSyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        static create(enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): EnumDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withEnumKeyword(enumKeyword: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withEnumElements(enumElements: TypeScript.ISeparatedSyntaxList): EnumDeclarationSyntax;
        public withEnumElement(enumElement: EnumElementSyntax): EnumDeclarationSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EnumElementSyntax extends TypeScript.SyntaxNode {
        public propertyName: TypeScript.ISyntaxToken;
        public equalsValueClause: EqualsValueClauseSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(propertyName: TypeScript.ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        static create(propertyName: TypeScript.ISyntaxToken): EnumElementSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): EnumElementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumElementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumElementSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): EnumElementSyntax;
        public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CastExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public lessThanToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        public greaterThanToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IUnaryExpressionSyntax;
        constructor(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): CastExpressionSyntax;
        static create1(type: TypeScript.ITypeSyntax, expression: TypeScript.IUnaryExpressionSyntax): CastExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CastExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CastExpressionSyntax;
        public withLessThanToken(lessThanToken: TypeScript.ISyntaxToken): CastExpressionSyntax;
        public withType(type: TypeScript.ITypeSyntax): CastExpressionSyntax;
        public withGreaterThanToken(greaterThanToken: TypeScript.ISyntaxToken): CastExpressionSyntax;
        public withExpression(expression: TypeScript.IUnaryExpressionSyntax): CastExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ObjectLiteralExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public openBraceToken: TypeScript.ISyntaxToken;
        public propertyAssignments: TypeScript.ISeparatedSyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        static create(openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        static create1(): ObjectLiteralExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectLiteralExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectLiteralExpressionSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        public withPropertyAssignments(propertyAssignments: TypeScript.ISeparatedSyntaxList): ObjectLiteralExpressionSyntax;
        public withPropertyAssignment(propertyAssignment: PropertyAssignmentSyntax): ObjectLiteralExpressionSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class PropertyAssignmentSyntax extends TypeScript.SyntaxNode {
        public propertyName: TypeScript.ISyntaxToken;
        constructor(propertyName: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): PropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): PropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SimplePropertyAssignmentSyntax extends PropertyAssignmentSyntax {
        public colonToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): SimplePropertyAssignmentSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): SimplePropertyAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimplePropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimplePropertyAssignmentSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): SimplePropertyAssignmentSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): SimplePropertyAssignmentSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): SimplePropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): FunctionPropertyAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionPropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionPropertyAssignmentSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): FunctionPropertyAssignmentSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): FunctionPropertyAssignmentSyntax;
        public withBlock(block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class AccessorPropertyAssignmentSyntax extends PropertyAssignmentSyntax {
        public openParenToken: TypeScript.ISyntaxToken;
        public closeParenToken: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): AccessorPropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): AccessorPropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class GetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
        public getKeyword: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetAccessorPropertyAssignmentSyntax;
        static create(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax): GetAccessorPropertyAssignmentSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): GetAccessorPropertyAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): GetAccessorPropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): GetAccessorPropertyAssignmentSyntax;
        public withGetKeyword(getKeyword: TypeScript.ISyntaxToken): GetAccessorPropertyAssignmentSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): GetAccessorPropertyAssignmentSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): GetAccessorPropertyAssignmentSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): GetAccessorPropertyAssignmentSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): GetAccessorPropertyAssignmentSyntax;
        public withBlock(block: BlockSyntax): GetAccessorPropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SetAccessorPropertyAssignmentSyntax extends AccessorPropertyAssignmentSyntax {
        public setKeyword: TypeScript.ISyntaxToken;
        public parameter: ParameterSyntax;
        constructor(setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax): SetAccessorPropertyAssignmentSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken, parameter: ParameterSyntax): SetAccessorPropertyAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SetAccessorPropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SetAccessorPropertyAssignmentSyntax;
        public withSetKeyword(setKeyword: TypeScript.ISyntaxToken): SetAccessorPropertyAssignmentSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): SetAccessorPropertyAssignmentSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): SetAccessorPropertyAssignmentSyntax;
        public withParameter(parameter: ParameterSyntax): SetAccessorPropertyAssignmentSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): SetAccessorPropertyAssignmentSyntax;
        public withBlock(block: BlockSyntax): SetAccessorPropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public functionKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        constructor(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        static create(functionKeyword: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        static create1(): FunctionExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionExpressionSyntax;
        public withFunctionKeyword(functionKeyword: TypeScript.ISyntaxToken): FunctionExpressionSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): FunctionExpressionSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): FunctionExpressionSyntax;
        public withBlock(block: BlockSyntax): FunctionExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EmptyStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(semicolonToken: TypeScript.ISyntaxToken): EmptyStatementSyntax;
        static create1(): EmptyStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EmptyStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EmptyStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): EmptyStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TryStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public tryKeyword: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        public catchClause: CatchClauseSyntax;
        public finallyClause: FinallyClauseSyntax;
        constructor(tryKeyword: TypeScript.ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(tryKeyword: TypeScript.ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        static create(tryKeyword: TypeScript.ISyntaxToken, block: BlockSyntax): TryStatementSyntax;
        static create1(): TryStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TryStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TryStatementSyntax;
        public withTryKeyword(tryKeyword: TypeScript.ISyntaxToken): TryStatementSyntax;
        public withBlock(block: BlockSyntax): TryStatementSyntax;
        public withCatchClause(catchClause: CatchClauseSyntax): TryStatementSyntax;
        public withFinallyClause(finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CatchClauseSyntax extends TypeScript.SyntaxNode {
        public catchKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        constructor(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        static create(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CatchClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CatchClauseSyntax;
        public withCatchKeyword(catchKeyword: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CatchClauseSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withBlock(block: BlockSyntax): CatchClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FinallyClauseSyntax extends TypeScript.SyntaxNode {
        public finallyKeyword: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        constructor(finallyKeyword: TypeScript.ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(finallyKeyword: TypeScript.ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax;
        static create1(): FinallyClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FinallyClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FinallyClauseSyntax;
        public withFinallyKeyword(finallyKeyword: TypeScript.ISyntaxToken): FinallyClauseSyntax;
        public withBlock(block: BlockSyntax): FinallyClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class LabeledStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public identifier: TypeScript.ISyntaxToken;
        public colonToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): LabeledStatementSyntax;
        static create1(identifier: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): LabeledStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): LabeledStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): LabeledStatementSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): LabeledStatementSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): LabeledStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): LabeledStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DoStatementSyntax extends IterationStatementSyntax {
        public doKeyword: TypeScript.ISyntaxToken;
        public whileKeyword: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        static create1(statement: TypeScript.IStatementSyntax, condition: TypeScript.IExpressionSyntax): DoStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DoStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DoStatementSyntax;
        public withDoKeyword(doKeyword: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): DoStatementSyntax;
        public withWhileKeyword(whileKeyword: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): DoStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeOfExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public typeOfKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        constructor(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeOfExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): TypeOfExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeOfExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeOfExpressionSyntax;
        public withTypeOfKeyword(typeOfKeyword: TypeScript.ISyntaxToken): TypeOfExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): TypeOfExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DeleteExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public deleteKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        constructor(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): DeleteExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): DeleteExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DeleteExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DeleteExpressionSyntax;
        public withDeleteKeyword(deleteKeyword: TypeScript.ISyntaxToken): DeleteExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): DeleteExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VoidExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public voidKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        constructor(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): VoidExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): VoidExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VoidExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VoidExpressionSyntax;
        public withVoidKeyword(voidKeyword: TypeScript.ISyntaxToken): VoidExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): VoidExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DebuggerStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public debuggerKeyword: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): DebuggerStatementSyntax;
        static create1(): DebuggerStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DebuggerStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DebuggerStatementSyntax;
        public withDebuggerKeyword(debuggerKeyword: TypeScript.ISyntaxToken): DebuggerStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): DebuggerStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
}
declare module TypeScript {
    class SyntaxRewriter implements TypeScript.ISyntaxVisitor {
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public visitNode(node: TypeScript.SyntaxNode): TypeScript.SyntaxNode;
        public visitNodeOrToken(node: TypeScript.ISyntaxNodeOrToken): TypeScript.ISyntaxNodeOrToken;
        public visitList(list: TypeScript.ISyntaxList): TypeScript.ISyntaxList;
        public visitSeparatedList(list: TypeScript.ISeparatedSyntaxList): TypeScript.ISeparatedSyntaxList;
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): any;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): any;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): any;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): any;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): any;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): any;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): any;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): any;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): any;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): any;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): any;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): any;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): any;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): any;
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): any;
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): any;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): any;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): any;
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): any;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): any;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): any;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): any;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): any;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): any;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): any;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): any;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): any;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): any;
        public visitBlock(node: TypeScript.BlockSyntax): any;
        public visitParameter(node: TypeScript.ParameterSyntax): any;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): any;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): any;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): any;
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): any;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): any;
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): any;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): any;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): any;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): any;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): any;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): any;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): any;
        public visitParameterList(node: TypeScript.ParameterListSyntax): any;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): any;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): any;
        public visitConstraint(node: TypeScript.ConstraintSyntax): any;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): any;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): any;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): any;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): any;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): any;
        public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): any;
        public visitSetMemberAccessorDeclaration(node: TypeScript.SetMemberAccessorDeclarationSyntax): any;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): any;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): any;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): any;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): any;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): any;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): any;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): any;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): any;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): any;
        public visitForStatement(node: TypeScript.ForStatementSyntax): any;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): any;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): any;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): any;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): any;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): any;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): any;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): any;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): any;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): any;
        public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): any;
        public visitSetAccessorPropertyAssignment(node: TypeScript.SetAccessorPropertyAssignmentSyntax): any;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): any;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): any;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): any;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): any;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): any;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): any;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): any;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): any;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): any;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): any;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): any;
    }
}
declare module TypeScript {
    class SyntaxDedenter extends TypeScript.SyntaxRewriter {
        private dedentationAmount;
        private minimumIndent;
        private options;
        private lastTriviaWasNewLine;
        constructor(dedentFirstToken: boolean, dedentationAmount: number, minimumIndent: number, options: FormattingOptions);
        private abort();
        private isAborted();
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        private dedentTriviaList(triviaList);
        private dedentSegment(segment, hasFollowingNewLineTrivia);
        private dedentWhitespace(trivia, hasFollowingNewLineTrivia);
        private dedentMultiLineComment(trivia);
        static dedentNode(node: TypeScript.ISyntaxNode, dedentFirstToken: boolean, dedentAmount: number, minimumIndent: number, options: FormattingOptions): TypeScript.ISyntaxNode;
    }
}
declare module TypeScript {
    class SyntaxIndenter extends TypeScript.SyntaxRewriter {
        private indentationAmount;
        private options;
        private lastTriviaWasNewLine;
        private indentationTrivia;
        constructor(indentFirstToken: boolean, indentationAmount: number, options: FormattingOptions);
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public indentTriviaList(triviaList: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxTriviaList;
        private indentSegment(segment);
        private indentWhitespace(trivia, indentThisTrivia, result);
        private indentSingleLineOrSkippedText(trivia, indentThisTrivia, result);
        private indentMultiLineComment(trivia, indentThisTrivia, result);
        static indentNode(node: TypeScript.ISyntaxNode, indentFirstToken: boolean, indentAmount: number, options: FormattingOptions): TypeScript.SyntaxNode;
        static indentNodes(nodes: TypeScript.SyntaxNode[], indentFirstToken: boolean, indentAmount: number, options: FormattingOptions): TypeScript.SyntaxNode[];
    }
}
declare module TypeScript.Syntax {
    class VariableWidthTokenWithNoTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _textOrWidth;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, textOrWidth: any);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    class VariableWidthTokenWithLeadingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        private _textOrWidth;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, textOrWidth: any);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    class VariableWidthTokenWithTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _textOrWidth;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, textOrWidth: any, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    class VariableWidthTokenWithLeadingAndTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        private _textOrWidth;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, textOrWidth: any, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    class FixedWidthTokenWithNoTrivia implements TypeScript.ISyntaxToken {
        public tokenKind: TypeScript.SyntaxKind;
        constructor(kind: TypeScript.SyntaxKind);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    class FixedWidthTokenWithLeadingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    class FixedWidthTokenWithTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    class FixedWidthTokenWithLeadingAndTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key);
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
    }
    function fixedWidthToken(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, trailingTriviaInfo: number): TypeScript.ISyntaxToken;
    function variableWidthToken(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, width: number, trailingTriviaInfo: number): TypeScript.ISyntaxToken;
}
declare module TypeScript {
    interface ISyntaxToken extends TypeScript.ISyntaxNodeOrToken, TypeScript.INameSyntax {
        tokenKind: TypeScript.SyntaxKind;
        text(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        hasSkippedToken(): boolean;
        leadingTrivia(): TypeScript.ISyntaxTriviaList;
        trailingTrivia(): TypeScript.ISyntaxTriviaList;
        withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxToken;
        clone(): ISyntaxToken;
    }
    interface ITokenInfo {
        leadingTrivia?: TypeScript.ISyntaxTrivia[];
        text?: string;
        trailingTrivia?: TypeScript.ISyntaxTrivia[];
    }
}
declare module TypeScript.Syntax {
    function realizeToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
    function convertToIdentifierName(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
    function tokenToJSON(token: TypeScript.ISyntaxToken);
    function value(token: TypeScript.ISyntaxToken): any;
    function valueText(token: TypeScript.ISyntaxToken): string;
    function emptyToken(kind: TypeScript.SyntaxKind): TypeScript.ISyntaxToken;
    function token(kind: TypeScript.SyntaxKind, info?: TypeScript.ITokenInfo): TypeScript.ISyntaxToken;
    function identifier(text: string, info?: TypeScript.ITokenInfo): TypeScript.ISyntaxToken;
}
declare module TypeScript {
    class SyntaxTokenReplacer extends TypeScript.SyntaxRewriter {
        private token1;
        private token2;
        constructor(token1: TypeScript.ISyntaxToken, token2: TypeScript.ISyntaxToken);
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public visitNode(node: TypeScript.SyntaxNode): TypeScript.SyntaxNode;
        public visitList(list: TypeScript.ISyntaxList): TypeScript.ISyntaxList;
        public visitSeparatedList(list: TypeScript.ISeparatedSyntaxList): TypeScript.ISeparatedSyntaxList;
    }
}
declare module TypeScript {
    interface ISyntaxTrivia {
        kind(): TypeScript.SyntaxKind;
        isWhitespace(): boolean;
        isComment(): boolean;
        isNewLine(): boolean;
        isSkippedToken(): boolean;
        fullWidth(): number;
        fullText(): string;
        skippedToken(): TypeScript.ISyntaxToken;
    }
}
declare module TypeScript.Syntax {
    function trivia(kind: TypeScript.SyntaxKind, text: string): TypeScript.ISyntaxTrivia;
    function skippedTokenTrivia(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxTrivia;
    function spaces(count: number): TypeScript.ISyntaxTrivia;
    function whitespace(text: string): TypeScript.ISyntaxTrivia;
    function multiLineComment(text: string): TypeScript.ISyntaxTrivia;
    function singleLineComment(text: string): TypeScript.ISyntaxTrivia;
    var spaceTrivia: TypeScript.ISyntaxTrivia;
    var lineFeedTrivia: TypeScript.ISyntaxTrivia;
    var carriageReturnTrivia: TypeScript.ISyntaxTrivia;
    var carriageReturnLineFeedTrivia: TypeScript.ISyntaxTrivia;
    function splitMultiLineCommentTriviaIntoMultipleLines(trivia: TypeScript.ISyntaxTrivia): string[];
}
declare module TypeScript {
    interface ISyntaxTriviaList {
        count(): number;
        syntaxTriviaAt(index: number): TypeScript.ISyntaxTrivia;
        fullWidth(): number;
        fullText(): string;
        hasComment(): boolean;
        hasNewLine(): boolean;
        hasSkippedToken(): boolean;
        last(): TypeScript.ISyntaxTrivia;
        toArray(): TypeScript.ISyntaxTrivia[];
        concat(trivia: ISyntaxTriviaList): ISyntaxTriviaList;
        collectTextElements(elements: string[]): void;
    }
}
declare module TypeScript.Syntax {
    var emptyTriviaList: TypeScript.ISyntaxTriviaList;
    function triviaList(trivia: TypeScript.ISyntaxTrivia[]): TypeScript.ISyntaxTriviaList;
    var spaceTriviaList: TypeScript.ISyntaxTriviaList;
}
declare module TypeScript {
    class SyntaxUtilities {
        static isAngleBracket(positionedElement: TypeScript.PositionedElement): boolean;
        static getToken(list: TypeScript.ISyntaxList, kind: TypeScript.SyntaxKind): TypeScript.ISyntaxToken;
        static containsToken(list: TypeScript.ISyntaxList, kind: TypeScript.SyntaxKind): boolean;
        static hasExportKeyword(moduleElement: TypeScript.IModuleElementSyntax): boolean;
        static isAmbientDeclarationSyntax(positionNode: TypeScript.PositionedNode): boolean;
    }
}
declare module TypeScript {
    interface ISyntaxVisitor {
        visitToken(token: TypeScript.ISyntaxToken): any;
        visitSourceUnit(node: TypeScript.SourceUnitSyntax): any;
        visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): any;
        visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): any;
        visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): any;
        visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): any;
        visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): any;
        visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): any;
        visitHeritageClause(node: TypeScript.HeritageClauseSyntax): any;
        visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): any;
        visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): any;
        visitVariableStatement(node: TypeScript.VariableStatementSyntax): any;
        visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): any;
        visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): any;
        visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): any;
        visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): any;
        visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): any;
        visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): any;
        visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): any;
        visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): any;
        visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): any;
        visitQualifiedName(node: TypeScript.QualifiedNameSyntax): any;
        visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): any;
        visitConstructorType(node: TypeScript.ConstructorTypeSyntax): any;
        visitFunctionType(node: TypeScript.FunctionTypeSyntax): any;
        visitObjectType(node: TypeScript.ObjectTypeSyntax): any;
        visitArrayType(node: TypeScript.ArrayTypeSyntax): any;
        visitGenericType(node: TypeScript.GenericTypeSyntax): any;
        visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): any;
        visitBlock(node: TypeScript.BlockSyntax): any;
        visitParameter(node: TypeScript.ParameterSyntax): any;
        visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): any;
        visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): any;
        visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): any;
        visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): any;
        visitArgumentList(node: TypeScript.ArgumentListSyntax): any;
        visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): any;
        visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): any;
        visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): any;
        visitMethodSignature(node: TypeScript.MethodSignatureSyntax): any;
        visitIndexSignature(node: TypeScript.IndexSignatureSyntax): any;
        visitPropertySignature(node: TypeScript.PropertySignatureSyntax): any;
        visitCallSignature(node: TypeScript.CallSignatureSyntax): any;
        visitParameterList(node: TypeScript.ParameterListSyntax): any;
        visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): any;
        visitTypeParameter(node: TypeScript.TypeParameterSyntax): any;
        visitConstraint(node: TypeScript.ConstraintSyntax): any;
        visitElseClause(node: TypeScript.ElseClauseSyntax): any;
        visitIfStatement(node: TypeScript.IfStatementSyntax): any;
        visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): any;
        visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): any;
        visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): any;
        visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): any;
        visitSetMemberAccessorDeclaration(node: TypeScript.SetMemberAccessorDeclarationSyntax): any;
        visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): any;
        visitThrowStatement(node: TypeScript.ThrowStatementSyntax): any;
        visitReturnStatement(node: TypeScript.ReturnStatementSyntax): any;
        visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): any;
        visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): any;
        visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): any;
        visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): any;
        visitBreakStatement(node: TypeScript.BreakStatementSyntax): any;
        visitContinueStatement(node: TypeScript.ContinueStatementSyntax): any;
        visitForStatement(node: TypeScript.ForStatementSyntax): any;
        visitForInStatement(node: TypeScript.ForInStatementSyntax): any;
        visitWhileStatement(node: TypeScript.WhileStatementSyntax): any;
        visitWithStatement(node: TypeScript.WithStatementSyntax): any;
        visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): any;
        visitEnumElement(node: TypeScript.EnumElementSyntax): any;
        visitCastExpression(node: TypeScript.CastExpressionSyntax): any;
        visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): any;
        visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): any;
        visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): any;
        visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): any;
        visitSetAccessorPropertyAssignment(node: TypeScript.SetAccessorPropertyAssignmentSyntax): any;
        visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): any;
        visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): any;
        visitTryStatement(node: TypeScript.TryStatementSyntax): any;
        visitCatchClause(node: TypeScript.CatchClauseSyntax): any;
        visitFinallyClause(node: TypeScript.FinallyClauseSyntax): any;
        visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): any;
        visitDoStatement(node: TypeScript.DoStatementSyntax): any;
        visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): any;
        visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): any;
        visitVoidExpression(node: TypeScript.VoidExpressionSyntax): any;
        visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): any;
    }
    class SyntaxVisitor implements ISyntaxVisitor {
        public defaultVisit(node: TypeScript.ISyntaxNodeOrToken): any;
        public visitToken(token: TypeScript.ISyntaxToken): any;
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): any;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): any;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): any;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): any;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): any;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): any;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): any;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): any;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): any;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): any;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): any;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): any;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): any;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): any;
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): any;
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): any;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): any;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): any;
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): any;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): any;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): any;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): any;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): any;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): any;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): any;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): any;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): any;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): any;
        public visitBlock(node: TypeScript.BlockSyntax): any;
        public visitParameter(node: TypeScript.ParameterSyntax): any;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): any;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): any;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): any;
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): any;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): any;
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): any;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): any;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): any;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): any;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): any;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): any;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): any;
        public visitParameterList(node: TypeScript.ParameterListSyntax): any;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): any;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): any;
        public visitConstraint(node: TypeScript.ConstraintSyntax): any;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): any;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): any;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): any;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): any;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): any;
        public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): any;
        public visitSetMemberAccessorDeclaration(node: TypeScript.SetMemberAccessorDeclarationSyntax): any;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): any;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): any;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): any;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): any;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): any;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): any;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): any;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): any;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): any;
        public visitForStatement(node: TypeScript.ForStatementSyntax): any;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): any;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): any;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): any;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): any;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): any;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): any;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): any;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): any;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): any;
        public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): any;
        public visitSetAccessorPropertyAssignment(node: TypeScript.SetAccessorPropertyAssignmentSyntax): any;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): any;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): any;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): any;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): any;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): any;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): any;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): any;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): any;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): any;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): any;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): any;
    }
}
declare module TypeScript {
    class SyntaxWalker implements TypeScript.ISyntaxVisitor {
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public visitNode(node: TypeScript.SyntaxNode): void;
        public visitNodeOrToken(nodeOrToken: TypeScript.ISyntaxNodeOrToken): void;
        private visitOptionalToken(token);
        public visitOptionalNode(node: TypeScript.SyntaxNode): void;
        public visitOptionalNodeOrToken(nodeOrToken: TypeScript.ISyntaxNodeOrToken): void;
        public visitList(list: TypeScript.ISyntaxList): void;
        public visitSeparatedList(list: TypeScript.ISeparatedSyntaxList): void;
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): void;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): void;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): void;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): void;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): void;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): void;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): void;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): void;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): void;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): void;
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): void;
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): void;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): void;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): void;
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): void;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): void;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): void;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): void;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): void;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): void;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): void;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): void;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): void;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): void;
        public visitBlock(node: TypeScript.BlockSyntax): void;
        public visitParameter(node: TypeScript.ParameterSyntax): void;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): void;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): void;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): void;
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): void;
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): void;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): void;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): void;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): void;
        public visitParameterList(node: TypeScript.ParameterListSyntax): void;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): void;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): void;
        public visitConstraint(node: TypeScript.ConstraintSyntax): void;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): void;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): void;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): void;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): void;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void;
        public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): void;
        public visitSetMemberAccessorDeclaration(node: TypeScript.SetMemberAccessorDeclarationSyntax): void;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): void;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): void;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): void;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): void;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): void;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): void;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): void;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): void;
        public visitForStatement(node: TypeScript.ForStatementSyntax): void;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): void;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): void;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): void;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): void;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): void;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): void;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): void;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): void;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): void;
        public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): void;
        public visitSetAccessorPropertyAssignment(node: TypeScript.SetAccessorPropertyAssignmentSyntax): void;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): void;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): void;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): void;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): void;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): void;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): void;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): void;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): void;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): void;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): void;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): void;
    }
}
declare module TypeScript {
    class PositionTrackingWalker extends TypeScript.SyntaxWalker {
        private _position;
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public position(): number;
        public skip(element: TypeScript.ISyntaxElement): void;
    }
}
declare module TypeScript {
    interface ITokenInformation {
        previousToken: TypeScript.ISyntaxToken;
        nextToken: TypeScript.ISyntaxToken;
    }
    class SyntaxInformationMap extends TypeScript.SyntaxWalker {
        private trackParents;
        private trackPreviousToken;
        private tokenToInformation;
        private elementToPosition;
        private _previousToken;
        private _previousTokenInformation;
        private _currentPosition;
        private _elementToParent;
        private _parentStack;
        constructor(trackParents: boolean, trackPreviousToken: boolean);
        static create(node: TypeScript.SyntaxNode, trackParents: boolean, trackPreviousToken: boolean): SyntaxInformationMap;
        public visitNode(node: TypeScript.SyntaxNode): void;
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public parent(element: TypeScript.ISyntaxElement): TypeScript.SyntaxNode;
        public fullStart(element: TypeScript.ISyntaxElement): number;
        public start(element: TypeScript.ISyntaxElement): number;
        public end(element: TypeScript.ISyntaxElement): number;
        public previousToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public tokenInformation(token: TypeScript.ISyntaxToken): ITokenInformation;
        public firstTokenInLineContainingToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public isFirstTokenInLine(token: TypeScript.ISyntaxToken): boolean;
        private isFirstTokenInLineWorker(information);
    }
}
declare module TypeScript {
    class SyntaxNodeInvariantsChecker extends TypeScript.SyntaxWalker {
        private tokenTable;
        static checkInvariants(node: TypeScript.SyntaxNode): void;
        public visitToken(token: TypeScript.ISyntaxToken): void;
    }
}
declare module TypeScript {
    class DepthLimitedWalker extends TypeScript.PositionTrackingWalker {
        private _depth;
        private _maximumDepth;
        constructor(maximumDepth: number);
        public visitNode(node: TypeScript.SyntaxNode): void;
    }
}
declare module TypeScript.Parser {
    function parse(fileName: string, text: TypeScript.ISimpleText, isDeclaration: boolean, languageVersion: TypeScript.LanguageVersion, options: TypeScript.ParseOptions): TypeScript.SyntaxTree;
    function incrementalParse(oldSyntaxTree: TypeScript.SyntaxTree, textChangeRange: TypeScript.TextChangeRange, newText: TypeScript.ISimpleText): TypeScript.SyntaxTree;
}
declare module TypeScript {
    class SyntaxTree {
        private _sourceUnit;
        private _isDeclaration;
        private _parserDiagnostics;
        private _allDiagnostics;
        private _fileName;
        private _lineMap;
        private _languageVersion;
        private _parseOptions;
        constructor(sourceUnit: TypeScript.SourceUnitSyntax, isDeclaration: boolean, diagnostics: TypeScript.SyntaxDiagnostic[], fileName: string, lineMap: TypeScript.LineMap, languageVersion: TypeScript.LanguageVersion, parseOtions: TypeScript.ParseOptions);
        public toJSON(key);
        public sourceUnit(): TypeScript.SourceUnitSyntax;
        public isDeclaration(): boolean;
        private computeDiagnostics();
        public diagnostics(): TypeScript.SyntaxDiagnostic[];
        public fileName(): string;
        public lineMap(): TypeScript.LineMap;
        public languageVersion(): TypeScript.LanguageVersion;
        public parseOptions(): TypeScript.ParseOptions;
        public structuralEquals(tree: SyntaxTree): boolean;
    }
}
declare module TypeScript {
}
declare module TypeScript {
    class Unicode {
        static unicodeES3IdentifierStart: number[];
        static unicodeES3IdentifierPart: number[];
        static unicodeES5IdentifierStart: number[];
        static unicodeES5IdentifierPart: number[];
        static lookupInUnicodeMap(code: number, map: number[]): boolean;
        static isIdentifierStart(code: number, languageVersion: TypeScript.LanguageVersion): boolean;
        static isIdentifierPart(code: number, languageVersion: TypeScript.LanguageVersion): boolean;
    }
}
declare module TypeScript {
    function hasFlag(val: number, flag: number): boolean;
    function withoutFlag(val: number, flag: number): number;
    enum ASTFlags {
        None,
        SingleLine,
        OptionalName,
        TypeReference,
        EnumElement,
        EnumMapElement,
    }
    enum DeclFlags {
        None,
        Exported,
        Private,
        Public,
        Ambient,
        Static,
    }
    enum ModuleFlags {
        None,
        Exported,
        Private,
        Public,
        Ambient,
        Static,
        IsEnum,
        IsWholeFile,
        IsDynamic,
    }
    enum VariableFlags {
        None,
        Exported,
        Private,
        Public,
        Ambient,
        Static,
        Property,
        ClassProperty,
        Constant,
        EnumElement,
    }
    enum FunctionFlags {
        None,
        Exported,
        Private,
        Public,
        Ambient,
        Static,
        GetAccessor,
        SetAccessor,
        Signature,
        Method,
        CallMember,
        ConstructMember,
        IsFatArrowFunction,
        IndexerMember,
        IsFunctionExpression,
        IsFunctionProperty,
    }
    function ToDeclFlags(functionFlags: FunctionFlags): DeclFlags;
    function ToDeclFlags(varFlags: VariableFlags): DeclFlags;
    function ToDeclFlags(moduleFlags: ModuleFlags): DeclFlags;
    enum TypeRelationshipFlags {
        SuccessfulComparison,
        RequiredPropertyIsMissing,
        IncompatibleSignatures,
        SourceSignatureHasTooManyParameters,
        IncompatibleReturnTypes,
        IncompatiblePropertyTypes,
        IncompatibleParameterTypes,
        InconsistantPropertyAccesibility,
    }
    enum ModuleGenTarget {
        Synchronous,
        Asynchronous,
    }
}
declare module TypeScript {
    enum NodeType {
        None,
        List,
        Script,
        TrueLiteral,
        FalseLiteral,
        StringLiteral,
        RegularExpressionLiteral,
        NumericLiteral,
        NullLiteral,
        TypeParameter,
        GenericType,
        TypeRef,
        FunctionDeclaration,
        ClassDeclaration,
        InterfaceDeclaration,
        ModuleDeclaration,
        ImportDeclaration,
        VariableDeclarator,
        VariableDeclaration,
        Parameter,
        Name,
        ArrayLiteralExpression,
        ObjectLiteralExpression,
        OmittedExpression,
        VoidExpression,
        CommaExpression,
        PlusExpression,
        NegateExpression,
        DeleteExpression,
        ThisExpression,
        SuperExpression,
        InExpression,
        MemberAccessExpression,
        InstanceOfExpression,
        TypeOfExpression,
        ElementAccessExpression,
        InvocationExpression,
        ObjectCreationExpression,
        AssignmentExpression,
        AddAssignmentExpression,
        SubtractAssignmentExpression,
        DivideAssignmentExpression,
        MultiplyAssignmentExpression,
        ModuloAssignmentExpression,
        AndAssignmentExpression,
        ExclusiveOrAssignmentExpression,
        OrAssignmentExpression,
        LeftShiftAssignmentExpression,
        SignedRightShiftAssignmentExpression,
        UnsignedRightShiftAssignmentExpression,
        ConditionalExpression,
        LogicalOrExpression,
        LogicalAndExpression,
        BitwiseOrExpression,
        BitwiseExclusiveOrExpression,
        BitwiseAndExpression,
        EqualsWithTypeConversionExpression,
        NotEqualsWithTypeConversionExpression,
        EqualsExpression,
        NotEqualsExpression,
        LessThanExpression,
        LessThanOrEqualExpression,
        GreaterThanExpression,
        GreaterThanOrEqualExpression,
        AddExpression,
        SubtractExpression,
        MultiplyExpression,
        DivideExpression,
        ModuloExpression,
        LeftShiftExpression,
        SignedRightShiftExpression,
        UnsignedRightShiftExpression,
        BitwiseNotExpression,
        LogicalNotExpression,
        PreIncrementExpression,
        PreDecrementExpression,
        PostIncrementExpression,
        PostDecrementExpression,
        CastExpression,
        ParenthesizedExpression,
        Member,
        Block,
        BreakStatement,
        ContinueStatement,
        DebuggerStatement,
        DoStatement,
        EmptyStatement,
        ExportAssignment,
        ExpressionStatement,
        ForInStatement,
        ForStatement,
        IfStatement,
        LabeledStatement,
        ReturnStatement,
        SwitchStatement,
        ThrowStatement,
        TryStatement,
        VariableStatement,
        WhileStatement,
        WithStatement,
        CaseClause,
        CatchClause,
        Comment,
    }
}
declare module TypeScript {
    class BlockIntrinsics {
        public prototype;
        public toString;
        public toLocaleString;
        public valueOf;
        public hasOwnProperty;
        public propertyIsEnumerable;
        public isPrototypeOf;
        constructor();
    }
    interface IHashTable<T> {
        getAllKeys(): string[];
        add(key: string, data: T): boolean;
        addOrUpdate(key: string, data: T): boolean;
        map(fn: (k: string, value: T, context: any) => void, context: any): void;
        every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        some(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        count(): number;
        lookup(key: string): T;
    }
    class StringHashTable<T> implements IHashTable<T> {
        private itemCount;
        private table;
        public getAllKeys(): string[];
        public add(key: string, data: T): boolean;
        public addOrUpdate(key: string, data: T): boolean;
        public map(fn: (k: string, value: T, context: any) => void, context: any): void;
        public every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        public some(fn: (k: string, value: any, context: any) => void, context: any): boolean;
        public count(): number;
        public lookup(key: string): T;
    }
    class IdentiferNameHashTable<T> extends StringHashTable<T> {
        public getAllKeys(): string[];
        public add(key: string, data: T): boolean;
        public addOrUpdate(key: string, data: T): boolean;
        public map(fn: (k: string, value: T, context: any) => void, context: any): void;
        public every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        public some(fn: (k: string, value: any, context: any) => void, context: any): boolean;
        public lookup(key: string): T;
    }
}
declare module TypeScript {
    interface IASTSpan {
        minChar: number;
        limChar: number;
        trailingTriviaWidth: number;
    }
    class ASTSpan implements IASTSpan {
        public minChar: number;
        public limChar: number;
        public trailingTriviaWidth: number;
    }
    var astID: number;
    function structuralEqualsNotIncludingPosition(ast1: AST, ast2: AST): boolean;
    function structuralEqualsIncludingPosition(ast1: AST, ast2: AST): boolean;
    class AST implements IASTSpan {
        public nodeType: TypeScript.NodeType;
        public minChar: number;
        public limChar: number;
        public trailingTriviaWidth: number;
        private _flags;
        public typeCheckPhase: number;
        private astID;
        public passCreated: number;
        public preComments: Comment[];
        public postComments: Comment[];
        private docComments;
        constructor(nodeType: TypeScript.NodeType);
        public shouldEmit(): boolean;
        public isExpression(): boolean;
        public isStatementOrExpression(): boolean;
        public getFlags(): TypeScript.ASTFlags;
        public setFlags(flags: TypeScript.ASTFlags): void;
        public getLength(): number;
        public getID(): number;
        public isDeclaration(): boolean;
        public isStatement(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
        public emitWorker(emitter: TypeScript.Emitter): void;
        public getDocComments(): Comment[];
        public structuralEquals(ast: AST, includingPosition: boolean): boolean;
    }
    class ASTList extends AST {
        public members: AST[];
        constructor();
        public append(ast: AST): ASTList;
        public emit(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ASTList, includingPosition: boolean): boolean;
    }
    class Expression extends AST {
        constructor(nodeType: TypeScript.NodeType);
    }
    class Identifier extends Expression {
        public actualText: string;
        public text: string;
        constructor(actualText: string);
        public setText(actualText: string): void;
        public isMissing(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: Identifier, includingPosition: boolean): boolean;
    }
    class MissingIdentifier extends Identifier {
        constructor();
        public isMissing(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
    }
    class LiteralExpression extends Expression {
        constructor(nodeType: TypeScript.NodeType);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class ThisExpression extends Expression {
        constructor();
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class SuperExpression extends Expression {
        constructor();
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class ParenthesizedExpression extends Expression {
        public expression: AST;
        constructor(expression: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class UnaryExpression extends Expression {
        public operand: AST;
        public castTerm: TypeReference;
        constructor(nodeType: TypeScript.NodeType, operand: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: UnaryExpression, includingPosition: boolean): boolean;
    }
    class CallExpression extends Expression {
        public target: AST;
        public typeArguments: ASTList;
        public arguments: ASTList;
        constructor(nodeType: TypeScript.NodeType, target: AST, typeArguments: ASTList, arguments: ASTList);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: CallExpression, includingPosition: boolean): boolean;
    }
    class BinaryExpression extends Expression {
        public operand1: AST;
        public operand2: AST;
        constructor(nodeType: TypeScript.NodeType, operand1: AST, operand2: AST);
        static getTextForBinaryToken(nodeType: TypeScript.NodeType): string;
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: BinaryExpression, includingPosition: boolean): boolean;
    }
    class ConditionalExpression extends Expression {
        public operand1: AST;
        public operand2: AST;
        public operand3: AST;
        constructor(operand1: AST, operand2: AST, operand3: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ConditionalExpression, includingPosition: boolean): boolean;
    }
    class NumberLiteral extends Expression {
        public value: number;
        public text: string;
        constructor(value: number, text: string);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: NumberLiteral, includingPosition: boolean): boolean;
    }
    class RegexLiteral extends Expression {
        public text: string;
        constructor(text: string);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: RegexLiteral, includingPosition: boolean): boolean;
    }
    class StringLiteral extends Expression {
        public actualText: string;
        public text: string;
        constructor(actualText: string, text: string);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: StringLiteral, includingPosition: boolean): boolean;
    }
    class ImportDeclaration extends AST {
        public id: Identifier;
        public alias: AST;
        public isDynamicImport: boolean;
        public isStatementOrExpression(): boolean;
        constructor(id: Identifier, alias: AST);
        public isDeclaration(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
        public getAliasName(aliasAST?: AST): string;
        public firstAliasedModToString(): string;
        public structuralEquals(ast: ImportDeclaration, includingPosition: boolean): boolean;
    }
    class ExportAssignment extends AST {
        public id: Identifier;
        constructor(id: Identifier);
        public structuralEquals(ast: ExportAssignment, includingPosition: boolean): boolean;
        public emit(emitter: TypeScript.Emitter): void;
    }
    class BoundDecl extends AST {
        public id: Identifier;
        public init: AST;
        public isImplicitlyInitialized: boolean;
        public typeExpr: AST;
        private _varFlags;
        public isDeclaration(): boolean;
        public isStatementOrExpression(): boolean;
        constructor(id: Identifier, nodeType: TypeScript.NodeType);
        public getVarFlags(): TypeScript.VariableFlags;
        public setVarFlags(flags: TypeScript.VariableFlags): void;
        public isProperty(): boolean;
        public structuralEquals(ast: BoundDecl, includingPosition: boolean): boolean;
    }
    class VariableDeclarator extends BoundDecl {
        constructor(id: Identifier);
        public isExported(): boolean;
        public isStatic(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
    }
    class Parameter extends BoundDecl {
        constructor(id: Identifier);
        public isOptional: boolean;
        public isOptionalArg();
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: Parameter, includingPosition: boolean): boolean;
    }
    class FunctionDeclaration extends AST {
        public name: Identifier;
        public block: Block;
        public isConstructor: boolean;
        public typeArguments: ASTList;
        public arguments: ASTList;
        public hint: string;
        private _functionFlags;
        public returnTypeAnnotation: AST;
        public variableArgList: boolean;
        public classDecl: NamedDeclaration;
        public returnStatementsWithExpressions: ReturnStatement[];
        public isDeclaration(): boolean;
        constructor(name: Identifier, block: Block, isConstructor: boolean, typeArguments: ASTList, arguments: ASTList, nodeType: number);
        public getFunctionFlags(): TypeScript.FunctionFlags;
        public setFunctionFlags(flags: TypeScript.FunctionFlags): void;
        public structuralEquals(ast: FunctionDeclaration, includingPosition: boolean): boolean;
        public shouldEmit(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
        public getNameText(): string;
        public isMethod(): boolean;
        public isCallMember(): boolean;
        public isConstructMember(): boolean;
        public isIndexerMember(): boolean;
        public isSpecialFn(): boolean;
        public isAccessor(): boolean;
        public isGetAccessor(): boolean;
        public isSetAccessor(): boolean;
        public isStatic(): boolean;
        public isSignature(): boolean;
    }
    class Script extends AST {
        public moduleElements: ASTList;
        public referencedFiles: TypeScript.IFileReference[];
        public requiresExtendsBlock: boolean;
        public isDeclareFile: boolean;
        public topLevelMod: ModuleDeclaration;
        public containsUnicodeChar: boolean;
        public containsUnicodeCharInComment: boolean;
        constructor();
        public emit(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: Script, includingPosition: boolean): boolean;
    }
    class NamedDeclaration extends AST {
        public name: Identifier;
        public members: ASTList;
        public isDeclaration(): boolean;
        constructor(nodeType: TypeScript.NodeType, name: Identifier, members: ASTList);
        public structuralEquals(ast: NamedDeclaration, includingPosition: boolean): boolean;
    }
    class ModuleDeclaration extends NamedDeclaration {
        public endingToken: ASTSpan;
        private _moduleFlags;
        public prettyName: string;
        public amdDependencies: string[];
        public containsUnicodeChar: boolean;
        public containsUnicodeCharInComment: boolean;
        constructor(name: Identifier, members: ASTList, endingToken: ASTSpan);
        public getModuleFlags(): TypeScript.ModuleFlags;
        public setModuleFlags(flags: TypeScript.ModuleFlags): void;
        public structuralEquals(ast: ModuleDeclaration, includePosition: boolean): boolean;
        public isEnum(): boolean;
        public isWholeFile(): boolean;
        public shouldEmit(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
    }
    class TypeDeclaration extends NamedDeclaration {
        public typeParameters: ASTList;
        public extendsList: ASTList;
        public implementsList: ASTList;
        private _varFlags;
        constructor(nodeType: TypeScript.NodeType, name: Identifier, typeParameters: ASTList, extendsList: ASTList, implementsList: ASTList, members: ASTList);
        public getVarFlags(): TypeScript.VariableFlags;
        public setVarFlags(flags: TypeScript.VariableFlags): void;
        public structuralEquals(ast: TypeDeclaration, includingPosition: boolean): boolean;
    }
    class ClassDeclaration extends TypeDeclaration {
        public constructorDecl: FunctionDeclaration;
        public endingToken: ASTSpan;
        constructor(name: Identifier, typeParameters: ASTList, members: ASTList, extendsList: ASTList, implementsList: ASTList);
        public shouldEmit(): boolean;
        public emit(emitter: TypeScript.Emitter): void;
    }
    class InterfaceDeclaration extends TypeDeclaration {
        constructor(name: Identifier, typeParameters: ASTList, members: ASTList, extendsList: ASTList, implementsList: ASTList);
        public shouldEmit(): boolean;
    }
    class Statement extends AST {
        constructor(nodeType: TypeScript.NodeType);
        public isStatement(): boolean;
        public isStatementOrExpression(): boolean;
    }
    class ThrowStatement extends Statement {
        public expression: Expression;
        constructor(expression: Expression);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ThrowStatement, includingPosition: boolean): boolean;
    }
    class ExpressionStatement extends Statement {
        public expression: AST;
        constructor(expression: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ExpressionStatement, includingPosition: boolean): boolean;
    }
    class LabeledStatement extends Statement {
        public identifier: Identifier;
        public statement: AST;
        constructor(identifier: Identifier, statement: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: LabeledStatement, includingPosition: boolean): boolean;
    }
    class VariableDeclaration extends AST {
        public declarators: ASTList;
        constructor(declarators: ASTList);
        public emit(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: VariableDeclaration, includingPosition: boolean): boolean;
    }
    class VariableStatement extends Statement {
        public declaration: VariableDeclaration;
        constructor(declaration: VariableDeclaration);
        public shouldEmit(): boolean;
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: VariableStatement, includingPosition: boolean): boolean;
    }
    class Block extends Statement {
        public statements: ASTList;
        public closeBraceSpan: IASTSpan;
        constructor(statements: ASTList);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: Block, includingPosition: boolean): boolean;
    }
    class Jump extends Statement {
        public target: string;
        public hasExplicitTarget(): string;
        public resolvedTarget: Statement;
        constructor(nodeType: TypeScript.NodeType);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: Jump, includingPosition: boolean): boolean;
    }
    class WhileStatement extends Statement {
        public cond: AST;
        public body: AST;
        constructor(cond: AST, body: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: WhileStatement, includingPosition: boolean): boolean;
    }
    class DoStatement extends Statement {
        public body: AST;
        public cond: AST;
        public whileSpan: ASTSpan;
        constructor(body: AST, cond: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: DoStatement, includingPosition: boolean): boolean;
    }
    class IfStatement extends Statement {
        public cond: AST;
        public thenBod: AST;
        public elseBod: AST;
        public statement: ASTSpan;
        constructor(cond: AST, thenBod: AST, elseBod: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: IfStatement, includingPosition: boolean): boolean;
    }
    class ReturnStatement extends Statement {
        public returnExpression: AST;
        constructor(returnExpression: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ReturnStatement, includingPosition: boolean): boolean;
    }
    class ForInStatement extends Statement {
        public lval: AST;
        public obj: AST;
        public body: AST;
        constructor(lval: AST, obj: AST, body: AST);
        public statement: ASTSpan;
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ForInStatement, includingPosition: boolean): boolean;
    }
    class ForStatement extends Statement {
        public init: AST;
        public cond: AST;
        public incr: AST;
        public body: AST;
        constructor(init: AST, cond: AST, incr: AST, body: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: ForStatement, includingPosition: boolean): boolean;
    }
    class WithStatement extends Statement {
        public expr: AST;
        public body: AST;
        constructor(expr: AST, body: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: WithStatement, includingPosition: boolean): boolean;
    }
    class SwitchStatement extends Statement {
        public val: AST;
        public caseList: ASTList;
        public defaultCase: CaseClause;
        public statement: ASTSpan;
        constructor(val: AST);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: SwitchStatement, includingPosition: boolean): boolean;
    }
    class CaseClause extends AST {
        public expr: AST;
        public body: ASTList;
        public colonSpan: ASTSpan;
        constructor();
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: CaseClause, includingPosition: boolean): boolean;
    }
    class TypeParameter extends AST {
        public name: Identifier;
        public constraint: AST;
        constructor(name: Identifier, constraint: AST);
        public structuralEquals(ast: TypeParameter, includingPosition: boolean): boolean;
    }
    class GenericType extends AST {
        public name: AST;
        public typeArguments: ASTList;
        constructor(name: AST, typeArguments: ASTList);
        public emit(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: GenericType, includingPosition: boolean): boolean;
    }
    class TypeReference extends AST {
        public term: AST;
        public arrayCount: number;
        constructor(term: AST, arrayCount: number);
        public emit(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: TypeReference, includingPosition: boolean): boolean;
    }
    class TryStatement extends Statement {
        public tryBody: Block;
        public catchClause: CatchClause;
        public finallyBody: Block;
        constructor(tryBody: Block, catchClause: CatchClause, finallyBody: Block);
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: TryStatement, includingPosition: boolean): boolean;
    }
    class CatchClause extends AST {
        public param: VariableDeclarator;
        public body: Block;
        constructor(param: VariableDeclarator, body: Block);
        public statement: ASTSpan;
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class DebuggerStatement extends Statement {
        constructor();
        public emitWorker(emitter: TypeScript.Emitter): void;
    }
    class OmittedExpression extends Expression {
        constructor();
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class EmptyStatement extends Statement {
        constructor();
        public emitWorker(emitter: TypeScript.Emitter): void;
        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class Comment extends AST {
        public content: string;
        public isBlockComment: boolean;
        public endsLine;
        public text: string[];
        public minLine: number;
        public limLine: number;
        private docCommentText;
        constructor(content: string, isBlockComment: boolean, endsLine);
        public structuralEquals(ast: Comment, includingPosition: boolean): boolean;
        public getText(): string[];
        public isDocComment(): boolean;
        public getDocCommentTextValue(): string;
        static consumeLeadingSpace(line: string, startIndex: number, maxSpacesToRemove?: number): number;
        static isSpaceChar(line: string, index: number): boolean;
        static cleanDocCommentLine(line: string, jsDocStyleComment: boolean, jsDocLineSpaceToRemove?: number): {
            minChar: number;
            limChar: number;
            jsDocSpacesRemoved: number;
        };
        static cleanJSDocComment(content: string, spacesToRemove?: number): string;
        static getDocCommentText(comments: Comment[]): string;
        static getParameterDocCommentText(param: string, fncDocComments: Comment[]): string;
    }
}
declare module TypeScript {
    interface IAstWalker {
        walk(ast: TypeScript.AST, parent: TypeScript.AST): TypeScript.AST;
        options: AstWalkOptions;
        state: any;
    }
    class AstWalkOptions {
        public goChildren: boolean;
    }
    interface IAstWalkCallback {
        (ast: TypeScript.AST, parent: TypeScript.AST, walker: IAstWalker): TypeScript.AST;
    }
    interface IAstWalkChildren {
        (preAst: TypeScript.AST, parent: TypeScript.AST, walker: IAstWalker): void;
    }
    class AstWalkerFactory {
        private childrenWalkers;
        constructor();
        public walk(ast: TypeScript.AST, pre: IAstWalkCallback, post?: IAstWalkCallback, options?: AstWalkOptions, state?: any): TypeScript.AST;
        public getWalker(pre: IAstWalkCallback, post?: IAstWalkCallback, options?: AstWalkOptions, state?: any): IAstWalker;
        private getSlowWalker(pre, post?, options?, state?);
        private initChildrenWalkers();
    }
    function getAstWalkerFactory(): AstWalkerFactory;
}
declare module TypeScript.AstWalkerWithDetailCallback {
    interface AstWalkerDetailCallback {
        EmptyCallback? (pre, ast: TypeScript.AST): boolean;
        EmptyExprCallback? (pre, ast: TypeScript.AST): boolean;
        TrueCallback? (pre, ast: TypeScript.AST): boolean;
        FalseCallback? (pre, ast: TypeScript.AST): boolean;
        ThisCallback? (pre, ast: TypeScript.AST): boolean;
        SuperCallback? (pre, ast: TypeScript.AST): boolean;
        QStringCallback? (pre, ast: TypeScript.AST): boolean;
        RegexCallback? (pre, ast: TypeScript.AST): boolean;
        NullCallback? (pre, ast: TypeScript.AST): boolean;
        ArrayLitCallback? (pre, ast: TypeScript.AST): boolean;
        ObjectLitCallback? (pre, ast: TypeScript.AST): boolean;
        VoidCallback? (pre, ast: TypeScript.AST): boolean;
        CommaCallback? (pre, ast: TypeScript.AST): boolean;
        PosCallback? (pre, ast: TypeScript.AST): boolean;
        NegCallback? (pre, ast: TypeScript.AST): boolean;
        DeleteCallback? (pre, ast: TypeScript.AST): boolean;
        AwaitCallback? (pre, ast: TypeScript.AST): boolean;
        InCallback? (pre, ast: TypeScript.AST): boolean;
        DotCallback? (pre, ast: TypeScript.AST): boolean;
        FromCallback? (pre, ast: TypeScript.AST): boolean;
        IsCallback? (pre, ast: TypeScript.AST): boolean;
        InstOfCallback? (pre, ast: TypeScript.AST): boolean;
        TypeofCallback? (pre, ast: TypeScript.AST): boolean;
        NumberLitCallback? (pre, ast: TypeScript.AST): boolean;
        NameCallback? (pre, identifierAst: TypeScript.Identifier): boolean;
        TypeRefCallback? (pre, ast: TypeScript.AST): boolean;
        IndexCallback? (pre, ast: TypeScript.AST): boolean;
        CallCallback? (pre, ast: TypeScript.AST): boolean;
        NewCallback? (pre, ast: TypeScript.AST): boolean;
        AsgCallback? (pre, ast: TypeScript.AST): boolean;
        AsgAddCallback? (pre, ast: TypeScript.AST): boolean;
        AsgSubCallback? (pre, ast: TypeScript.AST): boolean;
        AsgDivCallback? (pre, ast: TypeScript.AST): boolean;
        AsgMulCallback? (pre, ast: TypeScript.AST): boolean;
        AsgModCallback? (pre, ast: TypeScript.AST): boolean;
        AsgAndCallback? (pre, ast: TypeScript.AST): boolean;
        AsgXorCallback? (pre, ast: TypeScript.AST): boolean;
        AsgOrCallback? (pre, ast: TypeScript.AST): boolean;
        AsgLshCallback? (pre, ast: TypeScript.AST): boolean;
        AsgRshCallback? (pre, ast: TypeScript.AST): boolean;
        AsgRs2Callback? (pre, ast: TypeScript.AST): boolean;
        QMarkCallback? (pre, ast: TypeScript.AST): boolean;
        LogOrCallback? (pre, ast: TypeScript.AST): boolean;
        LogAndCallback? (pre, ast: TypeScript.AST): boolean;
        OrCallback? (pre, ast: TypeScript.AST): boolean;
        XorCallback? (pre, ast: TypeScript.AST): boolean;
        AndCallback? (pre, ast: TypeScript.AST): boolean;
        EqCallback? (pre, ast: TypeScript.AST): boolean;
        NeCallback? (pre, ast: TypeScript.AST): boolean;
        EqvCallback? (pre, ast: TypeScript.AST): boolean;
        NEqvCallback? (pre, ast: TypeScript.AST): boolean;
        LtCallback? (pre, ast: TypeScript.AST): boolean;
        LeCallback? (pre, ast: TypeScript.AST): boolean;
        GtCallback? (pre, ast: TypeScript.AST): boolean;
        GeCallback? (pre, ast: TypeScript.AST): boolean;
        AddCallback? (pre, ast: TypeScript.AST): boolean;
        SubCallback? (pre, ast: TypeScript.AST): boolean;
        MulCallback? (pre, ast: TypeScript.AST): boolean;
        DivCallback? (pre, ast: TypeScript.AST): boolean;
        ModCallback? (pre, ast: TypeScript.AST): boolean;
        LshCallback? (pre, ast: TypeScript.AST): boolean;
        RshCallback? (pre, ast: TypeScript.AST): boolean;
        Rs2Callback? (pre, ast: TypeScript.AST): boolean;
        NotCallback? (pre, ast: TypeScript.AST): boolean;
        LogNotCallback? (pre, ast: TypeScript.AST): boolean;
        IncPreCallback? (pre, ast: TypeScript.AST): boolean;
        DecPreCallback? (pre, ast: TypeScript.AST): boolean;
        IncPostCallback? (pre, ast: TypeScript.AST): boolean;
        DecPostCallback? (pre, ast: TypeScript.AST): boolean;
        TypeAssertionCallback? (pre, ast: TypeScript.AST): boolean;
        FunctionDeclarationCallback? (pre, funcDecl: TypeScript.FunctionDeclaration): boolean;
        MemberCallback? (pre, ast: TypeScript.AST): boolean;
        VariableDeclaratorCallback? (pre, varDecl: TypeScript.VariableDeclarator): boolean;
        VariableDeclarationCallback? (pre, varDecl: TypeScript.VariableDeclaration): boolean;
        ArgDeclCallback? (pre, ast: TypeScript.AST): boolean;
        ReturnCallback? (pre, ast: TypeScript.AST): boolean;
        BreakCallback? (pre, ast: TypeScript.AST): boolean;
        ContinueCallback? (pre, ast: TypeScript.AST): boolean;
        ThrowCallback? (pre, ast: TypeScript.AST): boolean;
        ForCallback? (pre, ast: TypeScript.AST): boolean;
        ForInCallback? (pre, ast: TypeScript.AST): boolean;
        IfCallback? (pre, ast: TypeScript.AST): boolean;
        WhileCallback? (pre, ast: TypeScript.AST): boolean;
        DoCallback? (pre, ast: TypeScript.AST): boolean;
        BlockCallback? (pre, block: TypeScript.Block): boolean;
        CaseCallback? (pre, ast: TypeScript.AST): boolean;
        SwitchCallback? (pre, ast: TypeScript.AST): boolean;
        TryCallback? (pre, ast: TypeScript.AST): boolean;
        TryCatchCallback? (pre, ast: TypeScript.AST): boolean;
        TryFinallyCallback? (pre, ast: TypeScript.AST): boolean;
        FinallyCallback? (pre, ast: TypeScript.AST): boolean;
        CatchCallback? (pre, ast: TypeScript.AST): boolean;
        ListCallback? (pre, astList: TypeScript.ASTList): boolean;
        ScriptCallback? (pre, script: TypeScript.Script): boolean;
        ClassDeclarationCallback? (pre, ast: TypeScript.AST): boolean;
        InterfaceDeclarationCallback? (pre, interfaceDecl: TypeScript.InterfaceDeclaration): boolean;
        ModuleDeclarationCallback? (pre, moduleDecl: TypeScript.ModuleDeclaration): boolean;
        ImportDeclarationCallback? (pre, ast: TypeScript.AST): boolean;
        ExportAssignmentCallback? (pre, ast: TypeScript.AST): boolean;
        WithCallback? (pre, ast: TypeScript.AST): boolean;
        LabelCallback? (pre, labelAST: TypeScript.AST): boolean;
        LabeledStatementCallback? (pre, ast: TypeScript.AST): boolean;
        VariableStatementCallback? (pre, ast: TypeScript.AST): boolean;
        ErrorCallback? (pre, ast: TypeScript.AST): boolean;
        CommentCallback? (pre, ast: TypeScript.AST): boolean;
        DebuggerCallback? (pre, ast: TypeScript.AST): boolean;
        DefaultCallback? (pre, ast: TypeScript.AST): boolean;
    }
    function walk(script: TypeScript.Script, callback: AstWalkerDetailCallback): void;
}
declare module TypeScript {
    function max(a: number, b: number): number;
    function min(a: number, b: number): number;
    class AstPath {
        public asts: TypeScript.AST[];
        public top: number;
        static reverseIndexOf(items: any[], index: number): any;
        public clone(): AstPath;
        public pop(): TypeScript.AST;
        public push(ast: TypeScript.AST): void;
        public up(): void;
        public down(): void;
        public nodeType(): TypeScript.NodeType;
        public ast(): TypeScript.AST;
        public parent(): TypeScript.AST;
        public count(): number;
        public get(index: number): TypeScript.AST;
        public isNameOfClass(): boolean;
        public isNameOfInterface(): boolean;
        public isNameOfArgument(): boolean;
        public isNameOfVariable(): boolean;
        public isNameOfModule(): boolean;
        public isNameOfFunction(): boolean;
        public isBodyOfFunction(): boolean;
        public isArgumentListOfFunction(): boolean;
        public isTargetOfCall(): boolean;
        public isTargetOfNew(): boolean;
        public isInClassImplementsList(): boolean;
        public isInInterfaceExtendsList(): boolean;
        public isMemberOfMemberAccessExpression(): boolean;
        public isCallExpression(): boolean;
        public isCallExpressionTarget(): boolean;
        public isDeclaration(): boolean;
        private isMemberOfList(list, item);
    }
    function isValidAstNode(ast: IASTSpan): boolean;
    class AstPathContext {
        public path: AstPath;
    }
    enum GetAstPathOptions {
        Default,
        EdgeInclusive,
        DontPruneSearchBasedOnPosition,
    }
    function getAstPathToPosition(script: AST, pos: number, useTrailingTriviaAsLimChar?: boolean, options?: GetAstPathOptions): AstPath;
    function walkAST(ast: AST, callback: (path: AstPath, walker: IAstWalker) => void): void;
}
declare module TypeScript {
    class Base64VLQFormat {
        static encode(inValue: number): string;
        static decode(inString: string): {
            value: number;
            rest: string;
        };
    }
}
declare module TypeScript {
    class SourceMapPosition {
        public sourceLine: number;
        public sourceColumn: number;
        public emittedLine: number;
        public emittedColumn: number;
    }
    class SourceMapping {
        public start: SourceMapPosition;
        public end: SourceMapPosition;
        public nameIndex: number;
        public childMappings: SourceMapping[];
    }
    class SourceMapper {
        public sourceMapFileName: string;
        public jsFile: ITextWriter;
        public sourceMapOut: ITextWriter;
        static MapFileExtension: string;
        public sourceMappings: SourceMapping[];
        public currentMappings: SourceMapping[][];
        public names: string[];
        public currentNameIndex: number[];
        public jsFileName: string;
        public tsFileName: string;
        constructor(tsFileName: string, jsFileName: string, sourceMapFileName: string, jsFile: ITextWriter, sourceMapOut: ITextWriter, emitFullPathOfSourceMap: boolean);
        static emitSourceMapping(allSourceMappers: SourceMapper[]): void;
    }
}
declare module TypeScript {
    enum EmitContainer {
        Prog,
        Module,
        DynamicModule,
        Class,
        Constructor,
        Function,
        Args,
        Interface,
    }
    class EmitState {
        public column: number;
        public line: number;
        public container: EmitContainer;
        constructor();
    }
    class EmitOptions {
        public compilationSettings: TypeScript.CompilationSettings;
        public ioHost: TypeScript.EmitterIOHost;
        public outputMany: boolean;
        public commonDirectoryPath: string;
        constructor(compilationSettings: TypeScript.CompilationSettings);
        public mapOutputFileName(fileName: string, extensionChanger: (fname: string, wholeFileNameReplaced: boolean) => string): string;
    }
    class Indenter {
        static indentStep: number;
        static indentStepString: string;
        static indentStrings: string[];
        public indentAmt: number;
        public increaseIndent(): void;
        public decreaseIndent(): void;
        public getIndent(): string;
    }
    interface BoundDeclInfo {
        boundDecl: TypeScript.BoundDecl;
        pullDecl: TypeScript.PullDecl;
    }
    class Emitter {
        public emittingFileName: string;
        public outfile: ITextWriter;
        public emitOptions: EmitOptions;
        private semanticInfoChain;
        public globalThisCapturePrologueEmitted: boolean;
        public extendsPrologueEmitted: boolean;
        public thisClassNode: TypeScript.ClassDeclaration;
        public thisFunctionDeclaration: TypeScript.FunctionDeclaration;
        public moduleName: string;
        public emitState: EmitState;
        public indenter: Indenter;
        public modAliasId: string;
        public firstModAlias: string;
        public allSourceMappers: TypeScript.SourceMapper[];
        public sourceMapper: TypeScript.SourceMapper;
        public captureThisStmtString: string;
        public varListCountStack: number[];
        private pullTypeChecker;
        private declStack;
        private resolvingContext;
        private exportAssignmentIdentifier;
        public document: TypeScript.Document;
        constructor(emittingFileName: string, outfile: ITextWriter, emitOptions: EmitOptions, semanticInfoChain: TypeScript.SemanticInfoChain);
        private pushDecl(decl);
        private popDecl(decl);
        private getEnclosingDecl();
        private setTypeCheckerUnit(fileName);
        public setExportAssignmentIdentifier(id: string): void;
        public getExportAssignmentIdentifier(): string;
        public setDocument(document: TypeScript.Document): void;
        public importStatementShouldBeEmitted(importDeclAST: TypeScript.ImportDeclaration, unitPath?: string): boolean;
        public setSourceMappings(mapper: TypeScript.SourceMapper): void;
        public writeToOutput(s: string): void;
        public writeToOutputTrimmable(s: string): void;
        public writeLineToOutput(s: string): void;
        public writeCaptureThisStatement(ast: TypeScript.AST): void;
        public setInVarBlock(count: number): void;
        public setContainer(c: number): number;
        private getIndentString();
        public emitIndent(): void;
        public emitCommentInPlace(comment: TypeScript.Comment): void;
        public emitComments(ast: TypeScript.AST, pre: boolean): void;
        public emitObjectLiteral(objectLiteral: TypeScript.UnaryExpression): void;
        public emitArrayLiteral(arrayLiteral: TypeScript.UnaryExpression): void;
        public emitNew(target: TypeScript.AST, args: TypeScript.ASTList): void;
        public getVarDeclFromIdentifier(boundDeclInfo: BoundDeclInfo): BoundDeclInfo;
        private getConstantValue(boundDeclInfo);
        public getConstantDecl(dotExpr: TypeScript.BinaryExpression): BoundDeclInfo;
        public tryEmitConstant(dotExpr: TypeScript.BinaryExpression): boolean;
        public emitCall(callNode: TypeScript.CallExpression, target: TypeScript.AST, args: TypeScript.ASTList): void;
        public emitInnerFunction(funcDecl: TypeScript.FunctionDeclaration, printName: boolean, includePreComments?: boolean): void;
        private emitDefaultValueAssignments(funcDecl);
        private emitRestParameterInitializer(funcDecl);
        private getImportDecls(fileName);
        public getModuleImportAndDependencyList(moduleDecl: TypeScript.ModuleDeclaration): {
            importList: string;
            dependencyList: string;
        };
        public shouldCaptureThis(ast: TypeScript.AST): boolean;
        public emitModule(moduleDecl: TypeScript.ModuleDeclaration): void;
        public emitEnumElement(varDecl: TypeScript.VariableDeclarator): void;
        public emitIndex(operand1: TypeScript.AST, operand2: TypeScript.AST): void;
        public emitFunction(funcDecl: TypeScript.FunctionDeclaration): void;
        public emitAmbientVarDecl(varDecl: TypeScript.VariableDeclarator): void;
        public varListCount(): number;
        public emitVarDeclVar(): boolean;
        public onEmitVar(): void;
        public emitVariableDeclaration(declaration: TypeScript.VariableDeclaration): void;
        public emitVariableDeclarator(varDecl: TypeScript.VariableDeclarator): void;
        private symbolIsUsedInItsEnclosingContainer(symbol, dynamic?);
        public emitName(name: TypeScript.Identifier, addThis: boolean): void;
        public recordSourceMappingNameStart(name: string): void;
        public recordSourceMappingNameEnd(): void;
        public recordSourceMappingStart(ast: TypeScript.IASTSpan): void;
        public recordSourceMappingEnd(ast: TypeScript.IASTSpan): void;
        public emitSourceMapsAndClose(): void;
        private emitParameterPropertyAndMemberVariableAssignments();
        public emitCommaSeparatedList(list: TypeScript.ASTList, startLine?: boolean): void;
        public emitModuleElements(list: TypeScript.ASTList): void;
        private isDirectivePrologueElement(node);
        public emitSpaceBetweenConstructs(node1: TypeScript.AST, node2: TypeScript.AST): void;
        public emitScriptElements(script: TypeScript.Script, requiresExtendsBlock: boolean): void;
        public emitConstructorStatements(funcDecl: TypeScript.FunctionDeclaration): void;
        public emitJavascript(ast: TypeScript.AST, startLine: boolean): void;
        public emitPropertyAccessor(funcDecl: TypeScript.FunctionDeclaration, className: string, isProto: boolean): void;
        public emitPrototypeMember(funcDecl: TypeScript.FunctionDeclaration, className: string): void;
        public emitClass(classDecl: TypeScript.ClassDeclaration): void;
        private emitClassMembers(classDecl);
        public emitPrologue(script: TypeScript.Script, requiresExtendsBlock: boolean): void;
        public emitSuperReference(): void;
        public emitSuperCall(callEx: TypeScript.CallExpression): boolean;
        public emitThis(): void;
        public emitBlockOrStatement(node: TypeScript.AST): void;
        static throwEmitterError(e: Error): void;
        static handleEmitterError(fileName: string, e: Error): TypeScript.IDiagnostic[];
    }
}
declare module TypeScript {
    class MemberName {
        public prefix: string;
        public suffix: string;
        public isString(): boolean;
        public isArray(): boolean;
        public isMarker(): boolean;
        public toString(): string;
        static memberNameToString(memberName: MemberName, markerInfo?: number[], markerBaseLength?: number): string;
        static create(text: string): MemberName;
        static create(entry: MemberName, prefix: string, suffix: string): MemberName;
    }
    class MemberNameString extends MemberName {
        public text: string;
        constructor(text: string);
        public isString(): boolean;
    }
    class MemberNameArray extends MemberName {
        public delim: string;
        public entries: MemberName[];
        public isArray(): boolean;
        public add(entry: MemberName): void;
        public addAll(entries: MemberName[]): void;
        constructor();
    }
}
declare module TypeScript {
    function stripQuotes(str: string): string;
    function isSingleQuoted(str: string): boolean;
    function isQuoted(str: string): boolean;
    function quoteStr(str: string): string;
    function swapQuotes(str: string): string;
    function switchToForwardSlashes(path: string): string;
    function trimModName(modName: string): string;
    function getDeclareFilePath(fname: string): string;
    function isJSFile(fname: string): boolean;
    function isTSFile(fname: string): boolean;
    function isDTSFile(fname: string): boolean;
    function getPrettyName(modPath: string, quote?: boolean, treatAsFileName?: boolean);
    function getPathComponents(path: string): string[];
    function getRelativePathToFixedPath(fixedModFilePath: string, absoluteModPath: string): string;
    function quoteBaseName(modPath: string): string;
    function changePathToDTS(modPath: string): string;
    function isRelative(path: string): boolean;
    function isRooted(path: string): boolean;
    function getRootFilePath(outFname: string): string;
    function filePathComponents(fullPath: string): string[];
    function filePath(fullPath: string): string;
    function normalizePath(path: string): string;
}
declare module TypeScript {
    interface IResolvedFile {
        fileInformation: FileInformation;
        path: string;
    }
    class SourceUnit implements TypeScript.IScriptSnapshot, IResolvedFile {
        public path: string;
        public fileInformation: FileInformation;
        public referencedFiles: IFileReference[];
        private lineStarts;
        constructor(path: string, fileInformation: FileInformation);
        public getText(start: number, end: number): string;
        public getLength(): number;
        public getLineStartPositions(): number[];
        public getTextChangeRangeSinceVersion(scriptVersion: number): TypeScript.TextChangeRange;
    }
    interface IFileReference extends TypeScript.ILineAndCharacter {
        path: string;
        isResident: boolean;
        position: number;
        length: number;
    }
    interface IFileSystemObject {
        resolvePath(path: string): string;
        readFile(path: string): FileInformation;
        findFile(rootPath: string, partialFilePath: string): IResolvedFile;
        dirName(path: string): string;
    }
    class CompilationEnvironment {
        public compilationSettings: TypeScript.CompilationSettings;
        public ioHost: IFileSystemObject;
        constructor(compilationSettings: TypeScript.CompilationSettings, ioHost: IFileSystemObject);
        public code: SourceUnit[];
        public inputFileNameToOutputFileName: TypeScript.StringHashTable<string>;
        public getSourceUnit(path: string): SourceUnit;
    }
    interface IResolutionDispatcher {
        errorReporter: TypeScript.IDignosticsReporter;
        postResolution(path: string, source: TypeScript.IScriptSnapshot): void;
    }
    interface ICodeResolver {
        resolveCode(referencePath: string, rootPath: string, performSearch: boolean, state: IResolutionDispatcher): void;
    }
    interface IResolverHost {
        resolveCompilationEnvironment(preEnvironment: CompilationEnvironment, resolver: ICodeResolver, traceDependencies: boolean): CompilationEnvironment;
    }
    class CodeResolver implements ICodeResolver {
        public environment: CompilationEnvironment;
        public visited: any;
        constructor(environment: CompilationEnvironment);
        public resolveCode(referencePath: string, parentPath: string, performSearch: boolean, resolutionDispatcher: IResolutionDispatcher): boolean;
    }
}
declare module TypeScript {
    class CompilationSettings {
        public propagateConstants: boolean;
        public minWhitespace: boolean;
        public noOutputOnError: boolean;
        public ignoreTypeErrors: boolean;
        public emitComments: boolean;
        public watch: boolean;
        public exec: boolean;
        public resolve: boolean;
        public disallowBool: boolean;
        public allowAutomaticSemicolonInsertion: boolean;
        public allowModuleKeywordInExternalModuleReference: boolean;
        public useDefaultLib: boolean;
        public codeGenTarget: TypeScript.LanguageVersion;
        public moduleGenTarget: TypeScript.ModuleGenTarget;
        public outputOption: string;
        public mapSourceFiles: boolean;
        public emitFullSourceMapPath: boolean;
        public generateDeclarationFiles: boolean;
        public useCaseSensitiveFileResolution: boolean;
        public gatherDiagnostics: boolean;
        public updateTC: boolean;
        public implicitAny: boolean;
    }
    interface IPreProcessedFileInfo {
        settings: CompilationSettings;
        referencedFiles: TypeScript.IFileReference[];
        importedFiles: TypeScript.IFileReference[];
        isLibFile: boolean;
    }
    function getImplicitImport(comment: string): boolean;
    function getReferencedFiles(fileName: string, sourceText: IScriptSnapshot): IFileReference[];
    function preProcessFile(fileName: string, sourceText: IScriptSnapshot, settings?: CompilationSettings, readImportFiles?: boolean): IPreProcessedFileInfo;
    function getParseOptions(settings: CompilationSettings): ParseOptions;
}
declare module TypeScript {
    class TextWriter implements ITextWriter {
        private ioHost;
        private path;
        private writeByteOrderMark;
        private contents;
        public onNewLine: boolean;
        constructor(ioHost: TypeScript.EmitterIOHost, path: string, writeByteOrderMark: boolean);
        public Write(s: string): void;
        public WriteLine(s: string): void;
        public Close(): void;
    }
    class DeclarationEmitter implements TypeScript.AstWalkerWithDetailCallback.AstWalkerDetailCallback {
        private emittingFileName;
        private semanticInfoChain;
        public emitOptions: TypeScript.EmitOptions;
        private writeByteOrderMark;
        public fileName: string;
        private declFile;
        private indenter;
        private declarationContainerStack;
        private isDottedModuleName;
        private dottedModuleEmit;
        private ignoreCallbackAst;
        private singleDeclFile;
        private varListCount;
        constructor(emittingFileName: string, semanticInfoChain: TypeScript.SemanticInfoChain, emitOptions: TypeScript.EmitOptions, writeByteOrderMark: boolean);
        public widenType(type: TypeScript.PullTypeSymbol): TypeScript.PullTypeSymbol;
        public close(): void;
        public emitDeclarations(script: TypeScript.Script): void;
        public getAstDeclarationContainer(): TypeScript.AST;
        private emitDottedModuleName();
        private getIndentString(declIndent?);
        private emitIndent();
        private canEmitSignature(declFlags, declAST, canEmitGlobalAmbientDecl?, useDeclarationContainerTop?);
        private canEmitPrePostAstSignature(declFlags, astWithPrePostCallback, preCallback);
        private getDeclFlagsString(declFlags, typeString);
        private emitDeclFlags(declFlags, typeString);
        private canEmitTypeAnnotationSignature(declFlag?);
        private pushDeclarationContainer(ast);
        private popDeclarationContainer(ast);
        public emitTypeNamesMember(memberName: TypeScript.MemberName, emitIndent?: boolean): void;
        private emitTypeSignature(type);
        private emitComment(comment);
        private emitDeclarationComments(ast, endLine?);
        public writeDeclarationComments(declComments: TypeScript.Comment[], endLine?: boolean): void;
        public emitTypeOfBoundDecl(boundDecl: TypeScript.BoundDecl): void;
        public VariableDeclaratorCallback(pre: boolean, varDecl: TypeScript.VariableDeclarator): boolean;
        public BlockCallback(pre: boolean, block: TypeScript.Block): boolean;
        public VariableStatementCallback(pre: boolean, variableDeclaration: TypeScript.VariableDeclaration): boolean;
        public VariableDeclarationCallback(pre: boolean, variableDeclaration: TypeScript.VariableDeclaration): boolean;
        private emitArgDecl(argDecl, funcDecl);
        public isOverloadedCallSignature(funcDecl: TypeScript.FunctionDeclaration): boolean;
        public FunctionDeclarationCallback(pre: boolean, funcDecl: TypeScript.FunctionDeclaration): boolean;
        public emitBaseExpression(bases: TypeScript.ASTList, index: number): void;
        private emitBaseList(typeDecl, useExtendsList);
        private emitAccessorDeclarationComments(funcDecl);
        public emitPropertyAccessorSignature(funcDecl: TypeScript.FunctionDeclaration): boolean;
        private emitClassMembersFromConstructorDefinition(funcDecl);
        public ClassDeclarationCallback(pre: boolean, classDecl: TypeScript.ClassDeclaration): boolean;
        private emitTypeParameters(typeParams, funcSignature?);
        public InterfaceDeclarationCallback(pre: boolean, interfaceDecl: TypeScript.InterfaceDeclaration): boolean;
        public ImportDeclarationCallback(pre: boolean, importDeclAST: TypeScript.ImportDeclaration): boolean;
        private emitEnumSignature(moduleDecl);
        public ModuleDeclarationCallback(pre: boolean, moduleDecl: TypeScript.ModuleDeclaration): boolean;
        public ExportAssignmentCallback(pre: boolean, ast: TypeScript.AST): boolean;
        public ScriptCallback(pre: boolean, script: TypeScript.Script): boolean;
        public DefaultCallback(pre: boolean, ast: TypeScript.AST): boolean;
    }
}
declare module TypeScript {
    class BloomFilter {
        private bitArray;
        private hashFunctionCount;
        static falsePositiveProbability: number;
        constructor(expectedCount: number);
        static computeM(expectedCount: number): number;
        static computeK(expectedCount: number): number;
        private computeHash(key, seed);
        private getCharacter(key, index);
        public addKeys(keys: TypeScript.BlockIntrinsics): void;
        public add(value: string): void;
        public probablyContains(value: string): boolean;
        public isEquivalent(filter: BloomFilter): boolean;
        static isEquivalent(array1: boolean[], array2: boolean[]): boolean;
    }
}
declare module TypeScript {
    class IdentifierWalker extends TypeScript.SyntaxWalker {
        public list: TypeScript.BlockIntrinsics;
        constructor(list: TypeScript.BlockIntrinsics);
        public visitToken(token: TypeScript.ISyntaxToken): void;
    }
}
declare module TypeScript {
    class DataMap {
        public map: any;
        public link(id: string, data: any): void;
        public unlink(id: string): void;
        public read(id: string);
        public flush(): void;
        public unpatch();
    }
    class PatchedDataMap extends DataMap {
        public parent: DataMap;
        public diffs: any;
        constructor(parent: DataMap);
        public link(id: string, data: any): void;
        public unlink(id: string): void;
        public read(id: string);
        public flush(): void;
        public unpatch(): DataMap;
    }
}
declare module TypeScript {
    enum PullElementFlags {
        None,
        Exported,
        Private,
        Public,
        Ambient,
        Static,
        GetAccessor,
        SetAccessor,
        Optional,
        Call,
        Constructor,
        Index,
        Signature,
        Enum,
        FatArrow,
        ClassConstructorVariable,
        InitializedModule,
        InitializedDynamicModule,
        InitializedEnum,
        MustCaptureThis,
        Constant,
        ExpressionElement,
        DeclaredInAWithBlock,
        ImplicitVariable,
        SomeInitializedModule,
    }
    enum PullElementKind {
        None,
        Global,
        Script,
        Primitive,
        Container,
        Class,
        Interface,
        DynamicModule,
        Enum,
        Array,
        TypeAlias,
        ObjectLiteral,
        Variable,
        Parameter,
        Property,
        TypeParameter,
        Function,
        ConstructorMethod,
        Method,
        FunctionExpression,
        GetAccessor,
        SetAccessor,
        CallSignature,
        ConstructSignature,
        IndexSignature,
        ObjectType,
        FunctionType,
        ConstructorType,
        EnumMember,
        ErrorType,
        Expression,
        WithBlock,
        CatchBlock,
        All,
        SomeFunction,
        SomeValue,
        SomeType,
        AcceptableAlias,
        SomeContainer,
        SomeBlock,
        SomeSignature,
        SomeAccessor,
        SomeTypeReference,
        SomeLHS,
        InterfaceTypeExtension,
        ClassTypeExtension,
        EnumTypeExtension,
    }
    enum SymbolLinkKind {
        TypedAs,
        ContextuallyTypedAs,
        ProvidesInferredType,
        ArrayType,
        ArrayOf,
        PublicMember,
        PrivateMember,
        ConstructorMethod,
        Aliases,
        ExportAliases,
        ContainedBy,
        Extends,
        Implements,
        Parameter,
        ReturnType,
        CallSignature,
        ConstructSignature,
        IndexSignature,
        TypeParameter,
        TypeArgument,
        TypeParameterSpecializedTo,
        SpecializedTo,
        TypeConstraint,
        ContributesToExpression,
        GetterFunction,
        SetterFunction,
    }
}
declare module TypeScript {
    var pullDeclID: number;
    var lastBoundPullDeclId: number;
    class PullDecl {
        private declType;
        private declName;
        private declDisplayName;
        private symbol;
        private declGroups;
        private signatureSymbol;
        private specializingSignatureSymbol;
        private childDecls;
        private typeParameters;
        public childDeclTypeCache: any;
        public childDeclValueCache: any;
        public childDeclNamespaceCache: any;
        public childDeclTypeParameterCache: any;
        private declID;
        private declFlags;
        private span;
        private scriptName;
        private diagnostics;
        private parentDecl;
        private _parentPath;
        private _isBound;
        private synthesizedValDecl;
        constructor(declName: string, displayName: string, declType: TypeScript.PullElementKind, declFlags: TypeScript.PullElementFlags, span: TypeScript.TextSpan, scriptName: string);
        public getDeclID(): number;
        public getName(): string;
        public getKind(): TypeScript.PullElementKind;
        public getDisplayName(): string;
        public setSymbol(symbol: TypeScript.PullSymbol): void;
        public ensureSymbolIsBound(bindSignatureSymbol?: boolean): void;
        public getSymbol(): TypeScript.PullSymbol;
        public hasSymbol(): boolean;
        public setSignatureSymbol(signature: TypeScript.PullSignatureSymbol): void;
        public getSignatureSymbol(): TypeScript.PullSignatureSymbol;
        public hasSignature(): boolean;
        public setSpecializingSignatureSymbol(signature: TypeScript.PullSignatureSymbol): void;
        public getSpecializingSignatureSymbol(): TypeScript.PullSignatureSymbol;
        public getFlags(): TypeScript.PullElementFlags;
        public setFlags(flags: TypeScript.PullElementFlags): void;
        public getSpan(): TypeScript.TextSpan;
        public setSpan(span: TypeScript.TextSpan): void;
        public getScriptName(): string;
        public setValueDecl(valDecl: PullDecl): void;
        public getValueDecl(): PullDecl;
        public isEqual(other: PullDecl): boolean;
        public getParentDecl(): PullDecl;
        public setParentDecl(parentDecl: PullDecl): void;
        public addDiagnostic(diagnostic: TypeScript.IDiagnostic): void;
        public getDiagnostics(): TypeScript.IDiagnostic[];
        public setErrors(diagnostics: TypeScript.SemanticDiagnostic[]): void;
        public resetErrors(): void;
        private getChildDeclCache(declKind);
        public addChildDecl(childDecl: PullDecl): void;
        public searchChildDecls(declName: string, searchKind: TypeScript.PullElementKind): PullDecl[];
        public getChildDecls(): PullDecl[];
        public getTypeParameters(): PullDecl[];
        public addVariableDeclToGroup(decl: PullDecl): void;
        public getVariableDeclGroups(): PullDecl[][];
        public getParentPath(): PullDecl[];
        public setParentPath(path: PullDecl[]): void;
        public setIsBound(isBinding): void;
        public isBound(): boolean;
    }
    class PullFunctionExpressionDecl extends PullDecl {
        private functionExpressionName;
        constructor(expressionName: string, declFlags: TypeScript.PullElementFlags, span: TypeScript.TextSpan, scriptName: string);
        public getFunctionExpressionName(): string;
    }
    class PullDeclGroup {
        public name: string;
        private _decls;
        constructor(name: string);
        public addDecl(decl: PullDecl): void;
        public getDecls(): PullDecl[];
    }
}
declare module TypeScript {
    var pullSymbolID: number;
    var lastBoundPullSymbolID: number;
    var globalTyvarID: number;
    class PullSymbol {
        private pullSymbolID;
        private outgoingLinks;
        private incomingLinks;
        private declarations;
        private name;
        private cachedPathIDs;
        private declKind;
        private cachedContainerLink;
        private cachedTypeLink;
        private cachedDeclarations;
        private hasBeenResolved;
        private isOptional;
        private inResolution;
        private isSynthesized;
        private isBound;
        private rebindingID;
        private isVarArg;
        private isSpecialized;
        private isBeingSpecialized;
        private rootSymbol;
        public typeChangeUpdateVersion: number;
        public addUpdateVersion: number;
        public removeUpdateVersion: number;
        public docComments: string;
        public isPrinting: boolean;
        public getSymbolID(): number;
        public isType(): boolean;
        public isSignature(): boolean;
        public isArray(): boolean;
        public isPrimitive(): boolean;
        public isAccessor(): boolean;
        public isError(): boolean;
        constructor(name: string, declKind: TypeScript.PullElementKind);
        public isAlias(): boolean;
        public isContainer(): boolean;
        private findAliasedType(decls);
        public getAliasedSymbol(scopeSymbol: PullSymbol): PullTypeAliasSymbol;
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getKind(): TypeScript.PullElementKind;
        public setKind(declType: TypeScript.PullElementKind): void;
        public setIsOptional(): void;
        public getIsOptional(): boolean;
        public getIsVarArg(): boolean;
        public setIsVarArg(): void;
        public setIsSynthesized(): void;
        public getIsSynthesized(): boolean;
        public setIsSpecialized(): void;
        public getIsSpecialized(): boolean;
        public currentlyBeingSpecialized(): boolean;
        public setIsBeingSpecialized(): void;
        public setValueIsBeingSpecialized(val: boolean): void;
        public getRootSymbol(): PullSymbol;
        public setRootSymbol(symbol: PullSymbol): void;
        public setIsBound(rebindingID: number): void;
        public getRebindingID(): number;
        public getIsBound(): boolean;
        public addCacheID(cacheID: string): void;
        public invalidateCachedIDs(cache: any): void;
        public addDeclaration(decl: TypeScript.PullDecl): void;
        public getDeclarations(): TypeScript.PullDecl[];
        public removeDeclaration(decl: TypeScript.PullDecl): void;
        public updateDeclarations(map: (item: TypeScript.PullDecl, context: any) => void, context: any): void;
        public addOutgoingLink(linkTo: PullSymbol, kind: TypeScript.SymbolLinkKind): TypeScript.PullSymbolLink;
        public findOutgoingLinks(p: (psl: TypeScript.PullSymbolLink) => boolean): TypeScript.PullSymbolLink[];
        public findIncomingLinks(p: (psl: TypeScript.PullSymbolLink) => boolean): TypeScript.PullSymbolLink[];
        public removeOutgoingLink(link: TypeScript.PullSymbolLink): void;
        public updateOutgoingLinks(map: (item: TypeScript.PullSymbolLink, context: any) => void, context: any): void;
        public updateIncomingLinks(map: (item: TypeScript.PullSymbolLink, context: any) => void, context: any): void;
        public removeAllLinks(): void;
        public setContainer(containerSymbol: PullTypeSymbol): void;
        public getContainer(): PullTypeSymbol;
        public unsetContainer(): void;
        public setType(typeRef: PullTypeSymbol): void;
        public getType(): PullTypeSymbol;
        public unsetType(): void;
        public isTyped(): boolean;
        public setResolved(): void;
        public isResolved(): boolean;
        public startResolving(): void;
        public isResolving(): boolean;
        public setUnresolved(): void;
        public invalidate(): void;
        public hasFlag(flag: TypeScript.PullElementFlags): boolean;
        public allDeclsHaveFlag(flag: TypeScript.PullElementFlags): boolean;
        public pathToRoot(): PullSymbol[];
        public findCommonAncestorPath(b: PullSymbol): PullSymbol[];
        public toString(useConstraintInName?: boolean): string;
        public getNamePartForFullName(): string;
        public fullName(scopeSymbol?: PullSymbol): string;
        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean): TypeScript.MemberName;
        public getTypeName(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): string;
        public getTypeNameEx(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): TypeScript.MemberName;
        private getTypeNameForFunctionSignature(prefix, scopeSymbol?, getPrettyTypeName?);
        public getNameAndTypeName(scopeSymbol?: PullSymbol): string;
        public getNameAndTypeNameEx(scopeSymbol?: PullSymbol): TypeScript.MemberName;
        static getTypeParameterString(typars: PullTypeSymbol[], scopeSymbol?: PullSymbol, useContraintInName?: boolean): string;
        static getTypeParameterStringEx(typeParameters: PullTypeSymbol[], scopeSymbol?: PullSymbol, getTypeParamMarkerInfo?: boolean, useContraintInName?: boolean): TypeScript.MemberNameArray;
        static getIsExternallyVisible(symbol: PullSymbol, fromIsExternallyVisibleSymbol: PullSymbol, inIsExternallyVisibleSymbols: PullSymbol[]): boolean;
        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean;
        public isModule(): boolean;
        private isOneDeclarationOfKind(kind);
    }
    class PullExpressionSymbol extends PullSymbol {
        public contributingSymbols: PullSymbol[];
        constructor();
        public addContributingSymbol(symbol: PullSymbol): void;
        public getContributingSymbols(): PullSymbol[];
    }
    class PullSignatureSymbol extends PullSymbol {
        private parameterLinks;
        private typeParameterLinks;
        private returnTypeLink;
        private hasOptionalParam;
        private nonOptionalParamCount;
        private hasVarArgs;
        private specializationCache;
        private memberTypeParameterNameCache;
        private hasAGenericParameter;
        private stringConstantOverload;
        constructor(kind: TypeScript.PullElementKind);
        public isDefinition(): boolean;
        public hasVariableParamList(): boolean;
        public setHasVariableParamList(): void;
        public setHasGenericParameter(): void;
        public hasGenericParameter(): boolean;
        public isGeneric(): boolean;
        public addParameter(parameter: PullSymbol, isOptional?: boolean): void;
        public addSpecialization(signature: PullSignatureSymbol, typeArguments: PullTypeSymbol[]): void;
        public getSpecialization(typeArguments): PullSignatureSymbol;
        public addTypeParameter(parameter: PullTypeParameterSymbol): void;
        public getNonOptionalParameterCount(): number;
        public setReturnType(returnType: PullTypeSymbol): void;
        public getParameters(): PullSymbol[];
        public getTypeParameters(): PullTypeParameterSymbol[];
        public findTypeParameter(name: string): PullTypeParameterSymbol;
        public removeParameter(parameterSymbol: PullSymbol): void;
        public mimicSignature(signature: PullSignatureSymbol, resolver: TypeScript.PullTypeResolver): void;
        public getReturnType(): PullTypeSymbol;
        public parametersAreFixed(): boolean;
        public isFixed(): boolean;
        public invalidate(): void;
        public isStringConstantOverloadSignature(): boolean;
        static getSignatureTypeMemberName(candidateSignature: PullSignatureSymbol, signatures: PullSignatureSymbol[], scopeSymbol: PullSymbol): TypeScript.MemberNameArray;
        static getSignaturesTypeNameEx(signatures: PullSignatureSymbol[], prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean, candidateSignature?: PullSignatureSymbol): TypeScript.MemberName[];
        public toString(useConstraintInName?: boolean): string;
        public getSignatureTypeNameEx(prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getParamMarkerInfo?: boolean, getTypeParamMarkerInfo?: boolean): TypeScript.MemberNameArray;
    }
    class PullTypeSymbol extends PullSymbol {
        private memberLinks;
        private typeParameterLinks;
        private specializationLinks;
        private containedByLinks;
        private memberNameCache;
        private memberTypeNameCache;
        private memberTypeParameterNameCache;
        private containedMemberCache;
        private typeArguments;
        private specializedTypeCache;
        private memberCache;
        private implementedTypeLinks;
        private extendedTypeLinks;
        private callSignatureLinks;
        private constructSignatureLinks;
        private indexSignatureLinks;
        private arrayType;
        private hasGenericSignature;
        private hasGenericMember;
        private knownBaseTypeCount;
        private _hasBaseTypeConflict;
        public getKnownBaseTypeCount(): number;
        public resetKnownBaseTypeCount(): void;
        public incrementKnownBaseCount(): void;
        public setHasBaseTypeConflict(): void;
        public hasBaseTypeConflict(): boolean;
        private invalidatedSpecializations;
        private associatedContainerTypeSymbol;
        private constructorMethod;
        private hasDefaultConstructor;
        public setUnresolved(): void;
        public isType(): boolean;
        public isClass(): boolean;
        public hasMembers(): boolean;
        public isFunction(): boolean;
        public isConstructor(): boolean;
        public isTypeParameter(): boolean;
        public isTypeVariable(): boolean;
        public isError(): boolean;
        public setHasGenericSignature(): void;
        public getHasGenericSignature(): boolean;
        public setHasGenericMember(): void;
        public getHasGenericMember(): boolean;
        public setAssociatedContainerType(type: PullTypeSymbol): void;
        public getAssociatedContainerType(): PullTypeSymbol;
        public getType(): PullTypeSymbol;
        public getArrayType(): PullTypeSymbol;
        public getElementType(): PullTypeSymbol;
        public setArrayType(arrayType: PullTypeSymbol): void;
        public addContainedByLink(containedByLink: TypeScript.PullSymbolLink): void;
        public findContainedMember(name: string): PullSymbol;
        public addMember(memberSymbol: PullSymbol, linkKind: TypeScript.SymbolLinkKind, doNotChangeContainer?: boolean): void;
        public removeMember(memberSymbol: PullSymbol): void;
        public getMembers(): PullSymbol[];
        public setHasDefaultConstructor(hasOne?: boolean): void;
        public getHasDefaultConstructor(): boolean;
        public getConstructorMethod(): PullSymbol;
        public setConstructorMethod(constructorMethod: PullSymbol): void;
        public getTypeParameters(): PullTypeParameterSymbol[];
        public isGeneric(): boolean;
        public isFixed(): boolean;
        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void;
        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol;
        public getKnownSpecializations(): PullTypeSymbol[];
        public invalidateSpecializations(): void;
        public removeSpecialization(specializationType: PullTypeSymbol): void;
        public getTypeArguments(): PullTypeSymbol[];
        public setTypeArguments(typeArgs: PullTypeSymbol[]): void;
        public addCallSignature(callSignature: PullSignatureSymbol): void;
        public addCallSignatures(callSignatures: PullSignatureSymbol[]): void;
        public addConstructSignature(constructSignature: PullSignatureSymbol): void;
        public addConstructSignatures(constructSignatures: PullSignatureSymbol[]): void;
        public addIndexSignature(indexSignature: PullSignatureSymbol): void;
        public addIndexSignatures(indexSignatures: PullSignatureSymbol[]): void;
        public hasOwnCallSignatures(): boolean;
        public getCallSignatures(collectBaseSignatures?: boolean): PullSignatureSymbol[];
        public hasOwnConstructSignatures(): boolean;
        public getConstructSignatures(collectBaseSignatures?: boolean): PullSignatureSymbol[];
        public hasOwnIndexSignatures(): boolean;
        public getIndexSignatures(collectBaseSignatures?: boolean): PullSignatureSymbol[];
        public removeCallSignature(signature: PullSignatureSymbol, invalidate?: boolean): void;
        public recomputeCallSignatures(): void;
        public removeConstructSignature(signature: PullSignatureSymbol, invalidate?: boolean): void;
        public recomputeConstructSignatures(): void;
        public removeIndexSignature(signature: PullSignatureSymbol, invalidate?: boolean): void;
        public recomputeIndexSignatures(): void;
        public addImplementedType(interfaceType: PullTypeSymbol): void;
        public getImplementedTypes(): PullTypeSymbol[];
        public removeImplementedType(implementedType: PullTypeSymbol): void;
        public addExtendedType(extendedType: PullTypeSymbol): void;
        public getExtendedTypes(): PullTypeSymbol[];
        public hasBase(potentialBase: PullTypeSymbol, origin?): boolean;
        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean;
        public removeExtendedType(extendedType: PullTypeSymbol): void;
        public findMember(name: string, lookInParent?: boolean): PullSymbol;
        public findNestedType(name: string, kind?: TypeScript.PullElementKind): PullTypeSymbol;
        private populateMemberCache();
        private populateMemberTypeCache();
        public getAllMembers(searchDeclKind: TypeScript.PullElementKind, includePrivate: boolean): PullSymbol[];
        public findTypeParameter(name: string): PullTypeParameterSymbol;
        public cleanTypeParameters(): void;
        public setResolved(): void;
        public invalidate(): void;
        public getNamePartForFullName(): string;
        public getScopedName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public isNamedTypeSymbol(): boolean;
        public toString(useConstraintInName?: boolean): string;
        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean): TypeScript.MemberName;
        public hasOnlyOverloadCallSignatures(): boolean;
        public getMemberTypeNameEx(topLevel: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): TypeScript.MemberName;
        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean;
        public setType(type: PullTypeSymbol): void;
    }
    class PullPrimitiveTypeSymbol extends PullTypeSymbol {
        constructor(name: string);
        public isResolved(): boolean;
        public isStringConstant(): boolean;
        public isFixed(): boolean;
        public invalidate(): void;
    }
    class PullStringConstantTypeSymbol extends PullPrimitiveTypeSymbol {
        constructor(name: string);
        public isStringConstant(): boolean;
    }
    class PullErrorTypeSymbol extends PullPrimitiveTypeSymbol {
        private diagnostic;
        public delegateType: PullTypeSymbol;
        private _data;
        constructor(diagnostic: TypeScript.SemanticDiagnostic, delegateType: PullTypeSymbol, _data?);
        public isError(): boolean;
        public getDiagnostic(): TypeScript.SemanticDiagnostic;
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public toString(): string;
        public isResolved(): boolean;
        public setData(data: any): void;
        public getData();
    }
    class PullClassTypeSymbol extends PullTypeSymbol {
        constructor(name: string);
    }
    class PullContainerTypeSymbol extends PullTypeSymbol {
        public instanceSymbol: PullSymbol;
        private _exportAssignedValueSymbol;
        private _exportAssignedTypeSymbol;
        private _exportAssignedContainerSymbol;
        constructor(name: string, kind?: TypeScript.PullElementKind);
        public isContainer(): boolean;
        public setInstanceSymbol(symbol: PullSymbol): void;
        public getInstanceSymbol(): PullSymbol;
        public invalidate(): void;
        public setExportAssignedValueSymbol(symbol: PullSymbol): void;
        public getExportAssignedValueSymbol(): PullSymbol;
        public setExportAssignedTypeSymbol(type: PullTypeSymbol): void;
        public getExportAssignedTypeSymbol(): PullTypeSymbol;
        public setExportAssignedContainerSymbol(container: PullContainerTypeSymbol): void;
        public getExportAssignedContainerSymbol(): PullContainerTypeSymbol;
        public resetExportAssignedSymbols(): void;
        static usedAsSymbol(containerSymbol: PullSymbol, symbol: PullSymbol);
    }
    class PullTypeAliasSymbol extends PullTypeSymbol {
        private typeAliasLink;
        private isUsedAsValue;
        private typeUsedExternally;
        private retrievingExportAssignment;
        constructor(name: string);
        public isAlias(): boolean;
        public isContainer(): boolean;
        public setAliasedType(type: PullTypeSymbol): void;
        public getExportAssignedValueSymbol(): PullSymbol;
        public getExportAssignedTypeSymbol(): PullTypeSymbol;
        public getExportAssignedContainerSymbol(): PullContainerTypeSymbol;
        public getType(): PullTypeSymbol;
        public setType(type: PullTypeSymbol): void;
        public setIsUsedAsValue(): void;
        public getIsUsedAsValue(): boolean;
        public setIsTypeUsedExternally(): void;
        public getTypeUsedExternally(): boolean;
        public getMembers(): PullSymbol[];
        public getCallSignatures(): PullSignatureSymbol[];
        public getConstructSignatures(): PullSignatureSymbol[];
        public getIndexSignatures(): PullSignatureSymbol[];
        public findMember(name: string): PullSymbol;
        public findNestedType(name: string): PullTypeSymbol;
        public getAllMembers(searchDeclKind: TypeScript.PullElementKind, includePrivate: boolean): PullSymbol[];
        public invalidate(): void;
    }
    class PullDefinitionSignatureSymbol extends PullSignatureSymbol {
        public isDefinition(): boolean;
    }
    class PullFunctionTypeSymbol extends PullTypeSymbol {
        private definitionSignature;
        constructor();
        public isFunction(): boolean;
        public invalidate(): void;
        public addSignature(signature: PullSignatureSymbol): void;
        public getDefinitionSignature(): PullDefinitionSignatureSymbol;
    }
    class PullConstructorTypeSymbol extends PullTypeSymbol {
        private definitionSignature;
        constructor();
        public isFunction(): boolean;
        public isConstructor(): boolean;
        public invalidate(): void;
        public addSignature(signature: PullSignatureSymbol): void;
        public addTypeParameter(typeParameter: PullTypeParameterSymbol, doNotChangeContainer?: boolean): void;
        public getDefinitionSignature(): PullDefinitionSignatureSymbol;
    }
    class PullTypeParameterSymbol extends PullTypeSymbol {
        private _isFunctionTypeParameter;
        private constraintLink;
        constructor(name: string, _isFunctionTypeParameter);
        public isTypeParameter(): boolean;
        public isFunctionTypeParameter();
        public isFixed(): boolean;
        public setConstraint(constraintType: PullTypeSymbol): void;
        public getConstraint(): PullTypeSymbol;
        public isGeneric(): boolean;
        public fullName(scopeSymbol?: PullSymbol): string;
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean;
    }
    class PullTypeVariableSymbol extends PullTypeParameterSymbol {
        constructor(name: string, isFunctionTypeParameter: boolean);
        private tyvarID;
        public isTypeParameter(): boolean;
        public isTypeVariable(): boolean;
    }
    class PullAccessorSymbol extends PullSymbol {
        private getterSymbolLink;
        private setterSymbolLink;
        constructor(name: string);
        public isAccessor(): boolean;
        public setSetter(setter: PullSymbol): void;
        public getSetter(): PullSymbol;
        public removeSetter(): void;
        public setGetter(getter: PullSymbol): void;
        public getGetter(): PullSymbol;
        public removeGetter(): void;
        public invalidate(): void;
    }
    class PullArrayTypeSymbol extends PullTypeSymbol {
        private elementType;
        public isArray(): boolean;
        public getElementType(): PullTypeSymbol;
        public isGeneric(): boolean;
        constructor();
        public setElementType(type: PullTypeSymbol): void;
        public getScopedNameEx(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean): TypeScript.MemberName;
        public getMemberTypeNameEx(topLevel: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): TypeScript.MemberName;
    }
    function specializeToArrayType(typeToReplace: PullTypeSymbol, typeToSpecializeTo: PullTypeSymbol, resolver: PullTypeResolver, context: PullTypeResolutionContext): PullTypeSymbol;
    function typeWrapsTypeParameter(type: PullTypeSymbol, typeParameter: PullTypeParameterSymbol): boolean;
    function getRootType(typeToSpecialize: PullTypeSymbol): PullTypeSymbol;
    var nSpecializationsCreated: number;
    var nSpecializedSignaturesCreated: number;
    function shouldSpecializeTypeParameterForTypeParameter(specialization: PullTypeParameterSymbol, typeToSpecialize: PullTypeParameterSymbol): boolean;
    function specializeType(typeToSpecialize: PullTypeSymbol, typeArguments: PullTypeSymbol[], resolver: PullTypeResolver, enclosingDecl: PullDecl, context: PullTypeResolutionContext, ast?: AST): PullTypeSymbol;
    function specializeSignature(signature: PullSignatureSymbol, skipLocalTypeParameters: boolean, typeReplacementMap: any, typeArguments: PullTypeSymbol[], resolver: PullTypeResolver, enclosingDecl: PullDecl, context: PullTypeResolutionContext, ast?: AST): PullSignatureSymbol;
    function getIDForTypeSubstitutions(types: PullTypeSymbol[]): string;
}
declare module TypeScript {
    class PullSymbolBindingContext {
        public semanticInfoChain: TypeScript.SemanticInfoChain;
        public scriptName: string;
        private parentChain;
        private declPath;
        public semanticInfo: TypeScript.SemanticInfo;
        public reBindingAfterChange: boolean;
        public startingDeclForRebind: number;
        constructor(semanticInfoChain: TypeScript.SemanticInfoChain, scriptName: string);
        public getParent(n?: number): TypeScript.PullTypeSymbol;
        public getDeclPath(): string[];
        public pushParent(parentDecl: TypeScript.PullTypeSymbol): void;
        public popParent(): void;
    }
    var time_in_findSymbol: number;
}
declare module TypeScript {
    class CandidateInferenceInfo {
        public typeParameter: TypeScript.PullTypeParameterSymbol;
        public isFixed: boolean;
        public inferenceCandidates: TypeScript.PullTypeSymbol[];
        public addCandidate(candidate: TypeScript.PullTypeSymbol): void;
    }
    class ArgumentInferenceContext {
        public inferenceCache: any;
        public candidateCache: any;
        public alreadyRelatingTypes(objectType: TypeScript.PullTypeSymbol, parameterType: TypeScript.PullTypeSymbol): boolean;
        public resetRelationshipCache(): void;
        public addInferenceRoot(param: TypeScript.PullTypeParameterSymbol): void;
        public getInferenceInfo(param: TypeScript.PullTypeParameterSymbol): CandidateInferenceInfo;
        public addCandidateForInference(param: TypeScript.PullTypeParameterSymbol, candidate: TypeScript.PullTypeSymbol, fix: boolean): void;
        public getInferenceCandidates(): any[];
        public inferArgumentTypes(resolver: TypeScript.PullTypeResolver, context: PullTypeResolutionContext): {
            results: {
                param: TypeScript.PullTypeParameterSymbol;
                type: TypeScript.PullTypeSymbol;
            }[];
            unfit: boolean;
        };
    }
    class PullContextualTypeContext {
        public contextualType: TypeScript.PullTypeSymbol;
        public provisional: boolean;
        public substitutions: any;
        public provisionallyTypedSymbols: TypeScript.PullSymbol[];
        public provisionalDiagnostic: TypeScript.SemanticDiagnostic[];
        constructor(contextualType: TypeScript.PullTypeSymbol, provisional: boolean, substitutions: any);
        public recordProvisionallyTypedSymbol(symbol: TypeScript.PullSymbol): void;
        public invalidateProvisionallyTypedSymbols(): void;
        public postDiagnostic(error: TypeScript.SemanticDiagnostic): void;
        public hadProvisionalErrors(): boolean;
    }
    class PullTypeResolutionContext {
        private contextStack;
        private typeSpecializationStack;
        private genericASTResolutionStack;
        public resolvingTypeReference: boolean;
        public resolvingNamespaceMemberAccess: boolean;
        public resolveAggressively: boolean;
        public canUseTypeSymbol: boolean;
        public specializingToAny: boolean;
        public specializingToObject: boolean;
        public isResolvingClassExtendedType: boolean;
        public isSpecializingSignatureAtCallSite: boolean;
        public isSpecializingConstructorMethod: boolean;
        public isComparingSpecializedSignatures: boolean;
        constructor();
        public pushContextualType(type: TypeScript.PullTypeSymbol, provisional: boolean, substitutions: any): void;
        public popContextualType(): PullContextualTypeContext;
        public findSubstitution(type: TypeScript.PullTypeSymbol): TypeScript.PullTypeSymbol;
        public getContextualType(): TypeScript.PullTypeSymbol;
        public inProvisionalResolution(): boolean;
        public inSpecialization: boolean;
        public suppressErrors: boolean;
        private inBaseTypeResolution;
        public isInBaseTypeResolution(): boolean;
        public startBaseTypeResolution(): boolean;
        public doneBaseTypeResolution(wasInBaseTypeResolution: boolean): void;
        public setTypeInContext(symbol: TypeScript.PullSymbol, type: TypeScript.PullTypeSymbol): void;
        public pushTypeSpecializationCache(cache): void;
        public popTypeSpecializationCache(): void;
        public findSpecializationForType(type: TypeScript.PullTypeSymbol): TypeScript.PullTypeSymbol;
        public postError(fileName: string, offset: number, length: number, diagnosticCode: TypeScript.DiagnosticCode, arguments?: any[], enclosingDecl?: TypeScript.PullDecl, addToDecl?: boolean): TypeScript.Diagnostic;
        public postDiagnostic(diagnostic: TypeScript.Diagnostic, enclosingDecl: TypeScript.PullDecl, addToDecl: boolean): void;
        public startResolvingTypeArguments(ast: TypeScript.AST): void;
        public isResolvingTypeArguments(ast: TypeScript.AST): boolean;
        public doneResolvingTypeArguments(): void;
    }
}
declare module TypeScript {
    class SymbolAndDiagnostics<TSymbol extends TypeScript.PullSymbol> {
        public symbol: TSymbol;
        public symbolAlias: TSymbol;
        public diagnostics: TypeScript.Diagnostic[];
        private static _empty;
        constructor(symbol: TSymbol, symbolAlias: TSymbol, diagnostics: TypeScript.Diagnostic[]);
        static create<TSymbol extends TypeScript.PullSymbol>(symbol: TSymbol, diagnostics: TypeScript.Diagnostic[]): SymbolAndDiagnostics<TSymbol>;
        static empty<TSymbol extends TypeScript.PullSymbol>(): SymbolAndDiagnostics<TSymbol>;
        static fromSymbol<TSymbol extends TypeScript.PullSymbol>(symbol: TSymbol): SymbolAndDiagnostics<TSymbol>;
        static fromAlias<TSymbol extends TypeScript.PullSymbol>(symbol: TSymbol, alias: TSymbol): SymbolAndDiagnostics<TSymbol>;
        public addDiagnostic(diagnostic: TypeScript.Diagnostic): void;
        public withoutDiagnostics(): SymbolAndDiagnostics<TSymbol>;
    }
    interface IPullTypeCollection {
        getLength(): number;
        setTypeAtIndex(index: number, type: TypeScript.PullTypeSymbol): void;
        getTypeAtIndex(index: number): TypeScript.PullTypeSymbol;
    }
    interface IPullResolutionData {
        actuals: TypeScript.PullTypeSymbol[];
        exactCandidates: TypeScript.PullSignatureSymbol[];
        conversionCandidates: TypeScript.PullSignatureSymbol[];
        id: number;
    }
    class PullResolutionDataCache {
        private cacheSize;
        private rdCache;
        private nextUp;
        constructor();
        public getResolutionData(): IPullResolutionData;
        public returnResolutionData(rd: IPullResolutionData): void;
    }
    interface PullApplicableSignature {
        signature: TypeScript.PullSignatureSymbol;
        hadProvisionalErrors: boolean;
    }
    class PullAdditionalCallResolutionData {
        public targetSymbol: TypeScript.PullSymbol;
        public targetTypeSymbol: TypeScript.PullTypeSymbol;
        public resolvedSignatures: TypeScript.PullSignatureSymbol[];
        public candidateSignature: TypeScript.PullSignatureSymbol;
        public actualParametersContextTypeSymbols: TypeScript.PullTypeSymbol[];
    }
    class PullAdditionalObjectLiteralResolutionData {
        public membersContextTypeSymbols: TypeScript.PullTypeSymbol[];
    }
    class PullTypeResolver {
        private compilationSettings;
        public semanticInfoChain: TypeScript.SemanticInfoChain;
        private unitPath;
        private _cachedArrayInterfaceType;
        private _cachedNumberInterfaceType;
        private _cachedStringInterfaceType;
        private _cachedBooleanInterfaceType;
        private _cachedObjectInterfaceType;
        private _cachedFunctionInterfaceType;
        private _cachedIArgumentsInterfaceType;
        private _cachedRegExpInterfaceType;
        private cachedFunctionArgumentsSymbol;
        private assignableCache;
        private subtypeCache;
        private identicalCache;
        private resolutionDataCache;
        private currentUnit;
        public cleanCachedGlobals(): void;
        private cachedArrayInterfaceType();
        public getCachedArrayType(): TypeScript.PullTypeSymbol;
        private cachedNumberInterfaceType();
        private cachedStringInterfaceType();
        private cachedBooleanInterfaceType();
        private cachedObjectInterfaceType();
        private cachedFunctionInterfaceType();
        private cachedIArgumentsInterfaceType();
        private cachedRegExpInterfaceType();
        constructor(compilationSettings: TypeScript.CompilationSettings, semanticInfoChain: TypeScript.SemanticInfoChain, unitPath: string);
        public getUnitPath(): string;
        public setUnitPath(unitPath: string): void;
        public getDeclForAST(ast: TypeScript.AST): TypeScript.PullDecl;
        public getSymbolAndDiagnosticsForAST(ast: TypeScript.AST): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        private setSymbolAndDiagnosticsForAST(ast, symbolAndDiagnostics, context);
        public getASTForSymbol(symbol: TypeScript.PullSymbol): TypeScript.AST;
        public getASTForDecl(decl: TypeScript.PullDecl): TypeScript.AST;
        public getNewErrorTypeSymbol(diagnostic: TypeScript.SemanticDiagnostic, data?): TypeScript.PullErrorTypeSymbol;
        public getEnclosingDecl(decl: TypeScript.PullDecl): TypeScript.PullDecl;
        private getExportedMemberSymbol(symbol, parent);
        private getMemberSymbol(symbolName, declSearchKind, parent, searchContainedMembers?);
        private getSymbolFromDeclPath(symbolName, declPath, declSearchKind);
        private getVisibleDeclsFromDeclPath(declPath, declSearchKind);
        private addFilteredDecls(decls, declSearchKind, result);
        public getVisibleDecls(enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullDecl[];
        public getVisibleContextSymbols(enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullSymbol[];
        public getVisibleMembersFromExpression(expression: TypeScript.AST, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullSymbol[];
        public isAnyOrEquivalent(type: TypeScript.PullTypeSymbol): boolean;
        public isNumberOrEquivalent(type: TypeScript.PullTypeSymbol): boolean;
        public isTypeArgumentOrWrapper(type: TypeScript.PullTypeSymbol);
        public isArrayOrEquivalent(type: TypeScript.PullTypeSymbol);
        private findTypeSymbolForDynamicModule(idText, currentFileName, search);
        public resolveDeclaredSymbol(symbol: TypeScript.PullSymbol, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullSymbol;
        private resolveDeclaredSymbolWorker(symbol, enclosingDecl, context);
        private resolveModuleDeclaration(ast, context);
        public isTypeRefWithoutTypeArgs(typeRef: TypeScript.TypeReference): boolean;
        private resolveReferenceTypeDeclaration(typeDeclAST, context);
        private resolveClassDeclaration(classDeclAST, context);
        private resolveInterfaceDeclaration(interfaceDeclAST, context);
        private resolveImportDeclaration(importStatementAST, context);
        public resolveExportAssignmentStatement(exportAssignmentAST: TypeScript.ExportAssignment, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public resolveFunctionTypeSignature(funcDeclAST: TypeScript.FunctionDeclaration, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullTypeSymbol;
        private resolveFunctionTypeSignatureParameter(argDeclAST, signature, enclosingDecl, context);
        private resolveFunctionExpressionParameter(argDeclAST, contextParam, enclosingDecl, context);
        public resolveInterfaceTypeReference(interfaceDeclAST: TypeScript.NamedDeclaration, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullTypeSymbol;
        public resolveTypeReference(typeRef: TypeScript.TypeReference, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): SymbolAndDiagnostics<TypeScript.PullTypeSymbol>;
        private computeTypeReferenceSymbol(typeRef, enclosingDecl, context);
        private resolveVariableDeclaration(varDecl, context, enclosingDecl?);
        private resolveTypeParameterDeclaration(typeParameterAST, context);
        private resolveFunctionBodyReturnTypes(funcDeclAST, signature, useContextualType, enclosingDecl, context);
        private resolveFunctionDeclaration(funcDeclAST, context);
        private resolveGetAccessorDeclaration(funcDeclAST, context);
        private resolveSetAccessorDeclaration(funcDeclAST, context);
        public resolveAST(ast: TypeScript.AST, inContextuallyTypedAssignment: boolean, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        private resolveRegularExpressionLiteral();
        private isNameOrMemberAccessExpression(ast);
        private resolveNameSymbol(nameSymbol, context);
        public resolveNameExpression(nameAST: TypeScript.Identifier, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        private computeNameExpression(nameAST, enclosingDecl, context);
        public resolveDottedNameExpression(dottedNameAST: TypeScript.BinaryExpression, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public isPrototypeMember(dottedNameAST: TypeScript.BinaryExpression, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): boolean;
        private computeDottedNameExpressionSymbol(dottedNameAST, enclosingDecl, context);
        public resolveTypeNameExpression(nameAST: TypeScript.Identifier, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): SymbolAndDiagnostics<TypeScript.PullTypeSymbol>;
        private computeTypeNameExpression(nameAST, enclosingDecl, context);
        private addDiagnostic(diagnostics, diagnostic);
        private resolveGenericTypeReference(genericTypeAST, enclosingDecl, context);
        private resolveDottedTypeNameExpression(dottedNameAST, enclosingDecl, context);
        private computeDottedTypeNameExpression(dottedNameAST, enclosingDecl, context);
        private resolveFunctionExpression(funcDeclAST, inContextuallyTypedAssignment, enclosingDecl, context);
        private resolveThisExpression(ast, enclosingDecl, context);
        private computeThisExpressionSymbol(ast, enclosingDecl, context);
        private resolveSuperExpression(ast, enclosingDecl, context);
        public resolveObjectLiteralExpression(expressionAST: TypeScript.AST, inContextuallyTypedAssignment: boolean, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalObjectLiteralResolutionData): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        private computeObjectLiteralExpression(expressionAST, inContextuallyTypedAssignment, enclosingDecl, context, additionalResults?);
        private resolveArrayLiteralExpression(arrayLit, inContextuallyTypedAssignment, enclosingDecl, context);
        private computeArrayLiteralExpressionSymbol(arrayLit, inContextuallyTypedAssignment, enclosingDecl, context);
        private resolveIndexExpression(callEx, inContextuallyTypedAssignment, enclosingDecl, context);
        private computeIndexExpressionSymbol(callEx, inContextuallyTypedAssignment, enclosingDecl, context);
        private resolveBitwiseOperator(expressionAST, inContextuallyTypedAssignment, enclosingDecl, context);
        private resolveArithmeticExpression(binex, inContextuallyTypedAssignment, enclosingDecl, context);
        private resolveLogicalOrExpression(binex, inContextuallyTypedAssignment, enclosingDecl, context);
        private computeLogicalOrExpressionSymbol(binex, inContextuallyTypedAssignment, enclosingDecl, context);
        private resolveLogicalAndExpression(binex, inContextuallyTypedAssignment, enclosingDecl, context);
        private resolveConditionalExpression(trinex, enclosingDecl, context);
        private computeConditionalExpressionSymbol(trinex, enclosingDecl, context);
        private resolveParenthesizedExpression(ast, enclosingDecl, context);
        private resolveExpressionStatement(ast, inContextuallyTypedAssignment, enclosingDecl, context);
        public resolveCallExpression(callEx: TypeScript.CallExpression, inContextuallyTypedAssignment: boolean, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public computeCallExpressionSymbol(callEx: TypeScript.CallExpression, inContextuallyTypedAssignment: boolean, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public resolveNewExpression(callEx: TypeScript.CallExpression, inContextuallyTypedAssignment: boolean, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public computeNewExpressionSymbol(callEx: TypeScript.CallExpression, inContextuallyTypedAssignment: boolean, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public resolveTypeAssertionExpression(assertionExpression: TypeScript.UnaryExpression, inContextuallyTypedAssignment: boolean, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): SymbolAndDiagnostics<TypeScript.PullTypeSymbol>;
        private resolveAssignmentStatement(binex, inContextuallyTypedAssignment, enclosingDecl, context);
        private computeAssignmentStatementSymbol(binex, inContextuallyTypedAssignment, enclosingDecl, context);
        public resolveBoundDecls(decl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): void;
        private mergeOrdered(a, b, context, comparisonInfo?);
        public widenType(type: TypeScript.PullTypeSymbol): TypeScript.PullTypeSymbol;
        private isNullOrUndefinedType(type);
        private canApplyContextualType(type);
        public findBestCommonType(initialType: TypeScript.PullTypeSymbol, targetType: TypeScript.PullTypeSymbol, collection: IPullTypeCollection, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): TypeScript.PullTypeSymbol;
        public typesAreIdentical(t1: TypeScript.PullTypeSymbol, t2: TypeScript.PullTypeSymbol, val?: TypeScript.AST);
        private signatureGroupsAreIdentical(sg1, sg2);
        public signaturesAreIdentical(s1: TypeScript.PullSignatureSymbol, s2: TypeScript.PullSignatureSymbol): boolean;
        public substituteUpperBoundForType(type: TypeScript.PullTypeSymbol);
        private symbolsShareDeclaration(symbol1, symbol2);
        public sourceIsSubtypeOfTarget(source: TypeScript.PullTypeSymbol, target: TypeScript.PullTypeSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        public sourceMembersAreSubtypeOfTargetMembers(source: TypeScript.PullTypeSymbol, target: TypeScript.PullTypeSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        public sourcePropertyIsSubtypeOfTargetProperty(source: TypeScript.PullTypeSymbol, target: TypeScript.PullTypeSymbol, sourceProp: TypeScript.PullSymbol, targetProp: TypeScript.PullSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        public sourceCallSignaturesAreSubtypeOfTargetCallSignatures(source: TypeScript.PullTypeSymbol, target: TypeScript.PullTypeSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        public sourceConstructSignaturesAreSubtypeOfTargetConstructSignatures(source: TypeScript.PullTypeSymbol, target: TypeScript.PullTypeSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        public sourceIndexSignaturesAreSubtypeOfTargetIndexSignatures(source: TypeScript.PullTypeSymbol, target: TypeScript.PullTypeSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        public typeIsSubtypeOfFunction(source: TypeScript.PullTypeSymbol, context): boolean;
        private signatureGroupIsSubtypeOfTarget(sg1, sg2, context, comparisonInfo?);
        public signatureIsSubtypeOfTarget(s1: TypeScript.PullSignatureSymbol, s2: TypeScript.PullSignatureSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        public sourceIsAssignableToTarget(source: TypeScript.PullTypeSymbol, target: TypeScript.PullTypeSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo, isInProvisionalResolution?: boolean): boolean;
        private signatureGroupIsAssignableToTarget(sg1, sg2, context, comparisonInfo?);
        public signatureIsAssignableToTarget(s1: TypeScript.PullSignatureSymbol, s2: TypeScript.PullSignatureSymbol, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeScript.TypeComparisonInfo): boolean;
        private sourceIsRelatableToTarget(source, target, assignableTo, comparisonCache, context, comparisonInfo);
        private sourceMembersAreRelatableToTargetMembers(source, target, assignableTo, comparisonCache, context, comparisonInfo);
        private sourcePropertyIsRelatableToTargetProperty(source, target, sourceProp, targetProp, assignableTo, comparisonCache, context, comparisonInfo);
        private sourceCallSignaturesAreRelatableToTargetCallSignatures(source, target, assignableTo, comparisonCache, context, comparisonInfo);
        private sourceConstructSignaturesAreRelatableToTargetConstructSignatures(source, target, assignableTo, comparisonCache, context, comparisonInfo);
        private sourceIndexSignaturesAreRelatableToTargetIndexSignatures(source, target, assignableTo, comparisonCache, context, comparisonInfo);
        private signatureGroupIsRelatableToTarget(sourceSG, targetSG, assignableTo, comparisonCache, context, comparisonInfo?);
        private signatureIsRelatableToTarget(sourceSig, targetSig, assignableTo, comparisonCache, context, comparisonInfo?);
        private resolveOverloads(application, group, enclosingDecl, haveTypeArgumentsAtCallSite, context, diagnostics);
        private getLastIdentifierInTarget(callEx);
        private getCandidateSignatures(signature, actuals, args, exactCandidates, conversionCandidates, enclosingDecl, context, comparisonInfo);
        private getApplicableSignaturesFromCandidates(candidateSignatures, args, comparisonInfo, enclosingDecl, context);
        private findMostApplicableSignature(signatures, args, enclosingDecl, context);
        private canApplyContextualTypeToFunction(candidateType, funcDecl, beStringent);
        private inferArgumentTypesForSignature(signature, args, comparisonInfo, enclosingDecl, context);
        private relateTypeToTypeParameters(expressionType, parameterType, shouldFix, argContext, enclosingDecl, context);
        private relateFunctionSignatureToTypeParameters(expressionSignature, parameterSignature, argContext, enclosingDecl, context);
        private relateObjectTypeToTypeParameters(objectType, parameterType, shouldFix, argContext, enclosingDecl, context);
        private relateArrayTypeToTypeParameters(argArrayType, parameterArrayType, shouldFix, argContext, enclosingDecl, context);
        public specializeTypeToAny(typeToSpecialize: TypeScript.PullTypeSymbol, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullTypeSymbol;
        private specializeSignatureToAny(signatureToSpecialize, enclosingDecl, context);
    }
}
declare module TypeScript {
    class PullTypeResolver2 {
    }
}
declare module TypeScript {
    class TypeComparisonInfo {
        public onlyCaptureFirstError: boolean;
        public flags: TypeScript.TypeRelationshipFlags;
        public message: string;
        public stringConstantVal: TypeScript.AST;
        private indent;
        constructor(sourceComparisonInfo?: TypeComparisonInfo);
        public addMessage(message): void;
        public setMessage(message): void;
    }
    class PullTypeCheckContext {
        public compiler: TypeScript.TypeScriptCompiler;
        public script: TypeScript.Script;
        public scriptName: string;
        public enclosingDeclStack: TypeScript.PullDecl[];
        public enclosingDeclReturnStack: boolean[];
        public semanticInfo: TypeScript.SemanticInfo;
        public inSuperConstructorCall: boolean;
        public inSuperConstructorTarget: boolean;
        public seenSuperConstructorCall: boolean;
        public inConstructorArguments: boolean;
        public inImportDeclaration: boolean;
        constructor(compiler: TypeScript.TypeScriptCompiler, script: TypeScript.Script, scriptName: string);
        public pushEnclosingDecl(decl: TypeScript.PullDecl): void;
        public popEnclosingDecl(): void;
        public getEnclosingDecl(kind?: TypeScript.PullElementKind): TypeScript.PullDecl;
        public getEnclosingNonLambdaDecl(): TypeScript.PullDecl;
        public getEnclosingClassDecl(): TypeScript.PullDecl;
        public getEnclosingDeclHasReturn(): boolean;
        public setEnclosingDeclHasReturn(): boolean;
    }
    class PullTypeChecker {
        private compilationSettings;
        public semanticInfoChain: TypeScript.SemanticInfoChain;
        static globalPullTypeCheckPhase: number;
        public resolver: TypeScript.PullTypeResolver;
        private context;
        constructor(compilationSettings: TypeScript.CompilationSettings, semanticInfoChain: TypeScript.SemanticInfoChain);
        public setUnit(unitPath: string): void;
        private getScriptDecl(fileName);
        private checkForResolutionError(typeSymbol, decl);
        private postError(offset, length, fileName, diagnosticCode, arguments, enclosingDecl);
        private validateVariableDeclarationGroups(enclosingDecl, typeCheckContext);
        private typeCheckAST(ast, typeCheckContext, inContextuallyTypedAssignment);
        public typeCheckScript(script: TypeScript.Script, scriptName: string, compiler: TypeScript.TypeScriptCompiler): void;
        private typeCheckList(list, typeCheckContext);
        private reportDiagnostics(symbolAndDiagnostics, enclosingDecl);
        private resolveSymbolAndReportDiagnostics(ast, inContextuallyTypedAssignment, enclosingDecl);
        private typeCheckBoundDecl(ast, typeCheckContext);
        private typeCheckImportDeclaration(importDeclaration, typeCheckContext);
        private typeCheckFunction(funcDeclAST, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckFunctionOverloads(funcDecl, typeCheckContext, signature?, allSignatures?);
        private typeCheckTypeParameter(typeParameter, typeCheckContext);
        private typeCheckAccessor(ast, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckConstructor(funcDeclAST, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckIndexer(ast, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckMembersAgainstIndexer(containerType, typeCheckContext);
        private checkThatMemberIsSubtypeOfIndexer(member, indexSignature, astForError, typeCheckContext, isNumeric);
        private typeCheckIfTypeMemberPropertyOkToOverride(typeSymbol, extendedType, typeMember, extendedTypeMember, comparisonInfo);
        private typeCheckIfTypeExtendsType(typeDecl, typeSymbol, extendedType, typeCheckContext);
        private typeCheckIfClassImplementsType(classDecl, classSymbol, implementedType, typeCheckContext);
        private typeCheckBase(typeDeclAst, typeSymbol, baseDeclAST, isExtendedType, typeCheckContext);
        private typeCheckBases(typeDeclAst, typeSymbol, typeCheckContext);
        private typeCheckClass(ast, typeCheckContext);
        private typeCheckInterface(ast, typeCheckContext);
        private typeCheckModule(ast, typeCheckContext);
        private checkAssignability(ast, source, target, typeCheckContext);
        private isValidLHS(ast, expressionSymbol);
        private typeCheckAssignment(binaryExpression, typeCheckContext);
        private typeCheckGenericType(genericType, typeCheckContext);
        private typeCheckObjectLiteral(ast, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckArrayLiteral(ast, typeCheckContext, inContextuallyTypedAssignment);
        private enclosingClassIsDerived(typeCheckContext);
        private isSuperCallNode(node);
        private getFirstStatementFromFunctionDeclAST(funcDeclAST);
        private superCallMustBeFirstStatementInConstructor(enclosingConstructor, enclosingClass);
        private checkForThisOrSuperCaptureInArrowFunction(expression, typeCheckContext);
        private typeCheckThisExpression(thisExpressionAST, typeCheckContext);
        private typeCheckSuperExpression(ast, typeCheckContext);
        private typeCheckCallExpression(callExpression, typeCheckContext);
        private typeCheckObjectCreationExpression(callExpression, typeCheckContext);
        private typeCheckTypeAssertion(ast, typeCheckContext);
        private typeCheckLogicalOperation(binex, typeCheckContext);
        private typeCheckLogicalAndOrExpression(binex, typeCheckContext);
        private typeCheckCommaExpression(binex, typeCheckContext);
        private typeCheckBinaryAdditionOperation(binaryExpression, typeCheckContext);
        private typeCheckBinaryArithmeticOperation(binaryExpression, typeCheckContext);
        private typeCheckLogicalNotExpression(unaryExpression, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckUnaryArithmeticOperation(unaryExpression, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckElementAccessExpression(binaryExpression, typeCheckContext);
        private typeCheckTypeOf(ast, typeCheckContext);
        private typeCheckTypeReference(typeRef, typeCheckContext);
        private typeCheckExportAssignment(ast, typeCheckContext);
        private typeCheckFunctionTypeSignature(funcDeclAST, enclosingDecl, typeCheckContext);
        private typeCheckInterfaceTypeReference(interfaceAST, enclosingDecl, typeCheckContext);
        private typeCheckConditionalExpression(conditionalExpression, typeCheckContext);
        private typeCheckThrowStatement(throwStatement, typeCheckContext);
        private typeCheckDeleteExpression(unaryExpression, typeCheckContext);
        private typeCheckVoidExpression(unaryExpression, typeCheckContext);
        private typeCheckRegExpExpression(ast, typeCheckContext);
        private typeCheckForStatement(forStatement, typeCheckContext);
        private typeCheckForInStatement(ast, typeCheckContext);
        private typeCheckInExpression(binaryExpression, typeCheckContext);
        private typeCheckInstanceOfExpression(binaryExpression, typeCheckContext);
        private typeCheckParenthesizedExpression(parenthesizedExpression, typeCheckContext);
        private typeCheckWhileStatement(whileStatement, typeCheckContext);
        private typeCheckDoStatement(doStatement, typeCheckContext);
        private typeCheckIfStatement(ifStatement, typeCheckContext);
        private typeCheckBlock(block, typeCheckContext);
        private typeCheckVariableDeclaration(variableDeclaration, typeCheckContext);
        private typeCheckVariableStatement(variableStatement, typeCheckContext);
        private typeCheckWithStatement(withStatement, typeCheckContext);
        private typeCheckTryStatement(tryStatement, typeCheckContext);
        private typeCheckCatchClause(catchClause, typeCheckContext);
        private typeCheckReturnStatement(returnAST, typeCheckContext);
        private typeCheckNameExpression(ast, typeCheckContext);
        private checkForSuperMemberAccess(memberAccessExpression, typeCheckContext, resolvedName);
        private checkForPrivateMemberAccess(memberAccessExpression, typeCheckContext, expressionType, resolvedName);
        private checkForStaticMemberAccess(memberAccessExpression, typeCheckContext, expressionType, resolvedName);
        private typeCheckMemberAccessExpression(memberAccessExpression, typeCheckContext);
        private typeCheckSwitchStatement(switchStatement, typeCheckContext);
        private typeCheckExpressionStatement(ast, typeCheckContext, inContextuallyTypedAssignment);
        private typeCheckCaseClause(caseClause, typeCheckContext);
        private typeCheckLabeledStatement(labeledStatement, typeCheckContext);
        private checkTypePrivacy(declSymbol, typeSymbol, typeCheckContext, privacyErrorReporter);
        private checkTypePrivacyOfSignatures(declSymbol, signatures, typeCheckContext, privacyErrorReporter);
        private baseListPrivacyErrorReporter(declAST, declSymbol, baseAst, isExtendedType, typeSymbol, typeCheckContext);
        private variablePrivacyErrorReporter(declSymbol, typeSymbol, typeCheckContext);
        private checkFunctionTypePrivacy(funcDeclAST, inContextuallyTypedAssignment, typeCheckContext);
        private functionArgumentTypePrivacyErrorReporter(declAST, argIndex, paramSymbol, typeSymbol, typeCheckContext);
        private functionReturnTypePrivacyErrorReporter(declAST, funcReturnType, typeSymbol, typeCheckContext);
    }
}
declare module TypeScript {
    enum PullDeclEdit {
        NoChanges,
        DeclAdded,
        DeclRemoved,
        DeclChanged,
    }
    class PullDeclDiff {
        public oldDecl: TypeScript.PullDecl;
        public newDecl: TypeScript.PullDecl;
        public kind: PullDeclEdit;
        constructor(oldDecl: TypeScript.PullDecl, newDecl: TypeScript.PullDecl, kind: PullDeclEdit);
    }
    class PullDeclDiffer {
        private oldSemanticInfo;
        private newSemanticInfo;
        private differences;
        constructor(oldSemanticInfo: TypeScript.SemanticInfo, newSemanticInfo: TypeScript.SemanticInfo);
        static diffDecls(oldDecl: TypeScript.PullDecl, oldSemanticInfo: TypeScript.SemanticInfo, newDecl: TypeScript.PullDecl, newSemanticInfo: TypeScript.SemanticInfo): PullDeclDiff[];
        private diff(oldDecl, newDecl);
        private static emptyDeclArray;
        private diff1(oldDecl, newDecl, oldAST, newAST, oldNameToDecls, newNameToDecls);
        private isEquivalent(oldAST, newAST);
        private importDeclarationIsEquivalent(decl1, decl2);
        private typeDeclarationIsEquivalent(decl1, decl2);
        private classDeclarationIsEquivalent(decl1, decl2);
        private interfaceDeclarationIsEquivalent(decl1, decl2);
        private typeParameterIsEquivalent(decl1, decl2);
        private boundDeclarationIsEquivalent(decl1, decl2);
        private argumentDeclarationIsEquivalent(decl1, decl2);
        private variableDeclarationIsEquivalent(decl1, decl2);
        private functionDeclarationIsEquivalent(decl1, decl2);
        private catchClauseIsEquivalent(decl1, decl2);
        private withStatementIsEquivalent(decl1, decl2);
        private scriptIsEquivalent(decl1, decl2);
        private moduleDeclarationIsEquivalent(decl1, decl2);
    }
}
declare module TypeScript {
    var declCacheHit: number;
    var declCacheMiss: number;
    var symbolCacheHit: number;
    var symbolCacheMiss: number;
    class SemanticInfo {
        private compilationUnitPath;
        private topLevelDecls;
        private topLevelSynthesizedDecls;
        private astDeclMap;
        private declASTMap;
        private syntaxElementDeclMap;
        private declSyntaxElementMap;
        private astSymbolMap;
        private symbolASTMap;
        private syntaxElementSymbolMap;
        private symbolSyntaxElementMap;
        private properties;
        private hasBeenTypeChecked;
        constructor(compilationUnitPath: string);
        public addTopLevelDecl(decl: TypeScript.PullDecl): void;
        public setTypeChecked(): void;
        public getTypeChecked(): boolean;
        public invalidate(): void;
        public getTopLevelDecls(): TypeScript.PullDecl[];
        public getPath(): string;
        public addSynthesizedDecl(decl: TypeScript.PullDecl): void;
        public getSynthesizedDecls(): TypeScript.PullDecl[];
        public getDeclForAST(ast: TypeScript.AST): TypeScript.PullDecl;
        public setDeclForAST(ast: TypeScript.AST, decl: TypeScript.PullDecl): void;
        private getDeclKey(decl);
        public getASTForDecl(decl: TypeScript.PullDecl): TypeScript.AST;
        public setASTForDecl(decl: TypeScript.PullDecl, ast: TypeScript.AST): void;
        public setSymbolAndDiagnosticsForAST<TSymbol extends TypeScript.PullSymbol>(ast: TypeScript.AST, symbolAndDiagnostics: TypeScript.SymbolAndDiagnostics<TSymbol>): void;
        public getSymbolAndDiagnosticsForAST(ast: TypeScript.AST): TypeScript.SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public getASTForSymbol(symbol: TypeScript.PullSymbol): TypeScript.AST;
        public getSyntaxElementForDecl(decl: TypeScript.PullDecl): TypeScript.ISyntaxElement;
        public setSyntaxElementForDecl(decl: TypeScript.PullDecl, syntaxElement: TypeScript.ISyntaxElement): void;
        public getDeclForSyntaxElement(syntaxElement: TypeScript.ISyntaxElement): TypeScript.PullDecl;
        public setDeclForSyntaxElement(syntaxElement: TypeScript.ISyntaxElement, decl: TypeScript.PullDecl): void;
        public getSyntaxElementForSymbol(symbol: TypeScript.PullSymbol): TypeScript.ISyntaxElement;
        public getSymbolForSyntaxElement(syntaxElement: TypeScript.ISyntaxElement): TypeScript.PullSymbol;
        public setSymbolForSyntaxElement(syntaxElement: TypeScript.ISyntaxElement, symbol: TypeScript.PullSymbol): void;
        public getDiagnostics(semanticErrors: TypeScript.IDiagnostic[]): void;
        public getProperties(): SemanticInfoProperties;
    }
    class SemanticInfoProperties {
        public unitContainsBool: boolean;
    }
    class SemanticInfoChain {
        public units: SemanticInfo[];
        private declCache;
        private symbolCache;
        private unitCache;
        private declSymbolMap;
        public anyTypeSymbol: TypeScript.PullTypeSymbol;
        public booleanTypeSymbol: TypeScript.PullTypeSymbol;
        public numberTypeSymbol: TypeScript.PullTypeSymbol;
        public stringTypeSymbol: TypeScript.PullTypeSymbol;
        public nullTypeSymbol: TypeScript.PullTypeSymbol;
        public undefinedTypeSymbol: TypeScript.PullTypeSymbol;
        public elementTypeSymbol: TypeScript.PullTypeSymbol;
        public voidTypeSymbol: TypeScript.PullTypeSymbol;
        public addPrimitiveType(name: string, globalDecl: TypeScript.PullDecl): TypeScript.PullPrimitiveTypeSymbol;
        public addPrimitiveValue(name: string, type: TypeScript.PullTypeSymbol, globalDecl: TypeScript.PullDecl): void;
        public getGlobalDecl(): TypeScript.PullDecl;
        constructor();
        public addUnit(unit: SemanticInfo): void;
        public getUnit(compilationUnitPath: string): SemanticInfo;
        public updateUnit(oldUnit: SemanticInfo, newUnit: SemanticInfo): void;
        private collectAllTopLevelDecls();
        private collectAllSynthesizedDecls();
        private getDeclPathCacheID(declPath, declKind);
        public findDecls(declPath: string[], declKind: TypeScript.PullElementKind): TypeScript.PullDecl[];
        public findSymbol(declPath: string[], declType: TypeScript.PullElementKind): TypeScript.PullSymbol;
        public cacheGlobalSymbol(symbol: TypeScript.PullSymbol, kind: TypeScript.PullElementKind): void;
        private cleanDecl(decl);
        private cleanAllDecls();
        public update(): void;
        public invalidateUnit(compilationUnitPath: string): void;
        public getDeclForAST(ast: TypeScript.AST, unitPath: string): TypeScript.PullDecl;
        public getASTForDecl(decl: TypeScript.PullDecl): TypeScript.AST;
        public getSymbolAndDiagnosticsForAST(ast: TypeScript.AST, unitPath: string): TypeScript.SymbolAndDiagnostics<TypeScript.PullSymbol>;
        public getASTForSymbol(symbol: TypeScript.PullSymbol, unitPath: string): TypeScript.AST;
        public setSymbolAndDiagnosticsForAST(ast: TypeScript.AST, symbolAndDiagnostics: TypeScript.SymbolAndDiagnostics<TypeScript.PullSymbol>, unitPath: string): void;
        public setSymbolForDecl(decl: TypeScript.PullDecl, symbol: TypeScript.PullSymbol): void;
        public getSymbolForDecl(decl): TypeScript.PullSymbol;
        public removeSymbolFromCache(symbol: TypeScript.PullSymbol): void;
        public postDiagnostics(): TypeScript.IDiagnostic[];
    }
}
declare module TypeScript {
    class DeclCollectionContext {
        public semanticInfo: TypeScript.SemanticInfo;
        public scriptName: string;
        public parentChain: TypeScript.PullDecl[];
        constructor(semanticInfo: TypeScript.SemanticInfo, scriptName?: string);
        public getParent(): TypeScript.PullDecl;
        public pushParent(parentDecl: TypeScript.PullDecl): void;
        public popParent(): void;
        public foundValueDecl: boolean;
    }
    function preCollectImportDecls(ast: AST, parentAST: AST, context: DeclCollectionContext): boolean;
    function preCollectModuleDecls(ast: AST, parentAST: AST, context: DeclCollectionContext): boolean;
    function preCollectClassDecls(classDecl: ClassDeclaration, parentAST: AST, context: DeclCollectionContext): boolean;
    function createObjectTypeDeclaration(interfaceDecl: InterfaceDeclaration, context: DeclCollectionContext): boolean;
    function preCollectInterfaceDecls(interfaceDecl: InterfaceDeclaration, parentAST: AST, context: DeclCollectionContext): boolean;
    function preCollectParameterDecl(argDecl: Parameter, parentAST: AST, context: DeclCollectionContext): boolean;
    function preCollectTypeParameterDecl(typeParameterDecl: TypeParameter, parentAST: AST, context: DeclCollectionContext): boolean;
    function createPropertySignature(propertyDecl: VariableDeclarator, context: DeclCollectionContext): boolean;
    function createMemberVariableDeclaration(memberDecl: VariableDeclarator, context: DeclCollectionContext): boolean;
    function createVariableDeclaration(varDecl: VariableDeclarator, context: DeclCollectionContext): boolean;
    function preCollectVarDecls(ast: AST, parentAST: AST, context: DeclCollectionContext): boolean;
    function createFunctionTypeDeclaration(functionTypeDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createConstructorTypeDeclaration(constructorTypeDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createFunctionDeclaration(funcDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createFunctionExpressionDeclaration(functionExpressionDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createMemberFunctionDeclaration(memberFunctionDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createIndexSignatureDeclaration(indexSignatureDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createCallSignatureDeclaration(callSignatureDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createConstructSignatureDeclaration(constructSignatureDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createClassConstructorDeclaration(constructorDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createGetAccessorDeclaration(getAccessorDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function createSetAccessorDeclaration(setAccessorDeclAST: FunctionDeclaration, context: DeclCollectionContext): boolean;
    function preCollectCatchDecls(ast: AST, parentAST: AST, context: DeclCollectionContext): boolean;
    function preCollectWithDecls(ast: AST, parentAST: AST, context: DeclCollectionContext): boolean;
    function preCollectFuncDecls(ast: AST, parentAST: AST, context: DeclCollectionContext): boolean;
    function preCollectDecls(ast: AST, parentAST: AST, walker: IAstWalker): AST;
    function postCollectDecls(ast: AST, parentAST: AST, walker: IAstWalker): AST;
}
declare module TypeScript {
    var globalBindingPhase: number;
    function getPathToDecl(decl: PullDecl): PullDecl[];
    function findSymbolInContext(name: string, declKind: PullElementKind, startingDecl: PullDecl): PullSymbol;
    class PullSymbolBinder {
        public semanticInfoChain: TypeScript.SemanticInfoChain;
        private bindingPhase;
        private functionTypeParameterCache;
        private findTypeParameterInCache(name);
        private addTypeParameterToCache(typeParameter);
        private resetTypeParameterCache();
        public semanticInfo: TypeScript.SemanticInfo;
        public reBindingAfterChange: boolean;
        public startingDeclForRebind: number;
        public startingSymbolForRebind: number;
        constructor(semanticInfoChain: TypeScript.SemanticInfoChain);
        public setUnit(fileName: string): void;
        public getParent(decl: TypeScript.PullDecl, returnInstanceType?: boolean): TypeScript.PullTypeSymbol;
        public findDeclsInContext(startingDecl: TypeScript.PullDecl, declKind: TypeScript.PullElementKind, searchGlobally: boolean): TypeScript.PullDecl[];
        public symbolIsRedeclaration(sym: TypeScript.PullSymbol): boolean;
        public bindModuleDeclarationToPullSymbol(moduleContainerDecl: TypeScript.PullDecl): void;
        public bindImportDeclaration(importDeclaration: TypeScript.PullDecl): void;
        private cleanInterfaceSignatures(interfaceSymbol);
        private cleanClassSignatures(classSymbol);
        public bindClassDeclarationToPullSymbol(classDecl: TypeScript.PullDecl): void;
        public bindInterfaceDeclarationToPullSymbol(interfaceDecl: TypeScript.PullDecl): void;
        public bindObjectTypeDeclarationToPullSymbol(objectDecl: TypeScript.PullDecl): void;
        public bindConstructorTypeDeclarationToPullSymbol(constructorTypeDeclaration: TypeScript.PullDecl): void;
        public bindVariableDeclarationToPullSymbol(variableDeclaration: TypeScript.PullDecl): void;
        public bindPropertyDeclarationToPullSymbol(propertyDeclaration: TypeScript.PullDecl): void;
        public bindParameterSymbols(funcDecl: TypeScript.FunctionDeclaration, funcType: TypeScript.PullTypeSymbol, signatureSymbol: TypeScript.PullSignatureSymbol): void;
        public bindFunctionDeclarationToPullSymbol(functionDeclaration: TypeScript.PullDecl): void;
        public bindFunctionExpressionToPullSymbol(functionExpressionDeclaration: TypeScript.PullDecl): void;
        public bindFunctionTypeDeclarationToPullSymbol(functionTypeDeclaration: TypeScript.PullDecl): void;
        public bindMethodDeclarationToPullSymbol(methodDeclaration: TypeScript.PullDecl): void;
        public bindConstructorDeclarationToPullSymbol(constructorDeclaration: TypeScript.PullDecl): void;
        public bindConstructSignatureDeclarationToPullSymbol(constructSignatureDeclaration: TypeScript.PullDecl): void;
        public bindCallSignatureDeclarationToPullSymbol(callSignatureDeclaration: TypeScript.PullDecl): void;
        public bindIndexSignatureDeclarationToPullSymbol(indexSignatureDeclaration: TypeScript.PullDecl): void;
        public bindGetAccessorDeclarationToPullSymbol(getAccessorDeclaration: TypeScript.PullDecl): void;
        public bindSetAccessorDeclarationToPullSymbol(setAccessorDeclaration: TypeScript.PullDecl): void;
        public bindCatchBlockPullSymbols(catchBlockDecl: TypeScript.PullDecl): void;
        public bindWithBlockPullSymbols(withBlockDecl: TypeScript.PullDecl): void;
        public bindDeclToPullSymbol(decl: TypeScript.PullDecl, rebind?: boolean): void;
        public bindDeclsForUnit(filePath: string, rebind?: boolean): void;
    }
}
declare module TypeScript {
    var linkID: number;
    class IListItem {
        public value: any;
        public next: IListItem;
        public prev: IListItem;
        constructor(value: any);
    }
    class LinkList {
        public head: IListItem;
        public last: IListItem;
        public length: number;
        public addItem(item: any): void;
        public find(p: (rn: any) => boolean): any[];
        public remove(p: (item: any) => boolean): void;
        public update(map: (item: any, context: any) => void, context: any): void;
    }
    class PullSymbolLink {
        public start: TypeScript.PullSymbol;
        public end: TypeScript.PullSymbol;
        public kind: TypeScript.SymbolLinkKind;
        public id: number;
        public data: any;
        constructor(start: TypeScript.PullSymbol, end: TypeScript.PullSymbol, kind: TypeScript.SymbolLinkKind);
    }
    enum GraphUpdateKind {
        NoUpdate,
        SymbolRemoved,
        SymbolAdded,
        TypeChanged,
    }
    class PullSymbolUpdate {
        public updateKind: GraphUpdateKind;
        public symbolToUpdate: TypeScript.PullSymbol;
        public updater: PullSymbolGraphUpdater;
        constructor(updateKind: GraphUpdateKind, symbolToUpdate: TypeScript.PullSymbol, updater: PullSymbolGraphUpdater);
    }
    var updateVersion: number;
    class PullSymbolGraphUpdater {
        public semanticInfoChain: TypeScript.SemanticInfoChain;
        constructor(semanticInfoChain: TypeScript.SemanticInfoChain);
        public removeDecl(declToRemove: TypeScript.PullDecl): void;
        public addDecl(declToAdd: TypeScript.PullDecl): void;
        public removeSymbol(symbolToRemove: TypeScript.PullSymbol): void;
        public addSymbol(symbolToAdd: TypeScript.PullSymbol): void;
        public invalidateType(symbolWhoseTypeChanged: TypeScript.PullSymbol): void;
        public invalidateUnitsForSymbol(symbol: TypeScript.PullSymbol): void;
    }
    function propagateRemovalToOutgoingLinks(link: PullSymbolLink, update: PullSymbolUpdate): void;
    function propagateRemovalToIncomingLinks(link: PullSymbolLink, update: PullSymbolUpdate): void;
    function propagateAdditionToOutgoingLinks(link: PullSymbolLink, update: PullSymbolUpdate): void;
    function propagateAdditionToIncomingLinks(link: PullSymbolLink, update: PullSymbolUpdate): void;
    function propagateChangedTypeToOutgoingLinks(link: PullSymbolLink, update: PullSymbolUpdate): void;
    function propagateChangedTypeToIncomingLinks(link: PullSymbolLink, update: PullSymbolUpdate): void;
}
declare module TypeScript {
    class SemanticDiagnostic extends TypeScript.Diagnostic {
        static equals(diagnostic1: SemanticDiagnostic, diagnostic2: SemanticDiagnostic): boolean;
    }
    function getDiagnosticsFromEnclosingDecl(enclosingDecl: PullDecl, errors: IDiagnostic[]): void;
}
declare module TypeScript.PullHelpers {
    interface SignatureInfoForFuncDecl {
        signature: TypeScript.PullSignatureSymbol;
        allSignatures: TypeScript.PullSignatureSymbol[];
    }
    function getSignatureForFuncDecl(funcDecl: TypeScript.FunctionDeclaration, semanticInfo: TypeScript.SemanticInfo): {
        signature: TypeScript.PullSignatureSymbol;
        allSignatures: TypeScript.PullSignatureSymbol[];
    };
    function getAccessorSymbol(getterOrSetter: TypeScript.FunctionDeclaration, semanticInfoChain: TypeScript.SemanticInfoChain, unitPath: string): TypeScript.PullAccessorSymbol;
    function getGetterAndSetterFunction(funcDecl: TypeScript.FunctionDeclaration, semanticInfoChain: TypeScript.SemanticInfoChain, unitPath: string): {
        getter: TypeScript.FunctionDeclaration;
        setter: TypeScript.FunctionDeclaration;
    };
    function symbolIsEnum(source: TypeScript.PullSymbol);
    function symbolIsModule(symbol: TypeScript.PullSymbol): boolean;
}
declare module TypeScript {
    class SyntaxPositionMap {
        private position;
        private elementToPosition;
        constructor(node: TypeScript.SyntaxNode);
        private process(element);
        static create(node: TypeScript.SyntaxNode): SyntaxPositionMap;
        public fullStart(element: TypeScript.ISyntaxElement): number;
        public start(element: TypeScript.ISyntaxElement): number;
        public end(element: TypeScript.ISyntaxElement): number;
        public fullEnd(element: TypeScript.ISyntaxElement): number;
    }
    class SyntaxTreeToAstVisitor implements TypeScript.ISyntaxVisitor {
        private syntaxPositionMap;
        private fileName;
        private lineMap;
        private compilationSettings;
        static checkPositions: boolean;
        private position;
        private requiresExtendsBlock;
        private previousTokenTrailingComments;
        private isParsingDeclareFile;
        private isParsingAmbientModule;
        private containingModuleHasExportAssignment;
        private static protoString;
        private static protoSubstitutionString;
        constructor(syntaxPositionMap: SyntaxPositionMap, fileName: string, lineMap: TypeScript.LineMap, compilationSettings: TypeScript.CompilationSettings);
        static visit(syntaxTree: TypeScript.SyntaxTree, fileName: string, compilationSettings: TypeScript.CompilationSettings): TypeScript.Script;
        private assertElementAtPosition(element);
        private movePast(element);
        private moveTo(element1, element2);
        private applyDelta(ast, delta);
        private setSpan(span, fullStart, element);
        private setSpanExplicit(span, start, end);
        private identifierFromToken(token, isOptional, useValueText);
        private getAST(element);
        private setAST(element, ast);
        public visitSyntaxList(list: TypeScript.ISyntaxList): TypeScript.ASTList;
        public visitSeparatedSyntaxList(list: TypeScript.ISeparatedSyntaxList): TypeScript.ASTList;
        private createRef(text, minChar);
        private convertComment(trivia, commentStartPosition, hasTrailingNewLine);
        private convertComments(triviaList, commentStartPosition);
        private mergeComments(comments1, comments2);
        private convertTokenLeadingComments(token, commentStartPosition);
        private convertTokenTrailingComments(token, commentStartPosition);
        private convertNodeLeadingComments(node, nodeStart);
        private convertNodeTrailingComments(node, nodeStart);
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.Expression;
        private getLeadingComments(node);
        private hasTopLevelImportOrExport(node);
        private getAmdDependency(comment);
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): TypeScript.Script;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): any;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): any;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): TypeScript.ClassDeclaration;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): TypeScript.InterfaceDeclaration;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): TypeScript.ASTList;
        private getModuleNames(node);
        private getModuleNamesHelper(name, result);
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): TypeScript.ModuleDeclaration;
        private hasDotDotDotParameter(parameters);
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): TypeScript.FunctionDeclaration;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): TypeScript.ModuleDeclaration;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): void;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): TypeScript.ImportDeclaration;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): TypeScript.ExportAssignment;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): TypeScript.VariableStatement;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): TypeScript.VariableDeclaration;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): TypeScript.VariableDeclarator;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): TypeScript.Expression;
        private getUnaryExpressionNodeType(kind);
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): TypeScript.UnaryExpression;
        private isOnSingleLine(start, end);
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): TypeScript.UnaryExpression;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): TypeScript.OmittedExpression;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): TypeScript.ParenthesizedExpression;
        private getArrowFunctionStatements(body);
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): TypeScript.FunctionDeclaration;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): TypeScript.FunctionDeclaration;
        public visitType(type: TypeScript.ITypeSyntax): TypeScript.TypeReference;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): TypeScript.TypeReference;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): TypeScript.ASTList;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): TypeScript.TypeReference;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): TypeScript.TypeReference;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): TypeScript.TypeReference;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): TypeScript.TypeReference;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): TypeScript.TypeReference;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): TypeScript.TypeReference;
        public visitBlock(node: TypeScript.BlockSyntax): TypeScript.Block;
        public visitParameter(node: TypeScript.ParameterSyntax): TypeScript.Parameter;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): TypeScript.BinaryExpression;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): TypeScript.UnaryExpression;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): TypeScript.BinaryExpression;
        private convertArgumentListArguments(node);
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): TypeScript.CallExpression;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): TypeScript.ASTList;
        private getBinaryExpressionNodeType(node);
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): TypeScript.BinaryExpression;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): TypeScript.ConditionalExpression;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): TypeScript.FunctionDeclaration;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): TypeScript.FunctionDeclaration;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): TypeScript.FunctionDeclaration;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): TypeScript.VariableDeclarator;
        public visitParameterList(node: TypeScript.ParameterListSyntax): TypeScript.ASTList;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): TypeScript.FunctionDeclaration;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): TypeScript.ASTList;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): TypeScript.TypeParameter;
        public visitConstraint(node: TypeScript.ConstraintSyntax): TypeScript.TypeReference;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): TypeScript.IfStatement;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): TypeScript.Statement;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): TypeScript.ExpressionStatement;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): TypeScript.FunctionDeclaration;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): TypeScript.FunctionDeclaration;
        public visitMemberAccessorDeclaration(node: TypeScript.MemberAccessorDeclarationSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.FunctionDeclaration;
        public visitGetMemberAccessorDeclaration(node: TypeScript.GetMemberAccessorDeclarationSyntax): TypeScript.FunctionDeclaration;
        public visitSetMemberAccessorDeclaration(node: TypeScript.SetMemberAccessorDeclarationSyntax): TypeScript.FunctionDeclaration;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): TypeScript.VariableDeclarator;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): TypeScript.ThrowStatement;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): TypeScript.ReturnStatement;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): TypeScript.CallExpression;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): TypeScript.SwitchStatement;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): TypeScript.CaseClause;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): TypeScript.CaseClause;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): TypeScript.Jump;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): TypeScript.Jump;
        public visitForStatement(node: TypeScript.ForStatementSyntax): TypeScript.ForStatement;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): TypeScript.ForInStatement;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): TypeScript.WhileStatement;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): TypeScript.WithStatement;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): TypeScript.UnaryExpression;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): TypeScript.UnaryExpression;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): TypeScript.BinaryExpression;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): TypeScript.BinaryExpression;
        public visitGetAccessorPropertyAssignment(node: TypeScript.GetAccessorPropertyAssignmentSyntax): TypeScript.BinaryExpression;
        public visitSetAccessorPropertyAssignment(node: TypeScript.SetAccessorPropertyAssignmentSyntax): TypeScript.BinaryExpression;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): TypeScript.FunctionDeclaration;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): TypeScript.EmptyStatement;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): TypeScript.TryStatement;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): TypeScript.CatchClause;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): TypeScript.Block;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): TypeScript.LabeledStatement;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): TypeScript.DoStatement;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): TypeScript.UnaryExpression;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): TypeScript.UnaryExpression;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): TypeScript.UnaryExpression;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): TypeScript.DebuggerStatement;
    }
}
declare module TypeScript {
    interface EmitterIOHost {
        writeFile(path: string, contents: string, writeByteOrderMark: boolean): void;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        resolvePath(path: string): string;
    }
    interface PullTypeInfoAtPositionInfo {
        symbol: TypeScript.PullSymbol;
        ast: TypeScript.AST;
        enclosingScopeSymbol: TypeScript.PullSymbol;
        candidateSignature: TypeScript.PullSignatureSymbol;
        callSignatures: TypeScript.PullSignatureSymbol[];
        isConstructorCall: boolean;
    }
    interface PullSymbolInfo {
        symbol: TypeScript.PullSymbol;
        ast: TypeScript.AST;
        enclosingScopeSymbol: TypeScript.PullSymbol;
    }
    interface PullCallSymbolInfo {
        targetSymbol: TypeScript.PullSymbol;
        resolvedSignatures: TypeScript.PullSignatureSymbol[];
        candidateSignature: TypeScript.PullSignatureSymbol;
        isConstructorCall: boolean;
        ast: TypeScript.AST;
        enclosingScopeSymbol: TypeScript.PullSymbol;
    }
    interface PullVisibleSymbolsInfo {
        symbols: TypeScript.PullSymbol[];
        enclosingScopeSymbol: TypeScript.PullSymbol;
    }
    class Document {
        public fileName: string;
        private compilationSettings;
        private scriptSnapshot;
        public byteOrderMark: ByteOrderMark;
        public version: number;
        public isOpen: boolean;
        private _diagnostics;
        private _syntaxTree;
        private _bloomFilter;
        public script: TypeScript.Script;
        public lineMap: TypeScript.LineMap;
        constructor(fileName: string, compilationSettings: TypeScript.CompilationSettings, scriptSnapshot: TypeScript.IScriptSnapshot, byteOrderMark: ByteOrderMark, version: number, isOpen: boolean, syntaxTree: TypeScript.SyntaxTree);
        public diagnostics(): TypeScript.IDiagnostic[];
        public syntaxTree(): TypeScript.SyntaxTree;
        public bloomFilter(): TypeScript.BloomFilter;
        public update(scriptSnapshot: TypeScript.IScriptSnapshot, version: number, isOpen: boolean, textChangeRange: TypeScript.TextChangeRange, settings: TypeScript.CompilationSettings): Document;
        static create(fileName: string, scriptSnapshot: TypeScript.IScriptSnapshot, byteOrderMark: ByteOrderMark, version: number, isOpen: boolean, referencedFiles: TypeScript.IFileReference[], compilationSettings): Document;
    }
    var globalSemanticInfoChain: SemanticInfoChain;
    var globalBinder: PullSymbolBinder;
    var globalLogger: ILogger;
    class TypeScriptCompiler {
        public logger: TypeScript.ILogger;
        public settings: TypeScript.CompilationSettings;
        public diagnosticMessages: TypeScript.IDiagnosticMessages;
        public pullTypeChecker: TypeScript.PullTypeChecker;
        public semanticInfoChain: TypeScript.SemanticInfoChain;
        public emitOptions: TypeScript.EmitOptions;
        public fileNameToDocument: TypeScript.StringHashTable<Document>;
        constructor(logger?: TypeScript.ILogger, settings?: TypeScript.CompilationSettings, diagnosticMessages?: TypeScript.IDiagnosticMessages);
        public getDocument(fileName: string): Document;
        public timeFunction(funcDescription: string, func: () => any): any;
        public addSourceUnit(fileName: string, scriptSnapshot: TypeScript.IScriptSnapshot, byteOrderMark: ByteOrderMark, version: number, isOpen: boolean, referencedFiles?: TypeScript.IFileReference[]): Document;
        public updateSourceUnit(fileName: string, scriptSnapshot: TypeScript.IScriptSnapshot, version: number, isOpen: boolean, textChangeRange: TypeScript.TextChangeRange): Document;
        private isDynamicModuleCompilation();
        private updateCommonDirectoryPath();
        public parseEmitOption(ioHost: EmitterIOHost): TypeScript.IDiagnostic;
        public getScripts(): TypeScript.Script[];
        private writeByteOrderMarkForDocument(document);
        static mapToDTSFileName(fileName: string, wholeFileNameReplaced: boolean): string;
        private canEmitDeclarations(script?);
        private emitDeclarations(document, declarationEmitter?);
        public emitAllDeclarations(): TypeScript.IDiagnostic[];
        public emitUnitDeclarations(fileName: string): TypeScript.IDiagnostic[];
        static mapToFileNameExtension(extension: string, fileName: string, wholeFileNameReplaced: boolean): string;
        static mapToJSFileName(fileName: string, wholeFileNameReplaced: boolean): string;
        private emit(document, inputOutputMapper?, emitter?);
        public emitAll(ioHost: EmitterIOHost, inputOutputMapper?: (inputFile: string, outputFile: string) => void): TypeScript.IDiagnostic[];
        public emitUnit(fileName: string, ioHost: EmitterIOHost, inputOutputMapper?: (inputFile: string, outputFile: string) => void): TypeScript.IDiagnostic[];
        private createFile(fileName, writeByteOrderMark);
        public getSyntacticDiagnostics(fileName: string): TypeScript.IDiagnostic[];
        private getSyntaxTree(fileName);
        private getScript(fileName);
        public getSemanticDiagnostics(fileName: string): TypeScript.IDiagnostic[];
        public pullTypeCheck();
        private pullUpdateScript(oldDocument, newDocument);
        public getSymbolOfDeclaration(decl: TypeScript.PullDecl): TypeScript.PullSymbol;
        public resolvePosition(pos: number, document: Document): PullTypeInfoAtPositionInfo;
        private extractResolutionContextFromPath(path, document);
        public pullGetSymbolInformationFromPath(path: TypeScript.AstPath, document: Document): PullSymbolInfo;
        public pullGetDeclarationSymbolInformation(path: TypeScript.AstPath, document: Document): PullSymbolInfo;
        public pullGetCallInformationFromPath(path: TypeScript.AstPath, document: Document): PullCallSymbolInfo;
        public pullGetVisibleMemberSymbolsFromPath(path: TypeScript.AstPath, document: Document): PullVisibleSymbolsInfo;
        public pullGetVisibleDeclsFromPath(path: TypeScript.AstPath, document: Document): TypeScript.PullDecl[];
        public pullGetContextualMembersFromPath(path: TypeScript.AstPath, document: Document): PullVisibleSymbolsInfo;
        public pullGetDeclInformation(decl: TypeScript.PullDecl, path: TypeScript.AstPath, document: Document): PullSymbolInfo;
        public pullGetTypeInfoAtPosition(pos: number, document: Document): PullTypeInfoAtPositionInfo;
        public getTopLevelDeclarations(scriptName: string): TypeScript.PullDecl[];
        public reportDiagnostics(errors: TypeScript.IDiagnostic[], errorReporter: TypeScript.IDignosticsReporter): void;
    }
}
declare module TypeScript {
    module CompilerDiagnostics {
        var debug: boolean;
        interface IDiagnosticWriter {
            Alert(output: string): void;
        }
        var diagnosticWriter: IDiagnosticWriter;
        var analysisPass: number;
        function Alert(output: string): void;
        function debugPrint(s: string): void;
        function assert(condition: boolean, s: string): void;
    }
    interface IDignosticsReporter {
        addDiagnostic(diagnostic: TypeScript.IDiagnostic): void;
    }
    interface ILogger {
        information(): boolean;
        debug(): boolean;
        warning(): boolean;
        error(): boolean;
        fatal(): boolean;
        log(s: string): void;
    }
    class NullLogger implements ILogger {
        public information(): boolean;
        public debug(): boolean;
        public warning(): boolean;
        public error(): boolean;
        public fatal(): boolean;
        public log(s: string): void;
    }
    function timeFunction(logger: ILogger, funcDescription: string, func: () => any): any;
}
