<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */
    // Chinese
    'accepted' => ':attribute 必须接受',
    'active_url' => ':attribute 不是有效的 URL',
    'after' => ':attribute 必须是 :date 之后的日期',
    'after_or_equal' => ':attribute 必须是 :date 之后或相同的日期',
    'alpha' => ':attribute 只能包含字母',
    'alpha_dash' => ':attribute 只能包含字母、数字、破折号和下划线',
    'alpha_num' => ':attribute 只能包含字母和数字',
    'array' => ':attribute 必须是一个数组',
    'before' => ':attribute 必须是 :date 之前的日期',
    'before_or_equal' => ':attribute 必须是 :date 之前或相同的日期',
    'between' => [
        'numeric' => ':attribute 必须介于 :min 和 :max 之间',
        'file' => ':attribute 必须介于 :min 和 :max KB 之间',
        'string' => ':attribute 必须介于 :min 和 :max 个字符之间',
        'array' => ':attribute 必须只有 :min - :max 个单元',
    ],
    'boolean' => ':attribute 字段必须为 true 或 false',
    'confirmed' => ':attribute 两次输入不一致',
    'date' => ':attribute 不是一个有效的日期',
    'date_equals' => ':attribute 必须是 :date 之后的日期',
    'date_format' => ':attribute 的格式必须为 :format',
    'different' => ':attribute 和 :other 必须不同',
    'digits' => ':attribute 必须是 :digits 位的数字',
    'digits_between' => ':attribute 必须是介于 :min 和 :max 位的数字',
    'dimensions' => ':attribute 图片尺寸不正确',
    'distinct' => ':attribute 字段有重复值',
    'email' => ':attribute 必须是一个合法的邮箱地址',
    'ends_with' => ':attribute 必须以 :values 为结尾',
    'exists' => '选定的 :attribute 无效',
    'file' => ':attribute 必须是文件',
    'filled' => ':attribute 字段是必填的',
    'gt' => [
        'numeric' => ':attribute 必须大于 :value',
        'file' => ':attribute 必须大于 :value KB',
        'string' => ':attribute 必须多于 :value 个字符',
        'array' => ':attribute 必须多于 :value 个单元',
    ],
    'gte' => [
        'numeric' => ':attribute 必须大于或等于 :value',
        'file' => ':attribute 必须大于或等于 :value KB',
        'string' => ':attribute 必须多于或等于 :value 个字符',
        'array' => ':attribute 必须多于或等于 :value 个单元',
    ],
    'image' => ':attribute 必须是图片',
    'in' => '选定的 :attribute 无效',
    'in_array' => ':attribute 字段不存在于 :other',
    'integer' => ':attribute 必须是整数',
    'ip' => ':attribute 必须是有效的 IP 地址',
    'ipv4' => ':attribute 必须是有效的 IPv4 地址',
    'ipv6' => ':attribute 必须是有效的 IPv6 地址',
    'json' => ':attribute 必须是正确的 JSON 格式',
    'lt' => [
        'numeric' => ':attribute 必须小于 :value',
        'file' => ':attribute 必须小于 :value KB',
        'string' => ':attribute 必须少于 :value 个字符',
        'array' => ':attribute 必须少于 :value 个单元',
    ],
    'lte' => [
        'numeric' => ':attribute 必须小于或等于 :value',
        'file' => ':attribute 必须小于或等于 :value KB',
        'string' => ':attribute 必须少于或等于 :value 个字符',
        'array' => ':attribute 必须少于或等于 :value 个单元',
    ],
    'max' => [
        'numeric' => ':attribute 不能大于 :max',
        'file' => ':attribute 不能大于 :max KB',
        'string' => ':attribute 不能多于 :max 个字符',
        'array' => ':attribute 不能多于 :max 个单元',
    ],
    'mimes' => ':attribute 必须是一个 :values 类型的文件',
    'mimetypes' => ':attribute 必须是一个 :values 类型的文件',
    'min' => [
        'numeric' => ':attribute 必须大于等于 :min',
        'file' => ':attribute 大小不能小于 :min KB',
        'string' => ':attribute 至少为 :min 个字符',
        'array' => ':attribute 至少有 :min 个单元',
    ],
    'not_in' => '选定的 :attribute 无效',
    'not_regex' => ':attribute 格式无效',
    'numeric' => ':attribute 必须是一个数字',
    'password' => '密码错误',
    'present' => ':attribute 字段必须存在',
    'regex' => ':attribute 格式无效',
    'required' => '此字段是必需的',
    'required_if' => '当 :other 是 :value 时 :attribute 字段是必填的',
    'required_unless' => '当 :other 不是 :values 时 :attribute 字段是必填的',
    'required_with' => '当 :values 存在时 :attribute 字段是必填的',
    'required_with_all' => '当 :values 存在时 :attribute 字段是必填的',
    'required_without' => '当 :values 不存在时 :attribute 字段是必填的',
    'required_without_all' => '当 :values 都不存在时 :attribute 字段是必填的',
    'same' => ':attribute 和 :other 必须匹配',
    'size' => [
        'numeric' => ':attribute 大小必须是 :size',
        'file' => ':attribute 大小必须是 :size KB',
        'string' => ':attribute 必须是 :size 个字符',
        'array' => ':attribute 必须包含 :size 个单元',
    ],
    'starts_with' => ':attribute 必须以 :values 为开头',
    'string' => ':attribute 必须是一个字符串',
    'timezone' => ':attribute 必须是一个合法的时区值',
    'unique' => ':attribute 已经存在',
    'uploaded' => ':attribute 上传失败',
    'url' => ':attribute 格式无效',
    'uuid' => ':attribute 必须是有效的 UUID',
    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],
    'attributes' => [],

];
