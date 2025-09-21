export const sscanMessages = {
    "bugCategories": {
        "CORRECTNESS": {
            "Description": "正确性",
            "Abbreviation": "C",
            "Details": "可能存在的错误 - 显而易见的编码错误导致代码可能不是开发人员所期望的。我们努力保持低假阳性率。"
        },
        "NOISE": {
            "Description": "无意义的随机噪声",
            "Abbreviation": "N",
            "Details": "无意义的随机噪声：旨在作为数据挖掘实验中的对照，而不是用于发现软件中的实际错误。"
        },
        "SECURITY": {
            "Description": "安全性",
            "Abbreviation": "S",
            "Details": "以一种可能导致远程可利用的安全漏洞的方式使用不受信任的输入。"
        },
        "BAD_PRACTICE": {
            "Description": "不良实践",
            "Abbreviation": "B",
            "Details": "违反推荐和基本编码实践。示例包括 hashCode 和 equals 问题、可克隆习惯、未处理异常、可序列化问题和误用 finalize。我们努力使此类分析准确，尽管某些群体可能不关心某些不良实践。"
        },
        "STYLE": {
            "Description": "可疑代码",
            "Abbreviation": "D",
            "Details": "代码令人困惑、异常或以容易出错的方式编写。示例包括死局部存储、switch 穿透、未确认的强制转换和冗余空检查。"
        },
        "PERFORMANCE": {
            "Description": "性能",
            "Abbreviation": "P",
            "Details": "代码不一定不正确，但可能效率低下。"
        },
        "MALICIOUS_CODE": {
            "Description": "恶意代码漏洞",
            "Abbreviation": "V",
            "Details": "代码可能受到不受信任代码的攻击。"
        },
        "MT_CORRECTNESS": {
            "Description": "多线程正确性",
            "Abbreviation": "M",
            "Details": "与线程、锁和 volatile 相关的代码缺陷。"
        },
        "I18N": {
            "Description": "国际化",
            "Abbreviation": "I",
            "Details": "与国际化和区域设置相关的代码缺陷。"
        },
        "EXPERIMENTAL": {
            "Description": "实验性",
            "Abbreviation": "X",
            "Details": "实验性且未完全验证的错误模式。"
        }
    },

    "bugPatterns": {
       "CT_CONSTRUCTOR_THROW": {
            "ShortDescription": "注意构造函数抛出异常的问题。",
            "LongDescription": "类 {0} 在 {1} 中抛出的异常会导致构造函数退出。正在构造的对象保持部分初始化状态，可能会容易受到终结器攻击。",
            "Details": "在构造函数中抛出异常的类容易受到终结器攻击。可以通过将类声明为 final、使用声明为 final 的空终结器，或者巧妙地使用私有构造函数来防止终结器攻击。有关更多信息，请参见 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ11-J.+Be+wary+of+letting+constructors+throw+exceptions\">SEI CERT Rule OBJ-11</a>。"
        },
        "JUA_DONT_ASSERT_INSTANCEOF_IN_TESTS": {
            "ShortDescription": "在测试中断言 instanceof 的值不推荐。",
            "LongDescription": "在 {2} 的 {3} 中对类型 {0} 的断言可能隐藏有关为什么强制转换可能失败的有用信息。",
            "Details": "在测试中进行类型检查的断言是不推荐的，因为类型转换异常的消息可能比 instanceof 断言更好地表明错误原因。当调试因错误强制转换而失败的测试时，观察 ClassCastException 的输出可能更有用，它可以提供关于实际遇到的类型的信息。在强制转换之前断言类型将导致减少信息的“false is not true”的消息。如果 JUnit 与 hamcrest 一起使用，可以使用 <a href=\"https://junit.org/junit4/javadoc/latest/index.html?org/hamcrest/core/IsInstanceOf.html\">hamcrest 类</a>。"
        },
        "OVERRIDING_METHODS_MUST_INVOKE_SUPER": {
            "ShortDescription": "父方法被注释为 @OverridingMethodsMustInvokeSuper，但重写方法未调用父方法。",
            "LongDescription": "父方法被注释为 @OverridingMethodsMustInvokeSuper，但 {1} 没有调用父方法。",
            "Details": "父方法被注释为 @OverridingMethodsMustInvokeSuper，但重写方法没有调用父方法。"
        },
        "CNT_ROUGH_CONSTANT_VALUE": {
            "ShortDescription": "发现已知常量的粗略值",
            "LongDescription": "发现粗略值 {3}: {2}",
            "Details": "建议使用预定义的库常量以提高代码清晰度和更好的精确度。"
        },
        "SKIPPED_CLASS_TOO_BIG": {
            "ShortDescription": "类太大无法分析",
            "LongDescription": "{0} 太大无法分析",
            "Details": "该类的大小超过了可以有效处理的范围，未完全分析可能的错误。"
        },
        "NOISE_NULL_DEREFERENCE": {
            "ShortDescription": "关于 null 指针解引用的无用警告",
            "LongDescription": "在 {1} 中关于 null 指针解引用的虚假警告",
            "Details": "虚假警告，未能准确表述情况。"
        },
        "NOISE_METHOD_CALL": {
            "ShortDescription": "关于方法调用的虚假警告",
            "LongDescription": "在 {1} 中关于方法调用 {2} 的虚假警告",
            "Details": "虚假警告，未能准确表述情况。"
        },
        "NOISE_FIELD_REFERENCE": {
            "ShortDescription": "关于字段引用的虚假警告",
            "LongDescription": "在 {1} 中关于对 {2} 的引用的虚假警告",
            "Details": "虚假警告，未能准确表述情况。"
        },
        "NOISE_OPERATION": {
            "ShortDescription": "关于操作的虚假警告",
            "LongDescription": "在 {1} 中关于操作的虚假警告",
            "Details": "虚假警告，未能准确表述情况。"
        },
        "DMI_BIGDECIMAL_CONSTRUCTED_FROM_DOUBLE": {
            "ShortDescription": "从双精度浮点数创建的 BigDecimal 精度不足",
            "LongDescription": "在 {1} 中从 {4} 创建的 BigDecimal",
            "Details": "此代码从双精度浮点值创建 BigDecimal，但该值在转换为十进制数字时不够精确。例如，人们可能会假设在 Java 中写入 new BigDecimal(0.1) 创建出正好等于 0.1 的 BigDecimal（未缩放的值为 1，比例为 1），但它实际上等于 0.1000000000000000055511151231257827021181583404541015625。您可能想使用 BigDecimal.valueOf(double d) 方法，它使用双精度浮点数的字符串表示来创建 BigDecimal。"
        },
        "DMI_DOH": {
            "ShortDescription": "糟糕！一个无意义的方法调用",
            "LongDescription": "在 {1} 中对 {2.nameAndSignature} 的无意义调用",
            "Details": "此方法调用毫无意义，原因应从检查中明显。"
        },
        "DMI_VACUOUS_CALL_TO_EASYMOCK_METHOD": {
            "ShortDescription": "无用/空调用 EasyMock 方法",
            "LongDescription": "在 {1} 中对 {2} 的无用/空调用",
            "Details": "此调用没有传递任何对象给 EasyMock 方法，因此该调用不执行任何操作。"
        },
        "DMI_SCHEDULED_THREAD_POOL_EXECUTOR_WITH_ZERO_CORE_THREADS": {
            "ShortDescription": "以零个核心线程创建 ScheduledThreadPoolExecutor",
            "LongDescription": "在 {1} 中以零个核心线程创建 ScheduledThreadPoolExecutor",
            "Details": "(<a href=\"https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html#ScheduledThreadPoolExecutor-int-\">Javadoc)\n一个具有零个核心线程的 ScheduledThreadPoolExecutor 将不会执行任何操作，对最大池大小的更改将被忽略。"
        },
        "DMI_FUTILE_ATTEMPT_TO_CHANGE_MAXPOOL_SIZE_OF_SCHEDULED_THREAD_POOL_EXECUTOR": {
            "ShortDescription": "尝试更改 ScheduledThreadPoolExecutor 的最大池大小无效",
            "LongDescription": "在 {1} 中尝试更改 ScheduledThreadPoolExecutor 的最大池大小无效",
            "Details": "(<a href=\"https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html\">Javadoc)\n虽然 ScheduledThreadPoolExecutor 继承自 ThreadPoolExecutor，但一些继承的方法对其并不实用。尤其是，因为它作为使用 corePoolSize 线程的固定大小池以及一个无界队列运行，对 maximumPoolSize 的调整没有任何有用的效果。"
        },
        "DMI_UNSUPPORTED_METHOD": {
            "ShortDescription": "调用不支持的方法",
            "LongDescription": "在 {1} 中调用不支持的方法 {2}",
            "Details": "此方法调用的所有目标都抛出 UnsupportedOperationException。\n"
        },
        "DMI_EMPTY_DB_PASSWORD": {
            "ShortDescription": "空数据库密码",
            "LongDescription": "在 {1} 中指定的空数据库密码",
            "Details": "该代码使用空白或空密码创建数据库连接。这表明数据库没有受到密码的保护。\n"
        },
        "DMI_CONSTANT_DB_PASSWORD": {
            "ShortDescription": "硬编码的常量数据库密码",
            "LongDescription": "在 {1} 中指定的硬编码常量数据库密码",
            "Details": "该代码使用硬编码的常量密码创建数据库连接。任何可以访问源代码或已编译代码的人都可以轻易知道该密码。\n"
        },
        "HRS_REQUEST_PARAMETER_TO_COOKIE": {
            "ShortDescription": "基于不受信任的输入生成的 HTTP cookie",
            "LongDescription": "在 {1} 中基于不受信任的输入生成的 HTTP cookie",
            "Details": "该代码使用不受信任的 HTTP 参数构造 HTTP Cookie。如果此 cookie 被添加到 HTTP 响应中，将允许 HTTP 响应拆分的漏洞。有关更多信息，请参阅 <a href=\"http://en.wikipedia.org/wiki/HTTP_response_splitting\">http://en.wikipedia.org/wiki/HTTP_response_splitting</a>。\nSpotBugs 仅寻找最明显的 HTTP 响应拆分情况。如果 SpotBugs 发现，则您几乎肯定还有更多漏洞没有被报告。如果您担心 HTTP 响应拆分，应该认真考虑使用商业静态分析或渗透测试工具。\n"
        },
        "HRS_REQUEST_PARAMETER_TO_HTTP_HEADER": {
            "ShortDescription": "HTTP 响应拆分漏洞",
            "LongDescription": "在 {1} 中直接写入 HTTP 头的 HTTP 参数",
            "Details": "该代码直接将 HTTP 参数写入 HTTP 头，这允许 HTTP 响应拆分的漏洞。有关更多信息，请参阅 <a href=\"http://en.wikipedia.org/wiki/HTTP_response_splitting\">http://en.wikipedia.org/wiki/HTTP_response_splitting</a>。\nSpotBugs 仅寻找最明显的 HTTP 响应拆分情况。如果 SpotBugs 发现，您几乎肯定还有其他漏洞没有被报告。如果您担心 HTTP 响应拆分，应认真考虑使用商业静态分析或渗透测试工具。\n"
        },
        "PT_RELATIVE_PATH_TRAVERSAL": {
            "ShortDescription": "Servlet 中的相对路径遍历",
            "LongDescription": "在 {1} 中的相对路径遍历",
            "Details": "该软件使用 HTTP 请求参数构造应在受限目录内的路径名，但未妥善处理如 \"..\" 这样的序列，因此能够解析到该目录外的位置。\n\n有关更多信息，请参见 <a href=\"http://cwe.mitre.org/data/definitions/23.html\">http://cwe.mitre.org/data/definitions/23.html</a>。\nSpotBugs 仅寻找最明显的相对路径遍历情况。如果 SpotBugs 发现，您几乎肯定还有其他未报告的漏洞。如果您担心相对路径遍历，应该认真考虑使用商业静态分析或渗透测试工具。\n"
        },
        "PT_ABSOLUTE_PATH_TRAVERSAL": {
            "ShortDescription": "Servlet 中的绝对路径遍历",
            "LongDescription": "在 {1} 中的绝对路径遍历",
            "Details": "该软件使用 HTTP 请求参数构造应在受限目录内的路径名，但未妥善处理绝对路径序列（例如 \" /abs/path \"），因此能够解析到该目录外的位置。\n\n有关更多信息，请参见 <a href=\"http://cwe.mitre.org/data/definitions/36.html\">http://cwe.mitre.org/data/definitions/36.html</a>。\nSpotBugs 仅寻找最明显的绝对路径遍历情况。如果 SpotBugs 发现，您几乎肯定还有其他未报告的漏洞。如果您担心绝对路径遍历，应该认真考虑使用商业静态分析或渗透测试工具。\n"
        },
        "XSS_REQUEST_PARAMETER_TO_SERVLET_WRITER": {
            "ShortDescription": "Servlet 反射的跨站脚本（XSS）漏洞",
            "LongDescription": "在 {1} 中写入 Servlet 输出的 HTTP 参数",
            "Details": "该代码直接将 HTTP 参数写入 Servlet 输出，从而允许反射的跨站脚本（XSS）漏洞。有关更多信息，请参见 <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting</a>。\nSpotBugs 仅寻找最明显的跨站脚本漏洞。如果 SpotBugs 发现，您几乎肯定还有其他未报告的跨站脚本漏洞。如果您担心跨站脚本漏洞，应该认真考虑使用商业静态分析或渗透测试工具。\n"
        },
        "XSS_REQUEST_PARAMETER_TO_SEND_ERROR": {
            "ShortDescription": "Servlet 错误页中的反射 XSS 漏洞",
            "LongDescription": "在 {1} 中写入 Servlet 错误页的 HTTP 参数",
            "Details": "该代码直接将 HTTP 参数写入服务器错误页面（使用 HttpServletResponse.sendError）。回显此不受信任的输入会导致反射的跨站脚本（XSS）漏洞。有关更多信息，请参见 <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting</a>。\nSpotBugs 仅寻找最明显的跨站脚本漏洞。如果 SpotBugs 发现，您几乎肯定还有其他未报告的跨站脚本漏洞。如果您担心跨站脚本漏洞，应该认真考虑使用商业静态分析或渗透测试工具。\n"
        },
        "XSS_REQUEST_PARAMETER_TO_JSP_WRITER": {
            "ShortDescription": "JSP 反射的跨站脚本（XSS）漏洞",
            "LongDescription": "HTTP 参数直接写入 JSP 输出，在 {1.class} 中出现反射 XSS 漏洞",
            "Details": "该代码直接将 HTTP 参数写入 JSP 输出，从而允许跨站脚本（XSS）漏洞。有关更多信息，请参见 <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting</a>。\nSpotBugs 仅寻找最明显的跨站脚本漏洞。如果 SpotBugs 发现，您几乎肯定还有其他未报告的跨站脚本漏洞。如果您担心跨站脚本漏洞，应该认真考虑使用商业静态分析或渗透测试工具。\n"
        },
        "SW_SWING_METHODS_INVOKED_IN_SWING_THREAD": {
            "ShortDescription": "某些 Swing 方法需要在 Swing 线程中调用",
            "LongDescription": "在 {1} 中调用 Swing 方法需要在 Swing 事件线程中执行",
            "Details": "(<a href=\"http://web.archive.org/web/20090526170426/http://java.sun.com/developer/JDCTechTips/2003/tt1208.html\">来自 JDC 技术提示): Swing 方法\nshow()、setVisible() 和 pack() 将为框架创建相关对等体。\n创建对等体时，系统创建事件调度线程。\n这会使事情变得复杂，因为事件调度线程可能在 pack 和 validate 仍在处理时通知监听器。此情况可能导致\n两个线程同时处理 Swing 组件 GUI 是一个严重缺陷，可能导致死锁或其他相关的线程问题。pack 调用会导致\n组件被实现。当它们被实现时（即，不一定可见），可能会在事件调度线程上触发监听器的通知。"
        },
        "IL_INFINITE_LOOP": {
            "ShortDescription": "表面上看是无限循环",
            "LongDescription": "在 {1} 中存在表示无限循环的情况",
            "Details": "此循环似乎没有终止的方法（除非通过抛出异常）。"
        },
        "IL_INFINITE_RECURSIVE_LOOP": {
            "ShortDescription": "表面上看是无限递归循环",
            "LongDescription": "在 {1} 中存在表示无限递归循环的情况",
            "Details": "此方法无条件调用自身，表明可能存在无限递归循环，最终会导致堆栈溢出。"
        },
        "IL_CONTAINER_ADDED_TO_ITSELF": {
            "ShortDescription": "集合被添加到自身",
            "LongDescription": "在 {1} 中集合被添加到自身",
            "Details": "一个集合被添加到自身，这将导致计算 hashCode 时抛出 StackOverflowException。"
        },
        "VO_VOLATILE_REFERENCE_TO_ARRAY": {
            "ShortDescription": "对数组的 volatile 引用不将数组元素视为 volatile",
            "LongDescription": "{1} 是对数组的 volatile 引用；数组元素是非 volatile 的",
            "Details": "这声明了对数组的 volatile 引用，读取和写入数组的引用被视为 volatile，但数组元素是非 volatile 的。要获取 volatile 数组元素，您需要使用 java.util.concurrent 中的原子数组类（在 Java 5.0 中提供）。"
        },
        "VO_VOLATILE_INCREMENT": {
                    "ShortDescription": "对易变字段的增量不是原子的",
                    "LongDescription": "在 {1} 中对易变字段 {2} 的增量",
                    "Details": "该代码对易变字段进行增量/减量操作。易变字段的增量/减量操作不是原子的。如果多个线程同时对该字段进行增量/减量操作，可能会导致增量/减量丢失。\n"
                },
        "UI_INHERITANCE_UNSAFE_GETRESOURCE": {
                    "ShortDescription": "如果类被扩展，使用 GetResource 可能不安全",
                    "LongDescription": "在 {1} 中使用 GetResource 可能不安全，如果类被扩展",
                    "Details": "调用可能会得到与预期结果不同的结果，如果此类被其他包中的类扩展。"
                },
        "NP_BOOLEAN_RETURN_NULL": {
                    "ShortDescription": "返回类型为 Boolean 的方法返回显式的 null",
                    "LongDescription": "{1} 的返回类型为 Boolean，并返回显式的 null",
                    "Details": "返回 Boolean.TRUE、Boolean.FALSE 或 null 的方法是一个等待发生意外的隐患。此方法可以被调用，仿佛它返回一个布尔值类型，编译器会插入自动拆箱操作。如果返回了 null 值，将导致 NullPointerException。"
                },
        "NP_OPTIONAL_RETURN_NULL": {
                    "ShortDescription": "返回类型为 Optional 的方法返回显式的 null",
                    "LongDescription": "{1} 的返回类型为 Optional，并返回显式的 null",
                    "Details": "使用 Optional 返回类型（java.util.Optional 或 com.google.common.base.Optional）始终意味着设计时不希望返回显式的 null。在这种情况下返回 null 是违反契约的，可能会破坏客户端代码。"
                },
        "NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR": {
                    "ShortDescription": "非空字段未初始化",
                    "LongDescription": "{1} 未通过构造函数初始化非空字段 {2.name}",
                    "Details": "该字段标记为非空，但在构造函数中并未写入。该字段可能在构造函数中其他位置进行初始化，或者在使用前始终能够初始化。"
                },
        "NP_SYNC_AND_NULL_CHECK_FIELD": {
                    "ShortDescription": "在同一字段上进行同步和 null 检查。",
                    "LongDescription": "在 {1} 中，字段 {2.givenClass} 被同步后检查是否为 null。",
                    "Details": "由于该字段被同步，因此它似乎不太可能为 null。如果它为 null 并且被同步，将抛出 NullPointerException，检查将毫无意义。最好在另一个字段上进行同步。"
                },
        "RpC_REPEATED_CONDITIONAL_TEST": {
                    "ShortDescription": "重复的条件测试",
                    "LongDescription": "在 {1} 中重复的条件测试",
                    "Details": "代码包含一个条件测试被执行了两次，紧接着另一条（例如，x == 0 || x == 0）。也许第二次出现的意图应该是其他条件（例如，x == 0 || y == 0）。"
                },
        "TESTING": {
                    "ShortDescription": "测试",
                    "LongDescription": "在 {1} 中生成检测警告",
                    "Details": "此错误模式仅由新的、未完全实现的错误检测器生成。"
                },
        "TESTING1": {
                    "ShortDescription": "测试 1",
                    "LongDescription": "在 {1} 中生成检测警告 1",
                    "Details": "此错误模式仅由新的、未完全实现的错误检测器生成。"
                },
        "TESTING2": {
                    "ShortDescription": "测试 2",
                    "LongDescription": "在 {1} 中生成检测警告 2",
                    "Details": "此错误模式仅由新的、未完全实现的错误检测器生成。"
                },
        "TESTING3": {
                    "ShortDescription": "测试 3",
                    "LongDescription": "在 {1} 中生成检测警告 3",
                    "Details": "此错误模式仅由新的、未完全实现的错误检测器生成。"
                },
        "UNKNOWN": {
                    "ShortDescription": "未知的错误模式",
                    "LongDescription": "未知 bug 模式 BUG_PATTERN 在 {1} 中",
                    "Details": "记录了一个警告，但 SpotBugs 找不到此错误模式的描述，因此无法描述它。这种情况应该仅发生在 SpotBugs 或其配置中的错误，或者如果生成的分析使用了某个插件，但该插件当前未加载。"
                },
        "AM_CREATES_EMPTY_ZIP_FILE_ENTRY": {
                    "ShortDescription": "创建一个空的 zip 文件条目",
                    "LongDescription": "在 {1} 中创建一个空的 zip 文件条目",
                    "Details": "该代码调用后接着另一个调用。这会导致创建一个空的 ZipFile 条目。条目的内容应该在对 ZipFile 的调用之间写入。"
                },
        "AM_CREATES_EMPTY_JAR_FILE_ENTRY": {
                    "ShortDescription": "创建一个空的 jar 文件条目",
                    "LongDescription": "在 {1} 中创建一个空的 jar 文件条目",
                    "Details": "该代码调用后接着另一个调用。这会导致创建一个空的 JarFile 条目。条目的内容应该在对 JarFile 的调用之间写入。"
                },
        "IMSE_DONT_CATCH_IMSE": {
                    "ShortDescription": "可疑地捕获 IllegalMonitorStateException",
                    "LongDescription": "在 {1} 中可疑地捕获 IllegalMonitorStateException",
                    "Details": "IllegalMonitorStateException 通常只有在你的代码存在设计缺陷（在未持有锁的对象上调用 wait 或 notify）时才会抛出。"
                },
        "FL_MATH_USING_FLOAT_PRECISION": {
                    "ShortDescription": "方法使用浮点精度进行数学计算",
                    "LongDescription": "{1} 使用浮点精度进行数学计算",
                    "Details": "该方法使用浮点精度进行数学运算。浮点精度非常不准确。例如，16777216.0f + 1.0f = 16777216.0f。考虑使用双精度浮点计算。"
                },
        "CAA_COVARIANT_ARRAY_FIELD": {
                    "ShortDescription": "协变数组分配给字段",
                    "LongDescription": "类型为 {2} 的数组被分配给类型为 {3} 的字段",
                    "Details": "协变类型的数组被分配给一个字段。这会造成困惑，并可能在运行时导致 ArrayStoreException，如果稍后该数组中存储其他类型的引用，例如以下代码：\nNumber[] arr = new Integer[10];\narr[0] = 1.0;\n考虑更改创建数组的类型或字段类型。"
                },
        "CAA_COVARIANT_ARRAY_LOCAL": {
                    "ShortDescription": "协变数组分配给局部变量",
                    "LongDescription": "类型为 {2} 的数组被分配给类型为 {3} 的变量",
                    "Details": "协变类型的数组被分配给一个局部变量。这会造成困惑，并可能在运行时导致 ArrayStoreException，如果稍后该数组中存储其他类型的引用，例如以下代码：\nNumber[] arr = new Integer[10];\narr[0] = 1.0;\n考虑更改创建数组的类型或局部变量类型。"
                },
        "CAA_COVARIANT_ARRAY_RETURN": {
                    "ShortDescription": "协变数组从方法返回",
                    "LongDescription": "类型为 {2} 的数组从返回类型为 {3} 的方法返回",
                    "Details": "协变类型的数组从方法返回。这会造成困惑，并可能在运行时导致 ArrayStoreException，如果调用代码尝试在返回的数组中存储其他类型的引用。考虑更改创建数组的类型或方法的返回类型。"
                },
        "CAA_COVARIANT_ARRAY_ELEMENT_STORE": {
                    "ShortDescription": "可能不兼容的元素存储在协变数组中",
                    "LongDescription": "类型为 {2} 的值存储进元素类型为 {3} 的数组中",
                    "Details": "值被存储进数组中，而值的类型与数组的类型不匹配。通过分析知道实际数组类型比声明的变量或字段类型更窄，此赋值不符合原始数组类型。此赋值可能在运行时引发 ArrayStoreException。"
                },
        "CN_IDIOM": {
                    "ShortDescription": "类实现了 Cloneable 但未定义或使用 clone 方法",
                    "LongDescription": "类 {0} 实现了 Cloneable 但未定义或使用 clone 方法",
                    "Details": "类实现了 Cloneable 但未定义或使用 clone 方法。"
                },
        "CN_IMPLEMENTS_CLONE_BUT_NOT_CLONEABLE": {
                    "ShortDescription": "类定义 clone() 但未实现 Cloneable",
                    "LongDescription": "{0} 定义了 clone() 但未实现 Cloneable",
                    "Details": "该类定义了一个 clone() 方法，但该类未实现 Cloneable。某些情况下这没问题（例如，你想控制子类如何克隆自身），但确保这就是你所期望的。"
                },
        "CN_IDIOM_NO_SUPER_CALL": {
                    "ShortDescription": "clone 方法未调用 super.clone()",
                    "LongDescription": "{1} 未调用 super.clone()",
                    "Details": "这个非最终类定义了一个 clone() 方法，但没有调用 super.clone()。\n如果该类（“”）被一个子类（“”）扩展，该子类调用 super.clone()，那么很可能的\n'clone() 方法将返回一个类型的对象，这违反了 clone() 的标准契约。如果所有的 clone() 方法都调用 super.clone()，那么它们就能保证使用 Object.clone()，该方法总是返回正确类型的对象。"
                },
        "NM_FUTURE_KEYWORD_USED_AS_IDENTIFIER": {
                    "ShortDescription": "使用的标识符是 Java 后续版本中的关键字",
                    "LongDescription": "{1} 使用 {2} 作为变量名，这在 Java 后续版本中是一个关键字",
                    "Details": "该标识符是一个在 Java 后续版本中保留的关键字，您的代码将需要在以后的版本中进行更改以便编译。"
                },
        "NM_FUTURE_KEYWORD_USED_AS_MEMBER_IDENTIFIER": {
                    "ShortDescription": "使用的标识符是 Java 后续版本中的关键字",
                    "LongDescription": "{1} 与在更高版本 Java 中的关键字冲突",
                    "Details": "该标识符在后续版本的 Java 中被用作关键字。此代码，以及引用此 API 的任何代码，\n在后续版本中编译时都需进行更改。"
                },
        "DE_MIGHT_DROP": {
                    "ShortDescription": "方法可能丢弃异常",
                    "LongDescription": "{1} 可能丢弃 {2}",
                    "Details": "该方法可能丢弃一个异常。一般来说，异常应该以某种方式处理或报告，或者应从方法中抛出。"
                },
        "DE_MIGHT_IGNORE": {
                    "ShortDescription": "方法可能忽略异常",
                    "LongDescription": "{1} 可能忽略 {2}",
                    "Details": "该方法可能忽略一个异常。一般来说，异常应该以某种方式处理或报告，或者应从方法中抛出。"
                },
        "DP_DO_INSIDE_DO_PRIVILEGED": {
                    "ShortDescription": "调用的方法应该仅在 doPrivileged 块内调用",
                    "LongDescription": "{2} 的调用应该在 doPrivileged 块内进行，在 {1} 中",
                    "Details": "该代码调用一个需要安全权限检查的方法。如果此代码将被授予安全权限，但可能会被没有安全权限的代码调用，则该调用需要在 doPrivileged 块内进行。"
                },
        "DP_DO_INSIDE_DO_PRIVILEDGED": {
                    "ShortDescription": "调用的方法应该仅在 doPrivileged 块内调用",
                    "LongDescription": "{2} 的调用应该在 doPrivileged 块内进行，在 {1} 中",
                    "Details": "该代码调用一个需要安全权限检查的方法。如果此代码将被授予安全权限，但可能会被没有安全权限的代码调用，则该调用需要在 doPrivileged 块内进行。"
                },
        "DP_CREATE_CLASSLOADER_INSIDE_DO_PRIVILEGED": {
                    "ShortDescription": "类加载器应该仅在 doPrivileged 块内创建",
                    "LongDescription": "{1} 创建一个 {2} 类加载器，这应该在 doPrivileged 块内执行",
                    "Details": "该代码创建一个类加载器，如果安装了安全管理器，需要权限。如果此代码可能被没有安全权限的代码调用，则类加载器的创建需要在 doPrivileged 块内进行。"
                },
        "JCIP_FIELD_ISNT_FINAL_IN_IMMUTABLE_CLASS": {
                    "ShortDescription": "不可变类的字段应该是 final",
                    "LongDescription": "{1.givenClass} 应该是 final，因为 {0} 被标记为 Immutable。",
                    "Details": "该类使用 net.jcip.annotations.Immutable 或 javax.annotation.concurrent.Immutable 注解，且这些注解的规则要求所有字段都是 final。"
                },
        "DMI_THREAD_PASSED_WHERE_RUNNABLE_EXPECTED": {
                    "ShortDescription": "传递了线程而期望 Runnable",
                    "LongDescription": "在 {1} 中传递了线程而期望 Runnable",
                    "Details": "Thread 对象作为参数传递给一个期望 Runnable 的方法。这是相当不寻常的，可能表示逻辑错误或导致意外行为。"
                },
        "DMI_COLLECTION_OF_URLS": {
                    "ShortDescription": "URL 的映射和集合可能会占用性能",
                    "LongDescription": "{1} 是或使用了一个 URL 的映射或集合，这可能占用性能",
                    "Details": "该方法或字段是或使用了一个 URL 的 Map 或 Set。由于 URL 的 equals 和 hashCode 方法执行域名解析，这可能导致显著的性能损失。\n请参见 <a href=\"http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html\">http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html</a> 获取更多信息。\n考虑使用其他方式。"
                },
        "DMI_BLOCKING_METHODS_ON_URL": {
                    "ShortDescription": "URL 的 equals 和 hashCode 方法是阻塞的",
                    "LongDescription": "{2} 的调用，阻塞以进行域名解析，在 {1} 中",
                    "Details": "URL 的 equals 和 hashCode 方法执行域名解析，这可能导致显著的性能损失。\n请参见 <a href=\"http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html\">http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html</a> 获取更多信息。\n考虑使用其他方式。"
                },
        "DMI_ANNOTATION_IS_NOT_VISIBLE_TO_REFLECTION": {
                    "ShortDescription": "没有运行时保留，不可用反射检查注解的存在",
                    "LongDescription": "使用反射检查该注解 {3} 的存在，然而它没有运行时保留，在 {1} 中",
                    "Details": "除非注解本身被 @Retention(RetentionPolicy.RUNTIME) 注解，否则无法使用反射观察该注解（例如，使用 isAnnotationPresent 方法）。"
                },
        "DM_EXIT": {
                    "ShortDescription": "方法调用 System.exit(...)",
                    "LongDescription": "{1} 调用 System.exit(...)，这将关闭整个虚拟机",
                    "Details": "调用 System.exit 会关闭整个 Java 虚拟机。只有在适当的时候才应这样做。这种调用使得其他代码无法或很难调用你的代码。考虑改为抛出 RuntimeException。"
                },
        "DM_RUN_FINALIZERS_ON_EXIT": {
                    "ShortDescription": "方法调用危险的方法 runFinalizersOnExit",
                    "LongDescription": "{1} 调用危险的方法 runFinalizersOnExit",
                    "Details": "出于任何原因，不要调用 System.runFinalizersOnExit 或 Runtime.runFinalizersOnExit：它们是 Java 库中最危险的方法之一。—— Joshua Bloch"
                },
        "DM_STRING_CTOR": {
                    "ShortDescription": "方法调用低效的 new String(String) 构造函数",
                    "LongDescription": "{1} 调用低效的 new String(String) 构造函数",
                    "Details": "使用该构造函数浪费内存，因为构造的对象在功能上与作为参数传递的对象 indistinguishable。\n直接使用该参数。"
                },
        "DM_STRING_VOID_CTOR": {
                    "ShortDescription": "方法调用低效的 new String() 构造函数",
                    "LongDescription": "{1} 调用低效的 new String() 构造函数",
                    "Details": "使用无参数构造创建新对象浪费内存，因为创建的对象在功能上与空字符串常量 indistinguishable。\nJava 保证相同的字符串常量将由同一对象表示。\n因此，应直接使用空字符串常量。"
                },
        "DM_STRING_TOSTRING": {
                    "ShortDescription": "方法在字符串上调用 toString() 方法",
                    "LongDescription": "{1} 在字符串上调用 toString() 方法",
                    "Details": "调用是冗余操作。只需使用字符串。"
                },
        "DM_GC": {
                    "ShortDescription": "显式垃圾回收；除了基准测试代码外极具怀疑",
                    "LongDescription": "{1} 强制进行垃圾回收；除了基准测试代码外极具怀疑",
                    "Details": "代码显式调用垃圾回收。除特定的基准测试外，这非常可疑。过去，人们在 close 或 finalize 方法等例程中显式调用垃圾收集器的情况导致了巨大的性能问题。垃圾收集可能是昂贵的。强迫数百或数千次垃圾收集将使机器变得缓慢。"
                },
        "DM_BOOLEAN_CTOR": {
            "ShortDescription": "方法调用了低效的布尔构造函数；请使用 Boolean.valueOf(...)",
            "LongDescription": "{1} 调用了低效的布尔构造函数；请使用 Boolean.valueOf(...)",
            "Details": "创建新的实例会浪费内存，因为对象是不可变的，并且此类型只有两个有效值。&nbsp; 请使用该方法（或 Java 5 自动装箱）来创建对象。"
        },
        "DM_NUMBER_CTOR": {
            "ShortDescription": "方法调用了低效的数字构造函数；请使用静态 valueOf",
            "LongDescription": "{1} 调用了低效的 {2} 构造函数；请使用 {3} 来替代",
            "Details": "使用 new Integer(int) 总是会生成一个新的对象，而允许编译器、类库或 JVM 进行值的缓存。使用缓存的值可以避免对象分配，代码会更快。-128 到 127 之间的值被保证有对应的缓存实例，使用这种方式比使用构造函数快大约 3.5 倍。对于超出该常量范围的值，两种方式的性能是相同的。除非该类必须与早于 Java 5 的 JVM 兼容，否则在创建实例时，请使用自动装箱或该方法。"
        },
        "DM_FP_NUMBER_CTOR": {
            "ShortDescription": "方法调用了低效的浮点数构造函数；请使用静态 valueOf",
            "LongDescription": "{1} 调用了低效的 {2} 构造函数；请使用 {3} 来替代",
            "Details": "使用 new Double(double) 总是会生成一个新的对象，而允许编译器、类库或 JVM 进行值的缓存。使用缓存的值可以避免对象分配，代码会更快。除非该类必须与早于 Java 5 的 JVM 兼容，否则在创建实例时，请使用自动装箱或该方法。"
        },
        "DM_CONVERT_CASE": {
            "ShortDescription": "考虑使用带区域参数的方法版本",
            "LongDescription": "在 {1} 中使用非本地化的 String.toUpperCase() 或 String.toLowerCase()",
            "Details": "正在将字符串转换为大写或小写，使用的是平台的默认编码。当用于国际字符时，这可能会导致不正确的转换。请使用 String.toUpperCase(Locale l) 或 String.toLowerCase(Locale l) 的版本。"
        },
        "BX_UNBOXED_AND_COERCED_FOR_TERNARY_OPERATOR": {
            "ShortDescription": "原始值被解箱并强制转换为三元运算符",
            "LongDescription": "原始值在 {1} 中被解箱并强制转换为三元运算符",
            "Details": "一个包装的原始值在条件三元运算符（即 b ? e1 : e2 运算符）的评估过程中被解箱并转换为另一个原始类型。Java 的语义要求，如果 a 和 b 是包装的数值类型，那么这些值会被解箱和值转换/强制为它们的公共类型（例如，若 a 的类型是 A，b 的类型是 B，则 a 被解箱并转换为浮点值，然后重新包装。请参阅 JLS 第 15.25 节）。"
        },
        "BX_BOXING_IMMEDIATELY_UNBOXED": {
            "ShortDescription": "原始值被包装后立即解箱",
            "LongDescription": "原始值在 {1} 中被包装后立即解箱",
            "Details": "一个原始值被包装后立即解箱。这可能是由于在需要解箱值的地方手动进行了包装，导致编译器不得不立即撤销包装的工作。"
        },
        "BX_UNBOXING_IMMEDIATELY_REBOXED": {
            "ShortDescription": "包装值被解箱后立即重新包装",
            "LongDescription": "包装值在 {1} 中被解箱后立即重新包装",
            "Details": "一个包装值被解箱后立即重新包装。"
        },
        "BX_BOXING_IMMEDIATELY_UNBOXED_TO_PERFORM_COERCION": {
            "ShortDescription": "原始值被包装后解箱以执行原始强制转换",
            "LongDescription": "原始值在 {1} 中被包装后解箱以执行原始强制转换",
            "Details": "一个包装的原始值被构造后立即转换为另一种原始类型（例如，new Double(d).intValue()）。直接执行原始强制转换（例如，(int) d）会更好。"
        },
        "DM_BOXED_PRIMITIVE_TOSTRING": {
            "ShortDescription": "方法创建了一个包装的原始值只是为了调用 toString",
            "LongDescription": "{1} 中包装的原始值仅为调用 toString 而创建",
            "Details": "一个包装的原始值被创建只是为了调用 toString()。使用接收原始值的静态形式的 toString 更为有效。即，使用...new Integer(1).toString()、new Long(1).toString()、new Float(1.0).toString()、new Double(1.0).toString()、new Byte(1).toString()、new Short(1).toString()、new Boolean(true).toString()。"
        },
        "DM_BOXED_PRIMITIVE_FOR_PARSING": {
            "ShortDescription": "通过装箱/拆箱来解析一个原始值",
            "LongDescription": "通过装箱/拆箱来解析原始值 {1}",
            "Details": "一个包装的原始值从字符串中创建，仅为提取未拆箱的原始值。直接调用静态的 parseXXX 方法会更高效。"
        },
        "DM_BOXED_PRIMITIVE_FOR_COMPARE": {
            "ShortDescription": "装箱一个原始值以进行比较",
            "LongDescription": "原始值被装箱以调用 {2}：请使用 {3} 来替代",
            "Details": "一个包装的原始值被创建只是为了调用方法。使用静态比较方法（对于双精度和浮点，自 Java 1.4 以来适用，对于其他原始类型，自 Java 7 起适用），直接对原始值进行比较会更高效。"
        },
        "DM_NEW_FOR_GETCLASS": {
            "ShortDescription": "方法分配了一个对象，只是为了获取类对象",
            "LongDescription": "{1} 分配了一个对象，只是为了获取类对象",
            "Details": "该方法分配了一个对象，仅为在其上调用 getClass()，以检索其 Class 对象。更简单的方法是直接访问类的 .class 属性。"
        },
        "DM_MONITOR_WAIT_ON_CONDITION": {
            "ShortDescription": "在条件上调用了 monitor wait()",
            "LongDescription": "在 {1} 中对 Condition 调用了 monitor wait()",
            "Details": "该方法在对象上调用了 wait()。等待应该使用由接口定义的某个方法来进行。"
        },
        "RV_01_TO_INT": {
            "ShortDescription": "从 0 到 1 的随机值被强制转换为整数 0",
            "LongDescription": "{1} 使用生成了从 0 到 1 的随机值，然后强制将该值转换为整数 0",
            "Details": "一个从 0 到 1 的随机值被强制转换为整数 0。您可能想在强制转换为整数之前将随机值乘以其他东西，或者使用该方法。"
        },
        "DM_INVALID_MIN_MAX": {
            "ShortDescription": "Math.max 和 Math.min 的组合不正确",
            "LongDescription": "Math.max 和 Math.min 的组合不正确：该代码始终返回 {2}",
            "Details": "该代码尝试使用 Math.min(0, Math.max(100, value)) 这样的构造来限制值的范围。然而常量的顺序不正确：应该是 Math.min(100, Math.max(0, value))。因此，结果是该代码始终产生相同的结果（或如果值为 NaN 则为 NaN）。"
        },
        "DM_NEXTINT_VIA_NEXTDOUBLE": {
            "ShortDescription": "使用 Random 的 nextInt 方法生成随机整数，而不是 nextDouble",
            "LongDescription": "{1} 使用 Random 的 nextDouble 方法来生成随机整数；使用 nextInt 更高效",
            "Details": "如果 x 为 random object，您可以通过使用 x.nextInt(n) 来生成从 0 到 n 的随机数，而不是使用 (int)(r.nextDouble() * n)。nextInt 的参数必须为正。如果您想生成从 -99 到 0 的随机值，则使用该方法。"
        },
        "SQL_NONCONSTANT_STRING_PASSED_TO_EXECUTE": {
            "ShortDescription": "非恒定字符串传递给执行或 addBatch 方法的 SQL 语句",
            "LongDescription": "{1} 将非恒定字符串传递给 SQL 语句的 execute 或 addBatch 方法",
            "Details": "该方法使用看起来是动态生成的字符串调用了 SQL 语句的 execute 或 addBatch 方法。考虑使用预处理语句。这样更高效，且在抵御 SQL 注入攻击方面风险更小。"
        },
        "SQL_PREPARED_STATEMENT_GENERATED_FROM_NONCONSTANT_STRING": {
            "ShortDescription": "从非恒定字符串生成预处理语句",
            "LongDescription": "在 {1} 中生成的预处理语句来自非恒定字符串",
            "Details": "该代码从非恒定字符串生成一个 SQL 预处理语句。如果未经过检验，用户提供的受污染数据用于构建该字符串，可能会发生 SQL 注入，使得预处理语句执行意外和不期望的操作。"
        },
        "DM_USELESS_THREAD": {
            "ShortDescription": "使用默认空运行方法创建了线程",
            "LongDescription": "{1} 使用默认空运行方法创建了线程",
            "Details": "该方法创建了一个线程，而没有通过从 Thread 类派生或传递 Runnable 对象来指定运行方法。这个线程因此无所作为，仅浪费时间。"
        },
        "DC_DOUBLECHECK": {
            "ShortDescription": "字段可能存在双重检查",
            "LongDescription": "{1} 中可能对 {2} 进行双重检查",
            "Details": "该方法可能包含双重检查锁定的实例。根据 Java 内存模型的语义，该模式并不正确。有关更多信息，请查看网页 <a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html\">http://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html</a>"
        },
        "DC_PARTIALLY_CONSTRUCTED": {
            "ShortDescription": "可能暴露部分初始化的对象",
            "LongDescription": "在 {1} 中可能暴露部分初始化的对象",
            "Details": "该方法似乎使用了带双重检查锁定的延迟字段初始化。尽管该字段被正确声明为 volatile，但在字段赋值后的内部结构可能发生变化，因此另一个线程可能看到部分初始化的对象。要解决此问题，请考虑先将对象存储到局部变量中，并在对象完全构造后再保存到 volatile 字段。"
        },
        "FI_FINALIZER_NULLS_FIELDS": {
            "ShortDescription": "终结器将字段设为 null",
            "LongDescription": "{3} 在 {1.class} 的 finalize 方法中被设置为 null",
            "Details": "该终结器将字段设为 null。通常这是一个错误，因为这不会帮助垃圾回收，并且对象将会被垃圾回收。"
        },
        "FI_FINALIZER_ONLY_NULLS_FIELDS": {
            "ShortDescription": "终结器只将字段设为 null",
            "LongDescription": "{1} 仅将字段设为 null",
            "Details": "该终结器什么都不做，只是将字段设为 null。这完全没有意义，会导致对象被垃圾收集、终结，然后被再次垃圾收集。您应该删除终结器方法。"
        },
        "FI_PUBLIC_SHOULD_BE_PROTECTED": {
            "ShortDescription": "终结器应该是受保护的，而不是公共的",
            "LongDescription": "{1} 是公共的；应该是受保护的",
            "Details": "一个类的终结器方法应该具有受保护的访问权限，而不是公共权限。"
        },
        "FI_EMPTY": {
            "ShortDescription": "空终结器应该被删除",
            "LongDescription": "{1} 为空且应该被删除",
            "Details": "空方法是无用的，因此应该被删除。"
        },
        "FI_NULLIFY_SUPER": {
            "ShortDescription": "终结器使父类终结器失效",
            "LongDescription": "{1} 使 {2}.finalize(); 的调用失效。这是有意的吗？",
            "Details": "这个空方法显式地否定了任何父类定义的终结器的效果。&nbsp; 任何在父类中定义的终结器操作都将不会被执行。除非这是有意的，否则请删除此方法。"
        },
        "FI_USELESS": {
            "ShortDescription": "终结器什么都不做，只是调用父类终结器",
            "LongDescription": "{1} 仅调用 super.finalize(); 请删除它",
            "Details": "该方法唯一做的事情是调用父类的 finalize() 方法，使其变得多余。&nbsp; 请删除它。"
        },
        "FI_MISSING_SUPER_CALL": {
            "ShortDescription": "终结器未调用父类终结器",
            "LongDescription": "{1} 缺少对 super.finalize() 的调用，因此 {2}.finalize() 不会被调用",
            "Details": "该方法未调用其父类的 finalize() 方法。&nbsp; 因此，任何在父类中定义的终结器操作将不会被执行。&nbsp; 请添加对 super.finalize() 的调用。"
        },
        "FI_EXPLICIT_INVOCATION": {
            "ShortDescription": "显式调用终结器",
            "LongDescription": "在 {1} 中显式调用 {2} 方法",
            "Details": "该方法包含对对象的终结器方法的显式调用。&nbsp; 因为终结器方法应该只由 VM 执行一次，显式调用是一种坏主意。如果一组互连的对象被终结，那么 VM 会在所有可终结对象上调用 finalize 方法，可能会在不同线程中同时进行。因此，在 X 类的终结器方法中调用 X 引用的对象的 finalize 方法尤其不明智，因为它们可能已经在另一个线程中被终结。"
        },
        "EQ_CHECK_FOR_OPERAND_NOT_COMPATIBLE_WITH_THIS": {
            "ShortDescription": "equals 方法检查不兼容的操作数",
            "LongDescription": "{1} 检查操作数的类型为 {2.givenClass}",
            "Details": "该 equals 方法检查参数是否为某种不兼容的类型（即，一个既不是定义 equals 方法的类的超类，也不是其子类的类）。例如，Foo 类可能具有如下 equals 方法：\npublic boolean equals(Object o) { if (o instanceof Foo) return name.equals(((Foo)o).name); else if (o instanceof String) return name.equals(o); else return false; }\n这被认为是不好的实践，因为这使得实现一个对称和传递的 equals 方法变得非常困难。没有这些属性，可能会发生非常意外的行为。"
        },
        "EQ_DONT_DEFINE_EQUALS_FOR_ENUM": {
            "ShortDescription": "为枚举定义了协变的 equals() 方法",
            "LongDescription": "枚举 {0} 定义了 equals({0.givenClass})",
            "Details": "该类定义了一个枚举，而枚举上的相等是基于对象的标识进行定义的。为枚举值定义一个协变的 equals 方法是极度不好的实践，因为这可能会导致有两个不同的枚举值使用协变枚举方法比较时相等，而在正常比较时不相等。请不要这样做。"
        },
        "EQ_SELF_USE_OBJECT": {
            "ShortDescription": "定义了协变的 equals() 方法，继承了 Object.equals(Object)",
            "LongDescription": "{0} 定义了 equals({0.givenClass}) 方法并使用 Object.equals(Object)",
            "Details": "该类定义了一个协变版本的方法，但继承了基类中定义的正常方法。&nbsp; 该类应该可能定义一个 boolean equals(Object) 方法。"
        },
        "EQ_OTHER_USE_OBJECT": {
            "ShortDescription": "定义了 equals() 方法，但未重写 Object.equals(Object)",
            "LongDescription": "{0} 定义了 {1.givenClass} 方法并使用 Object.equals(Object)",
            "Details": "该类定义了一个方法，但没有重写基类中定义的正常方法。&nbsp; 该类应该可能定义一个 boolean equals(Object) 方法。"
        },
        "EQ_OTHER_NO_OBJECT": {
            "ShortDescription": "定义了 equals() 方法，但未重写 equals(Object)",
            "LongDescription": "{0} 定义了 {1.givenClass} 方法，但未重写 equals(Object)",
            "Details": "该类定义了一个方法，但没有重写基类中定义的正常方法。&nbsp; 而是从超类继承了一个方法。该类应该可能定义一个 boolean equals(Object) 方法。"
        },
        "EQ_DOESNT_OVERRIDE_EQUALS": {
            "ShortDescription": "类未重写超类中的 equals",
            "LongDescription": "{0} 未重写 {2.givenClass}",
            "Details": "该类扩展了一个定义了 equals 方法的类，并添加了字段，但没有自己定义一个 equals 方法。因此，该类实例的相等性将忽略子类的身份和添加的字段。请确保这是预期的，并且您不需要重写 equals 方法。即使您不需要重写 equals 方法，也应考虑重写它，以记录该子类的 equals 方法只返回调用 super.equals(o) 的结果。"
        },
        "EQ_SELF_NO_OBJECT": {
            "ShortDescription": "定义了协变的 equals() 方法",
            "LongDescription": "{0} 定义了 equals({0.givenClass}) 方法，但未定义 equals(Object)",
            "Details": "该类定义了一个协变版本的。&nbsp; 要正确重写该方法，参数的类型必须为 Object。"
        },
        "EQ_OVERRIDING_EQUALS_NOT_SYMMETRIC": {
            "ShortDescription": "equals 方法重写了超类中的 equals，可能不对称",
            "LongDescription": "{1.class} 在 {2.class.givenClass} 中重写了 equals，可能不对称",
            "Details": "该类定义了一个 equals 方法，重写了超类中的 equals 方法。两个 equals 方法都在判断两个对象是否相等时使用了 instanceof。这样可能会导致问题，因为很重要的是 equals 方法是对称的（换句话说，a.equals(b) == b.equals(a)）。如果 B 是 A 的子类，而 A 的 equals 方法检查参数是否是 A 的实例，B 的 equals 方法检查参数是否是 B 的实例，那么很可能这两个方法定义的等价关系不是对称的。"
        },
        "EQ_GETCLASS_AND_CLASS_CONSTANT": {
            "ShortDescription": "equals 方法对子类型失效",
            "LongDescription": "{1} 对子类型失效",
            "Details": "该类有一个 equals 方法，如果被子类继承将会失效。它将类文字与参数的类进行比较（例如，在类中，它可能会检查 Foo.class == o.getClass()）。最好检查 this.getClass() == o.getClass()。"
        },
        "EQ_UNUSUAL": {
            "ShortDescription": "不寻常的 equals 方法",
            "LongDescription": "{1} 是不寻常的",
            "Details": "该类没有遵循我们识别的任何模式来检查参数的类型是否与该对象的类型兼容。此代码可能没有任何问题，但值得复审。"
        },
        "EQ_COMPARING_CLASS_NAMES": {
            "ShortDescription": "equals 方法比较类名而不是类对象",
            "LongDescription": "{1} 比较类名而不是类对象",
            "Details": "该类定义了一个 equals 方法，通过检查两个对象的类名是否相等来判断它们是否是同一类。您可以有不同的类拥有相同的名称，只要它们是由不同的类加载器加载的。只需检查类对象是否相同。"
        },
        "EQ_ALWAYS_TRUE": {
            "ShortDescription": "equals 方法总是返回 true",
            "LongDescription": "{1} 总是返回 true",
            "Details": "该类定义了一个 equals 方法，总是返回 true。这很有想象力，但并不聪明。再者，这意味着该 equals 方法不是对称的。"
        },
        "EQ_ALWAYS_FALSE": {
            "ShortDescription": "equals 方法总是返回 false",
            "LongDescription": "{1} 总是返回 false",
            "Details": "该类定义了一个 equals 方法，总是返回 false。这意味着对象不等于其自身，并且无法创建该类的有用 Map 或 Set。从根本上讲，这意味着 equals 不是自反的，这是 equals 方法的一项要求。可能的意图语义是对象身份：一个对象应该等于它自身。这是从 Object 类继承的行为。如果您需要重写从不同超类继承的 equals，可以使用：public boolean equals(Object o) { return this == o; }"
        },
        "HSC_HUGE_SHARED_STRING_CONSTANT": {
            "ShortDescription": "巨大的字符串常量在多个类文件中重复",
            "LongDescription": "{1} 被初始化为一个 {2} 字符长的字符串常量，该常量在 {3} 个其他类文件中重复",
            "Details": "一个大的字符串常量在多个类文件中重复。这可能是因为一个 final 字段被初始化为一个字符串常量，而 Java 语言要求来自其他类对 final 字段的所有引用都必须内联到该类文件中。请参见 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6447475\">JDK bug 6447475</a>，其中描述了在 JDK 中发生此 bug 的情况及如何解决它以减少 JDK 的大小 1 兆字节。"
        },
        "NP_ARGUMENT_MIGHT_BE_NULL": {
            "ShortDescription": "方法未检查 null 参数",
            "LongDescription": "{1} 未检查 null 参数",
            "Details": "这个方法的一个参数已被识别为一个应该始终检查是否为 null 的值，但它在解引用之前没有进行 null 检查。"
        },
        "NP_EQUALS_SHOULD_HANDLE_NULL_ARGUMENT": {
            "ShortDescription": "equals() 方法未检查 null 参数",
            "LongDescription": "{1} 未检查 null 参数",
            "Details": "这个 equals(Object) 的实现违反了 java.lang.Object.equals() 定义的合同，因为它没有检查是否传入了一个 null 作为参数。所有的 equals() 方法在接收到 null 值时都应返回 false。"
        },
        "RV_NEGATING_RESULT_OF_COMPARETO": {
            "ShortDescription": "对 compareTo()/compare() 返回值进行取反",
            "LongDescription": "{1} 取反了 {2} 的返回值",
            "Details": "这段代码对 compareTo 或 compare 方法的返回值进行了取反。这是一种可疑或不好的编程实践，因为如果返回值是 Integer.MIN_VALUE，取反返回值不会改变结果的符号。您可以通过反转操作数的顺序而不是取反结果来实现相同的意图。"
        },
        "CO_COMPARETO_RESULTS_MIN_VALUE": {
            "ShortDescription": "compareTo()/compare() 返回 Integer.MIN_VALUE",
            "LongDescription": "{1} 返回 Integer.MIN_VALUE，不能被取反",
            "Details": "在某些情况下，这个 compareTo 或 compare 方法返回常量 Integer.MIN_VALUE，这是一种非常糟糕的实践。compareTo 的返回值唯一重要的是结果的符号。但是人们有时会取反 compareTo 的返回值，希望这会反转结果的符号。并且，除了当返回的值是 Integer.MIN_VALUE 时，它会这样做。因此，返回 -1 而不是 Integer.MIN_VALUE。"
        },
        "CO_COMPARETO_INCORRECT_FLOATING": {
            "ShortDescription": "compareTo()/compare() 错误处理浮点值",
            "LongDescription": "{1} 错误处理 {2} 值",
            "Details": "这个方法使用这样的模式比较 double 或 float 值：val1 > val2 ? 1 : val1 < val2 ? -1 : 0。这种模式在处理 -0.0 和 NaN 值时可能会出现错误的排序结果或损坏的集合（如果比较的值被用作键）。考虑使用 Double.compare 或 Float.compare 静态方法，这些方法能够正确处理所有特殊情况。"
        },
        "CO_SELF_NO_OBJECT": {
            "ShortDescription": "定义了协变的 compareTo() 方法",
            "LongDescription": "{0} 定义了 compareTo({0.givenClass}) 方法，但未定义 compareTo(Object)",
            "Details": "该类定义了一个协变版本的。&nbsp; 要正确地重写接口中的方法，参数必须具有类型 Object。"
        },
        "HE_SIGNATURE_DECLARES_HASHING_OF_UNHASHABLE_CLASS": {
            "ShortDescription": "签名声明在哈希构造中使用不可哈希类",
            "LongDescription": "{2} 未定义 hashCode() 方法，但在 {1} 的哈希上下文中使用",
            "Details": "一个方法、字段或类声明了一个通用签名，其中一个不可哈希类用于需要哈希类的上下文中。声明了 equals 方法但继承了来自 Object 的 hashCode() 方法的类是不可哈希的，因为它不能满足相等对象具有相等哈希码的要求。"
        },
        "HE_USE_OF_UNHASHABLE_CLASS": {
            "ShortDescription": "在哈希数据结构中使用没有 hashCode() 方法的类",
            "LongDescription": "{2} 未定义 hashCode() 方法，但在 {1} 的哈希数据结构中使用",
            "Details": "一个类定义了 equals(Object) 方法，但未定义 hashCode() 方法，因此不能满足相等对象具有相等哈希码的要求。该类的一个实例被用在哈希数据结构中，因此解决这个问题的必要性非常重要。"
        },
        "HE_HASHCODE_USE_OBJECT_EQUALS": {
            "ShortDescription": "类定义 hashCode() 并使用 Object.equals()",
            "LongDescription": "{0} 定义 hashCode 并使用 Object.equals()",
            "Details": "该类定义了一个 hashCode 方法，但从 Object 继承了 equals 方法（该方法通过比较对象引用定义相等性）。&nbsp; 虽然这可能满足相等对象必须具有相等哈希码的合同，但很可能这并不是覆盖 hashCode 方法时的意图。&nbsp; （重写 hashCode 意味着对象的身份基于比简单引用相等更复杂的标准。）如果您认为该类的实例不会被插入到 HashMap/HashTable 中，建议的实现是：public int hashCode() { assert false : \"hashCode not designed\"; return 42; // 任何任意常量都可以。 }"
        },
        "EQ_COMPARETO_USE_OBJECT_EQUALS": {
            "ShortDescription": "类定义 compareTo(...) 并使用 Object.equals()",
            "LongDescription": "{0} 定义 {1.givenClass} 并使用 Object.equals()",
            "Details": "该类定义了一个 compareTo 方法，但从 Object 继承了 equals 方法。通常，compareTo 的值应当在且仅在 equals 返回 true 时返回零。如果违反了这一点，则在 PriorityQueue 等类中将会发生奇怪和不可预知的故障。在 Java 5 中，PriorityQueue.remove 方法使用 compareTo 方法，而在 Java 6 中使用 equals 方法。从 Comparable 接口中的 compareTo 方法的 JavaDoc：\n\n强烈建议，但不是严格要求的是 (x.compareTo(y)==0) == (x.equals(y))。\n一般来说，任何实现 Comparable 接口并违反此条件的类应明确指出此事实。推荐的表述是“注意：此类的自然排序与 equals 不一致。”"
        },
        "HE_HASHCODE_NO_EQUALS": {
            "ShortDescription": "类定义 hashCode() 但未定义 equals()",
            "LongDescription": "{0} 定义 hashCode 但未定义 equals",
            "Details": "该类定义了一个 hashCode 方法，但未定义 equals 方法。&nbsp; 因此，该类可能违反相等对象必须具有相等哈希码的恒等性。"
        },
        "HE_EQUALS_USE_HASHCODE": {
            "ShortDescription": "类定义 equals() 并使用 Object.hashCode()",
            "LongDescription": "{0} 定义 equals 并使用 Object.hashCode()",
            "Details": "该类重写了 equals，但未重写 hashCode，并且从 Object 继承了 hashCode 的实现（它返回身份哈希码，这是由 VM 分配给对象的任意值）。&nbsp; 因此，该类很可能违反相等对象必须具有相等哈希码的恒等性。如果您认为该类的实例不会被插入到 HashMap/HashTable 中，建议的实现是：public int hashCode() { assert false : \"hashCode not designed\"; return 42; // 任何任意常量都可以。 }"
        },
        "HE_INHERITS_EQUALS_USE_HASHCODE": {
            "ShortDescription": "类继承 equals() 并使用 Object.hashCode()",
            "LongDescription": "{0} 继承 equals 并使用 Object.hashCode()",
            "Details": "该类继承自一个抽象超类，并从 Object 继承 hashCode（它返回身份哈希码，这是由 VM 分配给对象的任意值）。&nbsp; 因此，该类很可能违反相等对象必须具有相等哈希码的恒等性。如果您不想定义 hashCode 方法，或者不相信该对象将来会放入 HashMap/Hashtable，定义 hashCode 方法时抛出异常。"
        },
        "HE_EQUALS_NO_HASHCODE": {
            "ShortDescription": "类定义 equals() 但未定义 hashCode()",
            "LongDescription": "{0} 定义 equals 但未定义 hashCode",
            "Details": "该类重写了 equals，但未重写 hashCode。&nbsp; 因此，该类可能违反相等对象必须具有相等哈希码的恒等性。"
        },
        "EQ_ABSTRACT_SELF": {
            "ShortDescription": "抽象类定义协变的 equals() 方法",
            "LongDescription": "抽象类 {0} 定义 equals({0.givenClass}) 方法",
            "Details": "该类定义了一个协变版本的。&nbsp; 要正确重写接口中的方法，参数必须具有类型 Object。"
        },
        "ES_COMPARING_STRINGS_WITH_EQ": {
            "ShortDescription": "使用 == 或 != 比较字符串对象",
            "LongDescription": "在 {1} 中使用 == 或 != 比较字符串对象",
            "Details": "这段代码使用 == 或 != 操作符比较对象引用的相等性。除非两个字符串都是源文件中的常量，或者已经通过 intern() 方法进行过处理，否则相同字符串值可能由两个不同的 String 对象表示。考虑换用 equals() 方法。"
        },
        "ES_COMPARING_PARAMETER_STRING_WITH_EQ": {
            "ShortDescription": "使用 == 或 != 比较字符串参数",
            "LongDescription": "在 {1} 中使用 == 或 != 比较字符串参数",
            "Details": "这段代码使用 == 或 != 操作符比较参数的引用相等性。要求调用者仅将字符串常量或已处理的字符串传递给方法是不必要的脆弱，并且很少带来可衡量的性能提升。考虑换用 equals() 方法。"
        },
        "CO_ABSTRACT_SELF": {
            "ShortDescription": "抽象类定义协变的 compareTo() 方法",
            "LongDescription": "抽象类 {0} 定义 compareTo({0.givenClass}) 方法",
            "Details": "该类定义了一个协变版本的。&nbsp; 要正确重写接口中的方法，参数必须具有类型 Object。"
        },
        "IS_FIELD_NOT_GUARDED": {
            "ShortDescription": "字段未保护以防止并发访问",
            "LongDescription": "{1.givenClass} 未保护以防止并发访问；锁定了 {2}% 的时间",
            "Details": "该字段已被注释为 net.jcip.annotations.GuardedBy 或 javax.annotation.concurrent.GuardedBy，但可以以看起来违反这些注释的方式进行访问。"
        },
        "MSF_MUTABLE_SERVLET_FIELD": {
            "ShortDescription": "可变的 servlet 字段",
            "LongDescription": "{1} 是一个可变的 servlet 字段",
            "Details": "Web 服务器通常只创建 servlet 或 JSP 类的一个实例（即将该类视为单例），并会让多个线程在该实例上调用方法以处理多个同时请求。因此，拥有一个可变实例字段通常会导致竞态条件。"
        },
        "IS2_INCONSISTENT_SYNC": {
            "ShortDescription": "不一致的同步",
            "LongDescription": "{1} 的不一致同步；锁定了 {2}% 的时间",
            "Details": "该类的字段似乎在同步方面的访问不一致。&nbsp; 这个bug报告表明bug模式探测器判断该类包含混合的锁定与未锁定的访问，且该类被注释为 javax.annotation.concurrent.NotThreadSafe，至少一个锁定访问由该类自己的方法执行，并且未同步的字段访问（读取和写入）数量不超过所有访问的三分之一，且写入的权重是读取的两倍。匹配这个 bug 模式的典型 bug 是忘记同步在一个被设计为线程安全的类中的一个方法。您可以选择标记为“未同步访问”的节点，以显示检测器认为字段在没有同步的情况下被访问的代码位置。请注意，该检测器存在各种不准确来源；例如，它无法静态检测持有锁的所有情况。&nbsp; 此外，即使检测器在区分锁定与未锁定访问时准确，该代码依然可能是正确的。"
        },
        "NN_NAKED_NOTIFY": {
            "ShortDescription": "裸通知",
            "LongDescription": "在 {1} 中裸通知",
            "Details": "对 notify() 或 notifyAll() 的调用在没有任何（明显的）伴随可变对象状态的修改下进行。&nbsp; 通常，在监视器上调用通知方法是因为某个条件已变为真，另一个线程正在等待。不过，为了使该条件有意义，它必须涉及一个显而易见的对象，且该对象在两个线程之间是可见的。此错误不一定表示出错，因为对可变对象状态的更改可能发生在一个方法中，随后调用了包含通知的方法。"
        },
        "MS_EXPOSE_REP": {
            "ShortDescription": "公共静态方法可能通过返回可变对象或数组暴露内部表示",
            "LongDescription": "公共静态 {1} 可能通过返回 {2.givenClass} 来暴露内部表示",
            "Details": "一个公共静态方法返回对一个可变对象或一个数组的引用，而这个对象或数组是类静态状态的一部分。任何调用此方法的代码可以自由修改底层数组。解决方案之一是返回数组的副本。"
        },
        "EI_EXPOSE_REP": {
            "ShortDescription": "可能通过返回对可变对象的引用暴露内部表示",
            "LongDescription": "{1} 可能通过返回 {2.givenClass} 来暴露内部表示",
            "Details": "返回存储在对象字段中的可变对象值的引用会暴露对象的内部表示。&nbsp; 如果实例被不信任的代码访问，并且对可变对象的未检查更改可能会危及安全或其他重要属性，则需要更改处理。返回对象的新副本在许多情况下是更好的方法。"
        },
        "EI_EXPOSE_REP2": {
            "ShortDescription": "可能通过存储外部可变对象的引用暴露内部表示",
            "LongDescription": "{1} 可能通过将外部可变对象存储到 {2.givenClass} 中暴露内部表示",
            "Details": "这段代码将对外部可变对象的引用存储到对象的内部表示中。&nbsp; 如果实例被不信任的代码访问，并且对可变对象的未检查更改可能会危及安全或其他重要属性，则需要更改处理。在许多情况下，存储对象的副本是更好的方法。"
        },
        "EI_EXPOSE_STATIC_REP2": {
            "ShortDescription": "可能通过将可变对象存储到静态字段中暴露内部静态状态",
            "LongDescription": "{1} 可能通过将可变对象存储到静态字段 {2} 中暴露内部静态状态",
            "Details": "这段代码将对外部可变对象的引用存储到静态字段中。如果对可变对象的未检查更改可能会危及安全或其他重要属性，则需要更改处理。在许多情况下，存储对象的副本是更好的方法。"
        },
        "MS_EXPOSE_BUF": {
            "ShortDescription": "可能通过返回一个共享非公共数据的缓冲区暴露内部表示",
            "LongDescription": "{1} 可能通过返回 {2.givenClass} 来暴露内部表示",
            "Details": "一个公共静态方法返回一个缓冲区（java.nio.*Buffer），该缓冲区包装一个作为类静态状态的一部分的数组，或者返回一个浅拷贝的缓冲区，该缓冲区是类的静态状态的一部分，并与原始缓冲区共享引用。任何调用此方法的代码可以自由修改底层数组。解决方案之一是返回一个只读缓冲区或一个包含数组副本的新缓冲区。"
        },
        "EI_EXPOSE_BUF": {
            "ShortDescription": "可能通过返回共享非公共数据的缓冲区暴露内部表示",
            "LongDescription": "{1} 可能通过返回 {2.givenClass} 来暴露内部表示",
            "Details": "返回一个缓冲区（java.nio.*Buffer）的引用，该缓冲区包装一个存储在对象字段之一中的数组，这会暴露数组元素的内部表示，因为缓冲区仅存储对数组的引用，而不是复制其内容。同样，返回这样的缓冲区的浅拷贝（使用其 duplicate() 方法）存储在对象字段之一中也会暴露缓冲区的内部表示。如果实例被不信任的代码访问，并且对数组的未检查更改可能会危及安全或其他重要属性，则需要更改处理。在许多情况下，返回只读缓冲区（使用其 asReadOnly() 方法）或将数组复制到新缓冲区（使用其 put() 方法）是更好的方法。"
        },
        "EI_EXPOSE_BUF2": {
            "ShortDescription": "可能通过创建包含对数组的引用的缓冲区暴露内部表示",
            "LongDescription": "{1} 可能通过创建一个包含外部数组 {2.givenClass} 的缓冲区暴露内部表示",
            "Details": "这段代码创建了一个缓冲区，该缓冲区存储对外部数组或外部缓冲区的数组的引用到对象的内部表示中。&nbsp; 如果实例被不信任的代码访问，并且对数组的未检查更改可能会危及安全或其他重要属性，则需要更改处理。在许多情况下，存储数组的副本是一个较好的方法。"
        },
        "EI_EXPOSE_STATIC_BUF2": {
            "ShortDescription": "可能通过创建一个将外部数组存储到静态字段中的缓冲区暴露内部静态状态",
            "LongDescription": "{1} 可能通过创建一个将外部数组存储到静态字段 {2} 中的缓冲区暴露内部静态状态",
            "Details": "这段代码创建了一个缓冲区，该缓冲区存储对外部数组或外部缓冲区的数组的引用到静态字段中。如果对数组的未检查更改可能会危及安全或其他重要属性，则需要更改处理。在许多情况下，存储数组的副本是一个较好的方法。"
        },
        "RU_INVOKE_RUN": {
            "ShortDescription": "在一个线程上调用 run（您是想启动它而不是调用它吗？）",
            "LongDescription": "{1} 显式调用一个线程的 run 方法（您是想启动它而不是调用它吗？）",
            "Details": "该方法显式调用了一个对象的 run 方法。&nbsp; 通常，类实现 Runnable 接口是因为它们将会在一个新线程中调用其 run 方法，在这种情况下，应该调用 start 方法。"
        },
        "SP_SPIN_ON_FIELD": {
            "ShortDescription": "方法在字段上自旋",
            "LongDescription": "在 {1} 中自旋 {2.givenClass}",
            "Details": "该方法在一个读取字段的循环中自旋。&nbsp; 编译器可以合法地将读取提升到循环之外，从而将代码转变为无限循环。&nbsp; 类应该更改为使用正确的同步（包括 wait 和 notify 调用）。"
        },
        "NS_DANGEROUS_NON_SHORT_CIRCUIT": {
            "ShortDescription": "潜在危险使用非短路逻辑",
            "LongDescription": "在 {1} 中潜在危险使用非短路逻辑",
            "Details": "这段代码似乎在使用非短路逻辑（例如，&amp;\n或 |）而不是短路逻辑（&& 或 ||）。此外，取决于左边的值，您可能并不希望评估右边的表达式（因为它会产生副作用、可能引发异常或可能开销较大）。\n非短路逻辑会使得即使结果可以从已知左侧得到，也会评估表达式的两侧。这可能效率低下，如果左侧控制了在评估右侧时可能产生的错误，可能 导致错误。\n请参见 <a href=\"https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.22.2\">Java 语言规范</a> 获取详细信息。"
        },
        "NS_NON_SHORT_CIRCUIT": {
            "ShortDescription": "可疑的非短路逻辑使用",
            "LongDescription": "在 {1} 中可疑的非短路逻辑使用",
            "Details": "这段代码似乎在使用非短路逻辑（例如，&amp;\n或 |）而不是短路逻辑（&& 或 ||）。\n非短路逻辑导致即使结果可以从已知左侧推断出来，表达式的两侧也会被评估。这可能效率低下，并且如果左边的表达式导致评估右边时可能发生错误，则可能导致错误。\n\n请参见 <a href=\"https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.22.2\">Java 语言规范</a> 获取详细信息。"
        },
        "TLW_TWO_LOCK_WAIT": {
            "ShortDescription": "持有两个锁时等待",
            "LongDescription": "在 {1} 中持有两个锁时调用 wait()",
            "Details": "在持有两个锁的情况下等待一个监视器可能导致死锁。执行 wait 仅会释放正在等待的对象上的锁，而不会释放任何其他锁。这不一定是一个 bug，但值得仔细检查。"
        },
        "TLW_TWO_LOCK_NOTIFY": {
            "deprecated": "true",
            "ShortDescription": "持有两个锁时通知",
            "LongDescription": "在 {1} 中持有两个锁时调用 notify() 或 notifyAll()",
            "Details": "代码在持有两个锁的情况下调用 notify() 或 notifyAll()。如果此通知意图唤醒一个持有相同锁的 wait()，则可能发生死锁，因为 wait 仅会放弃一个锁，而 notify 将无法获得两个锁，因此 notify 将无法成功。如果还有一个关于两个锁等待的警告，bug 的可能性就很高。"
        },
        "UW_UNCOND_WAIT": {
            "ShortDescription": "无条件等待",
            "LongDescription": "在 {1} 中进行无条件等待",
            "Details": "该方法包含对 wait() 的调用，但没有受条件控制流保护。代码应该在调用 wait 之前验证它 intends 等待的条件是否已经满足；任何先前的通知将被忽略。"
        },
        "UR_UNINIT_READ": {
            "ShortDescription": "构造函数中的未初始化字段读取",
            "LongDescription": "在 {1} 中未初始化的 {2.name} 读取",
            "Details": "该构造函数读取一个尚未分配值的字段。&nbsp; 这通常是因为程序员错误地使用了该字段，而不是构造函数的参数之一。"
        },
        "UR_UNINIT_READ_CALLED_FROM_SUPER_CONSTRUCTOR": {
            "ShortDescription": "从超类构造函数调用未初始化字段方法",
            "LongDescription": "{1} 中的 {2.name} 在从超类构造函数调用时未被初始化",
            "Details": "该方法在超类的构造函数中被调用。在这一点上，类的字段尚未初始化。为使之更为具体，考虑以下类：abstract class A { int hashCode; abstract Object getValue(); A() { hashCode = getValue().hashCode(); } } class B extends A { Object value; B(Object v) { this.value = v; } Object getValue() { return value; } } 当 A 被构造时，父类的构造函数被调用，子类的构造函数也被调用。因此，当子类的构造函数调用时，会读取一个未初始化的值为 hashCode。"
        },
        "UG_SYNC_SET_UNSYNC_GET": {
            "ShortDescription": "未同步的获取方法，已同步的设置方法",
            "LongDescription": "{1} 是未同步的，{2} 是同步的",
            "Details": "该类包含命名相似的获取和设置方法，其中设置方法是同步的，而获取方法不是。&nbsp; 这可能导致运行时的不正确行为，因为获取方法的调用者不一定会看到对象的一致状态。&nbsp; 获取方法应该是同步的。"
        },
        "IC_INIT_CIRCULARITY": {
            "ShortDescription": "初始化循环性",
            "LongDescription": "在 {0} 和 {1} 之间存在初始化循环性",
            "Details": "检测到两个类的静态初始化器之间存在循环性。&nbsp; 这种循环性可能导致许多意想不到的行为。"
        },
        "IC_SUPERCLASS_USES_SUBCLASS_DURING_INITIALIZATION": {
            "ShortDescription": "超类在初始化期间使用子类",
            "LongDescription": "{0} 的初始化访问了尚未初始化的类 {2}",
            "Details": "在一个类的初始化过程中，该类主动使用一个子类。该子类在此使用时尚未被初始化。例如，在以下代码中，InnerClassSingleton 将为 null。public class CircularClassInitialization { static class InnerClassSingleton extends CircularClassInitialization { static InnerClassSingleton singleton = new InnerClassSingleton(); } static CircularClassInitialization foo = InnerClassSingleton.singleton; }"
        },
        "IT_NO_SUCH_ELEMENT": {
            "ShortDescription": "Iterator next() 方法不能抛出 NoSuchElementException",
            "LongDescription": "{1} 不能抛出 NoSuchElementException",
            "Details": "该类实现了 Iterable 接口。&nbsp; 然而，其 next() 方法无法抛出 NoSuchElementException。&nbsp; 该方法应该更改为在没有更多元素返回时抛出该异常。"
        },
        "DL_SYNCHRONIZATION_ON_SHARED_CONSTANT": {
            "ShortDescription": "在字符串字面量上进行同步",
            "LongDescription": "在 {1} 中对字符串字面量进行同步",
            "Details": "该代码在字符串字面量上进行同步。private static String LOCK = \"LOCK\";\n...\nsynchronized (LOCK) { ... }\n...\n常量字符串是被内联的，并在 JVM 加载的所有其他类中共享。因此，这段代码锁定了其他代码可能也在锁定的内容。这可能导致非常奇怪和难以诊断的阻塞和死锁行为。请参见 <a href=\"http://www.javalobby.org/java/forums/t96352.html\">http://www.javalobby.org/java/forums/t96352.html</a> 和 <a href=\"http://jira.codehaus.org/browse/JETTY-352\">http://jira.codehaus.org/browse/JETTY-352</a>。有关更多信息，请参见 CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reused</a>。"
        },
        "DL_SYNCHRONIZATION_ON_INTERNED_STRING": {
            "ShortDescription": "在已内联字符串上进行同步",
            "LongDescription": "在 {1} 中对已内联字符串进行同步",
            "Details": "该代码在已内联字符串上进行同步。private static String LOCK = new String(\"LOCK\").intern();\n...\nsynchronized (LOCK) { ... }\n...\n常量字符串是被内联的，并在 JVM 加载的所有其他类中共享。因此，这段代码锁定了其他代码可能也在锁定的内容。这可能导致非常奇怪和难以诊断的阻塞和死锁行为。请参见 <a href=\"http://www.javalobby.org/java/forums/t96352.html\">http://www.javalobby.org/java/forums/t96352.html</a> 和 <a href=\"http://jira.codehaus.org/browse/JETTY-352\">http://jira.codehaus.org/browse/JETTY-352</a>。有关更多信息，请参见 CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reused</a>。"
        },
        "DL_SYNCHRONIZATION_ON_BOOLEAN": {
            "ShortDescription": "在布尔值上进行同步",
            "LongDescription": "在 {1} 中对布尔值进行同步",
            "Details": "该代码在一个装箱的原始字段常量上进行同步，例如布尔值。private static Boolean inited = Boolean.FALSE;\n...\nsynchronized (inited) { if (!inited) { init(); inited = Boolean.TRUE; } }\n...\n因为 normalmente 只存在两个布尔对象，所以这段代码可能会与其他无关代码在同一对象上同步，从而导致无响应和潜在的死锁。有关更多信息，请参见 CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reused</a>。"
        },
        "DL_SYNCHRONIZATION_ON_UNSHARED_BOXED_PRIMITIVE": {
            "ShortDescription": "在装箱的原始值上进行同步",
            "LongDescription": "在 {1} 中对装箱的原始值进行同步",
            "Details": "该代码在一个看似未共享的装箱原始值上进行同步，例如整数。private static final Integer fileLock = new Integer(1);\n...\nsynchronized (fileLock) { .. do something .. }\n...\n在这段代码中，fileLock 被重新声明为：private static final Object fileLock = new Object();\n\n现有的代码可能是没问题的，但这会引起混淆，未来的重构（如 IntelliJ 的“移除装箱”重构）可能会将其替换为通过 JVM 共享的内联整数对象，从而导致非常混乱的行为和潜在的死锁。"
        },
        "DL_SYNCHRONIZATION_ON_BOXED_PRIMITIVE": {
            "ShortDescription": "在装箱原始值上进行同步",
            "LongDescription": "在 {1} 中对 {2} 进行同步",
            "Details": "该代码在装箱的原始常量上进行同步，例如整数。private static Integer count = 0;\n...\nsynchronized (count) { count++; }\n...\n因为整数对象可能被缓存并共享，这段代码可能和其他无关代码在同一对象上同步，从而导致无响应和潜在的死锁。有关更多信息，请参见 CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reused</a>。"
        },
        "ESync_EMPTY_SYNC": {
            "ShortDescription": "空同步块",
            "LongDescription": "在 {1} 中存在空同步块",
            "Details": "该代码包含一个空的同步块：synchronized() {\n}\n空同步块比大多数人认识到的更加微妙且难以正确使用，并且空同步块几乎从未比其他较少人为的解决方案好。"
        },
        "IS_INCONSISTENT_SYNC": {
            "ShortDescription": "不一致的同步",
            "LongDescription": "不一致的同步 {1}；锁定时间的 {2}%",
            "Details": "该类的字段在同步方面似乎被不一致地访问。&nbsp; 该 bug 报告表明，bug 模式探测器判断该类包含混合的锁定和未锁定访问，至少一个锁定访问由该类自己的方法执行，并且未同步的字段访问（读取和写入）的数量不超过所有访问的三分之一，写入权重是读取的两倍。匹配这个 bug 模式的典型 bug 是忘记在设计为线程安全的类中的一个方法上进行同步。请注意，该探测器存在各种不准确来源；例如，探测器无法静态地检测持有锁的所有情况。&nbsp; 此外，即使探测器能准确地区分锁定与未锁定访问，相关代码仍然可能是正确的。"
        },
        "ML_SYNC_ON_FIELD_TO_GUARD_CHANGING_THAT_FIELD": {
            "ShortDescription": "在字段上进行同步来无效地尝试保护该字段",
            "LongDescription": "在 {2.givenClass} 上进行同步以无效地保护它",
            "Details": "该方法对一个字段进行同步，似乎试图保护该字段免受并发更新。但是，保护字段会在引用对象上获取锁，而不是在字段上。这可能无法提供所需的互斥访问，其他线程可能在引用对象上获取锁（出于其他目的）。这种模式的一个示例是：private Long myNtfSeqNbrCounter = new Long(0);\nprivate Long getNotificationSequenceNumber() { Long result = null; synchronized(myNtfSeqNbrCounter) { result = new Long(myNtfSeqNbrCounter.longValue() + 1); myNtfSeqNbrCounter = new Long(result.longValue()); } return result;\n}"
        },
        "ML_SYNC_ON_UPDATED_FIELD": {
            "ShortDescription": "方法在已更新的字段上进行同步",
            "LongDescription": "{1} 在已更新字段 {2.givenClass} 上进行同步",
            "Details": "该方法在从可变字段引用的对象上进行同步。这不太可能具有有用的语义，因为不同线程可能在不同对象上同步。"
        },
        "MS_OOI_PKGPROTECT": {
            "ShortDescription": "字段应移出接口并设置为包保护",
            "LongDescription": "{1} 应移出接口并设置为包保护",
            "Details": "一个在接口中定义的最终静态字段引用了一个可变对象，例如数组或哈希表。这个可变对象可能会被恶意代码或意外地从其他包中更改。为了解决这个问题，该字段需要移动到一个类中并设置为包保护，以避免这种漏洞。"
        },
        "MS_FINAL_PKGPROTECT": {
            "ShortDescription": "字段应该是最终的并且包保护",
            "LongDescription": "{1} 应该同时是最终的并且包保护",
            "Details": "一个可变静态字段可能会被恶意代码或意外地从其他包中更改。该字段可以被设置为包保护和/或最终，以避免这种漏洞。"
        },
        "MS_SHOULD_BE_REFACTORED_TO_BE_FINAL": {
            "ShortDescription": "字段不是最终的，但应该重构为最终的",
            "LongDescription": "{1} 不是最终的，但应该重构为最终的",
            "Details": "\n这个 public static 或 protected static 字段不是最终的，可能会被恶意代码或\n意外地从其他包中更改。\n该字段可以被设置为最终以避免\n这种漏洞。然而，静态初始化器包含多个写操作，因此需要一些重构来实现这一点。\n"
        },
        "MS_SHOULD_BE_FINAL": {
            "ShortDescription": "字段不是最终的，但应该是最终的",
            "LongDescription": "{1} 不是最终的，但应该是最终的",
            "Details": "\n这个 public static 或 protected static 字段不是最终的，可能会被恶意代码或从其他包中意外更改。该字段可以被设置为最终以避免这种漏洞。"
        },
        "MS_PKGPROTECT": {
            "ShortDescription": "字段应该是包保护的",
            "LongDescription": "{1} 应该是包保护的",
            "Details": "一个可变静态字段可能会被恶意代码或意外地更改。该字段可以被设置为包保护以避免这种漏洞。"
        },
        "MS_MUTABLE_HASHTABLE": {
            "ShortDescription": "字段是一个可变的 Hashtable",
            "LongDescription": "{1} 是一个可变的 Hashtable",
            "Details": "一个最终静态字段引用一个 Hashtable，可以被恶意代码或意外地从其他包中访问。这段代码可以自由修改 Hashtable 的内容。"
        },
        "MS_MUTABLE_COLLECTION": {
            "ShortDescription": "字段是一个可变的集合",
            "LongDescription": "{1} 是一个可变的集合",
            "Details": "一个可变的集合实例被赋值给一个最终静态字段，因此可以被恶意代码或意外地从其他包中更改。考虑将该字段封装在 Collections.unmodifiableSet/List/Map 等中，以避免这种漏洞。"
        },
        "MS_MUTABLE_COLLECTION_PKGPROTECT": {
            "ShortDescription": "字段是一个可变的集合，应该是包保护的",
            "LongDescription": "{1} 是一个可变的集合，应该是包保护的",
            "Details": "一个可变的集合实例被赋值给一个最终静态字段，因此可以被恶意代码或意外地从其他包中更改。该字段可以被设置为包保护以避免此漏洞。或者您可以将该字段封装在 Collections.unmodifiableSet/List/Map 等中，以避免这种漏洞。"
        },
        "MS_MUTABLE_ARRAY": {
            "ShortDescription": "字段是一个可变数组",
            "LongDescription": "{1} 是一个可变数组",
            "Details": "一个最终静态字段引用一个数组，可以被恶意代码或意外地从其他包中访问。这段代码可以自由修改数组的内容。"
        },
        "MS_CANNOT_BE_FINAL": {
            "ShortDescription": "字段不是最终的，无法保护免受恶意代码的影响",
            "LongDescription": "{1} 不是最终的，无法保护免受恶意代码的影响",
            "Details": "一个可变的静态字段可能被恶意代码或意外地从另一个包中更改。不幸的是，该字段的使用方式不允许对这个问题进行任何简单的修复。"
        },
        "ME_MUTABLE_ENUM_FIELD": {
            "ShortDescription": "枚举字段是公共且可变的",
            "LongDescription": "{1} 字段是公共且可变的",
            "Details": "一个可变的公共字段在公共枚举内部定义，因此可以被恶意代码或意外地从其他包中更改。尽管可变的枚举字段可用于惰性初始化，但将它们暴露给外部世界是个坏习惯。考虑将该字段声明为 final 和 / 或包私有。"
        },
        "ME_ENUM_FIELD_SETTER": {
            "ShortDescription": "公共枚举方法无条件设置其字段",
            "LongDescription": "{1} 无条件设置字段 {2.name}",
            "Details": "该公共方法在公共枚举中无条件设置枚举字段，因此该字段可能会被恶意代码或意外地从其他包中更改。尽管可变的枚举字段可用于惰性初始化，但将它们暴露给外部世界是个坏习惯。考虑删除此方法或将其声明为包私有。"
        },
        "IA_AMBIGUOUS_INVOCATION_OF_INHERITED_OR_OUTER_METHOD": {
            "ShortDescription": "潜在模糊调用继承或外部方法",
            "LongDescription": "在 {1} 中可能模糊调用继承或外部方法 {2}",
            "Details": "\n内部类正在调用一个可以解析为继承方法或外部类中定义的方法。\n例如，你调用一个在超类和外部方法中都定义的方法。\n根据 Java 语义，\n它将被解析为调用继承的方法，但这可能不是你所期望的。\n如果你真的打算调用继承的方法，\n可以通过在 super 上调用该方法来做到这一点（例如，invoke super.foo(17)），这样会对您的代码的其他读者和 SpotBugs 明确表示您想调用继承的方法，而不是外部类中的方法。\n如果调用了外部方法，则将调用继承的方法。但是，由于 SpotBugs 仅查看类文件，\n它无法区分对超类和外部方法的调用，它仍然会抱怨潜在的模糊调用。\n"
        },
        "NM_SAME_SIMPLE_NAME_AS_SUPERCLASS": {
            "ShortDescription": "类名不应掩盖超类的简单名称",
            "LongDescription": "类名 {0} 遮蔽了超类 {1} 的简单名称",
            "Details": "该类具有一个简单名称，与其超类的名称相同，除了其超类位于不同的包中（例如 extends）。\n这可能会导致极大的困惑，产生大量必须查看 import 语句以解析引用的情况，并可能在错误地定义不覆盖其超类中的方法的机会。"
        },
        "NM_SAME_SIMPLE_NAME_AS_INTERFACE": {
            "ShortDescription": "类名不应掩盖实现接口的简单名称",
            "LongDescription": "类名 {0} 遮蔽了实现接口 {1} 的简单名称",
            "Details": "该类/接口的简单名称与实现/扩展接口的名称相同，除了该接口位于不同的包中（例如 extends）。\n这可能会导致极大的困惑，产生大量必须查看 import 语句以解析引用的情况，并可能在错误地定义不覆盖其超类中的方法的机会。"
        },
        "NM_CLASS_NAMING_CONVENTION": {
            "ShortDescription": "类名应以大写字母开头",
            "LongDescription": "类名 {0} 未以大写字母开头",
            "Details": "类名应为名词，采用混合大小写，每个内部词的首字母应大写。尽量保持类名简洁且富有描述性。使用完整单词，避免首字母缩略词和缩写（除非缩写远比长版常用，例如 URL 或 HTML）。"
        },
        "NM_METHOD_NAMING_CONVENTION": {
            "ShortDescription": "方法名应以小写字母开头",
            "LongDescription": "方法名 {1} 未以小写字母开头",
            "Details": "\n方法应为动词，采用混合大小写，第一个字母小写，后续内部词的首字母大写。\n"
        },
        "NM_FIELD_NAMING_CONVENTION": {
            "ShortDescription": "非最终字段名应以小写字母开头，最终字段应为全大写字母并用下划线分隔",
            "LongDescription": "字段名 {1} 不符合命名约定。如果是最终的，应为全大写字母；否则应为驼峰命名。",
            "Details": "\n非最终字段的名称应为混合大小写，首字母小写，后续词的首字母大写。\n最终字段的名称应为全大写字母，单词之间用下划线（'_'）分隔。\n"
        },
        "NM_VERY_CONFUSING": {
            "ShortDescription": "非常混淆的方法名",
            "LongDescription": "方法 {1} 和 {3} 非常混淆",
            "Details": "引用的方法名称仅在大小写上不同。\n这非常易混淆，因为如果大小写一致，其中一个方法将覆盖另一个方法。\n"
        },
        "NM_VERY_CONFUSING_INTENTIONAL": {
            "ShortDescription": "非常混淆的方法名（但可能是有意的）",
            "LongDescription": "方法 {1} 和 {3} 非常混淆（但可能是有意的）",
            "Details": "引用的方法名称仅在大小写上不同。\n这非常易混淆，因为如果大小写一致，其中一个方法将覆盖另一个方法。根据其他方法的存在，这似乎两个方法同时存在是 intentional，但确实会导致混淆。\n您应该努力消除其中一个方法，除非您因 API 冻结而不得不保留两个。"
        },
        "NM_WRONG_PACKAGE": {
            "ShortDescription": "由于参数错误包，方法未能重写超类中的方法",
            "LongDescription": "{1} 未能重写超类中的方法，因为参数类型 {4} 不匹配超类参数类型 {5}",
            "Details": "子类中的方法未重写超类中的类似方法，因为参数类型与超类中相应参数的类型不完全匹配。例如，如果您有：import alpha.Foo;\n\npublic class A { public int f(Foo x) { return 17; }\n}\n----\nimport beta.Foo;\n\npublic class B extends A { public int f(Foo x) { return 42; }\n}\n方法在类 B 中定义，但没有重写 A 中定义的方法，因为参数类型来自不同包。"
        },
        "NM_WRONG_PACKAGE_INTENTIONAL": {
            "ShortDescription": "由于参数错误包，方法未能重写超类中的方法",
            "LongDescription": "{1} 未能重写超类中的方法，因为参数类型 {4} 不匹配超类参数类型 {5}",
            "Details": "子类中的方法未重写超类中的类似方法，因为参数类型与超类中相应参数的类型不完全匹配。例如，如果您有：import alpha.Foo;\n\npublic class A { public int f(Foo x) { return 17; }\n}\n----\nimport beta.Foo;\n\npublic class B extends A { public int f(Foo x) { return 42; } public int f(alpha.Foo x) { return 27; }\n}\n方法在类 B 中定义，但没有重写 A 中定义的方法，因为参数类型来自不同包。在这种情况下，子类确实定义了一个与超类中方法签名相同的方法，因此这通常是有意的。然而，这样的方法会导致极大的混淆。您应该强烈考虑删除或弃用与超类中类似但不相同签名的方法。"
        },
        "NM_CONFUSING": {
            "ShortDescription": "混淆的方法名",
            "LongDescription": "方法 {1} 和 {3} 混淆",
            "Details": "引用的方法名称仅在大小写上不同。"
        },
        "NM_METHOD_CONSTRUCTOR_CONFUSION": {
            "ShortDescription": "明显的方法/构造函数混淆",
            "LongDescription": "{1} 可能被认为是构造函数",
            "Details": "这个常规方法与其所在类同名。它很可能被认为是构造函数。如果它打算是构造函数，请删除 void 返回值的声明。如果您不小心定义了此方法，意识到错误，在构造函数中定义了正确的方法，但由于向后兼容性无法删除此方法，请将此方法弃用。\n"
        },
        "NM_LCASE_HASHCODE": {
            "ShortDescription": "类定义 hashcode(); 应该是 hashCode() 吗？",
            "LongDescription": "类 {0} 定义了 hashcode(); 应该是 hashCode() 吗？",
            "Details": "该类定义了一个名为 hashcode() 的方法。&nbsp; 此方法没有重写父类中的方法，可能是期望的行为。"
        },
        "NM_LCASE_TOSTRING": {
            "ShortDescription": "类定义 tostring(); 应该是 toString() 吗？",
            "LongDescription": "类 {0} 定义了 tostring(); 应该是 toString() 吗？",
            "Details": "该类定义了一个名为 tostring() 的方法。&nbsp; 此方法没有重写父类中的方法，可能是期望的行为。"
        },
        "NM_BAD_EQUAL": {
            "ShortDescription": "类定义 equal(Object); 应该是 equals(Object) 吗？",
            "LongDescription": "类 {0} 定义了 equal(Object); 应该是 equals(Object) 吗？",
            "Details": "该类定义了一个名为 equal(Object) 的方法。&nbsp; 此方法没有重写父类中的方法，可能是期望的行为。"
        },
        "NM_CLASS_NOT_EXCEPTION": {
            "ShortDescription": "类未从异常派生，尽管名称中包含 ‘Exception’",
            "LongDescription": "类 {0} 并未从异常派生，尽管它的名称中包含 ‘Exception’",
            "Details": "该类并未从另一个异常派生，但它的名称以 'Exception' 结尾。这会给使用该类的用户造成困惑。"
        },
        "RR_NOT_CHECKED": {
            "ShortDescription": "方法忽略了 InputStream.read() 的结果",
            "LongDescription": "{1} 忽略了 {2} 的结果",
            "Details": "该方法忽略了 read() 的一个变种的返回值，它可以返回多个字节。&nbsp; 如果不检查返回值，调用者将无法正确处理读取的字节数量少于请求的情况。&nbsp; 这是一种特别隐蔽的 bug，因为在许多程序中，从输入流的读取通常会读取到完整的数据量，导致程序只有在偶然的情况下失败。"
        },
        "SR_NOT_CHECKED": {
            "ShortDescription": "方法忽略了 InputStream.skip() 的结果",
            "LongDescription": "{1} 忽略了 {2} 的结果",
            "Details": "该方法忽略了 skip() 的返回值，它可以跳过多个字节。&nbsp; 如果不检查返回值，调用者将无法正确处理跳过的字节数量少于请求的情况。&nbsp; 这是一种特别隐蔽的 bug，因为在许多程序中，从输入流的跳过通常能跳过请求的数据量，导致程序在偶然情况下失败。不过在缓冲流的情况下，skip() 只会跳过缓冲区中的数据，通常无法跳过请求的字节数量。"
        },
        "SE_READ_RESOLVE_IS_STATIC": {
            "ShortDescription": "readResolve 方法不能被声明为静态方法。",
            "LongDescription": "{1} 应该被声明为实例方法，而不是静态方法",
            "Details": "为了使 readResolve 方法被序列化机制识别，必须不将其声明为静态方法。"
        },
        "SE_PRIVATE_READ_RESOLVE_NOT_INHERITED": {
            "ShortDescription": "私有 readResolve 方法未被子类继承",
            "LongDescription": "类 {0} 中的私有 readResolve 方法未被子类继承。",
            "Details": "该类定义了一个私有的 readResolve 方法。因为它是私有的，所以不会被子类继承。&nbsp; 这可能是有意的，并且可以接受，但应当进行审查以确保这是期望的行为。"
        },
        "SE_READ_RESOLVE_MUST_RETURN_OBJECT": {
            "ShortDescription": "readResolve 方法必须声明为返回类型为 Object。",
            "LongDescription": "方法 {1} 必须声明为返回类型为 Object 而不是 {1.returnType}",
            "Details": "为了使 readResolve 方法被序列化机制识别，必须声明返回类型为 Object。"
        },
        "SE_TRANSIENT_FIELD_OF_NONSERIALIZABLE_CLASS": {
            "ShortDescription": "不可序列化类的瞬态字段。",
            "LongDescription": "{1.givenClass} 是瞬态的，但 {0} 不是可序列化的",
            "Details": "该字段被标记为瞬态，但类并不是可序列化的，因此将其标记为瞬态完全没有效果。&nbsp; 这可能是代码之前版本的遗留标记，当时该类是可序列化的，或者可能表明对序列化工作原理的误解。&nbsp; 仅在设置了特定选项时才报告此 bug。"
        },
        "SE_TRANSIENT_FIELD_NOT_RESTORED": {
            "ShortDescription": "瞬态字段未在反序列化时设置。",
            "LongDescription": "字段 {1} 是瞬态的，但未在反序列化时设置",
            "Details": "该类包含一个在类的多个位置更新的字段，因此似乎是类状态的一部分。但是，由于该字段被标记为瞬态，并且未在 readObject 或 readResolve 中设置，它将在任何反序列化的类实例中包含默认值。"
        },
        "SE_PREVENT_EXT_OBJ_OVERWRITE": {
            "ShortDescription": "防止覆盖可外部化对象",
            "LongDescription": "任何调用者都可以通过使用 readExternal() 方法重置对象的值。",
            "Details": "该方法必须被声明为公共的，并且未能保护，以防恶意调用者，因此代码允许任何调用者随时重置对象的值。为了防止可外部化对象的覆盖，您可以使用一个在实例字段填充后设置的布尔标志。您还可以通过在私有锁对象上进行同步来防止竞态条件。"
        },
        "SE_METHOD_MUST_BE_PRIVATE": {
            "ShortDescription": "方法必须是私有的以使序列化工作",
            "LongDescription": "方法 {1.givenClass} 必须是私有的才能在序列化/反序列化 {0} 时被调用",
            "Details": "该类实现了 Serializable 接口，并定义了一个用于自定义序列化/反序列化的方法。但是由于该方法未声明为私有，因此将被序列化/反序列化 API 忽略。"
        },
        "SE_NO_SUITABLE_CONSTRUCTOR_FOR_EXTERNALIZATION": {
            "ShortDescription": "类是可外部化的，但未定义无参构造函数",
            "LongDescription": "{0} 是可外部化的，但未定义无参构造函数",
            "Details": "该类实现了 Externalizable 接口，但未定义公共无参构造函数。当可外部化对象被反序列化时，首先需要通过调用公共无参构造函数来构造它。由于该类没有此构造函数，因此序列化和反序列化将在运行时失败。"
        },
        "SE_NO_SUITABLE_CONSTRUCTOR": {
            "ShortDescription": "类是可序列化的，但其超类未定义无参构造函数",
            "LongDescription": "{0} 是可序列化的，但其超类未定义可访问的无参构造函数",
            "Details": "该类实现了 Serializable 接口，并且其超类没有实现。这样的对象在反序列化时，超类的字段需要通过调用超类的无参构造函数进行初始化。由于超类没有此构造函数，序列化和反序列化将在运行时失败。"
        },
        "SE_NO_SERIALVERSIONID": {
            "ShortDescription": "类是可序列化的，但未定义 serialVersionUID",
            "LongDescription": "{0} 是可序列化的；考虑声明 serialVersionUID",
            "Details": "该类实现了 Serializable 接口，但未定义 serialVersionUID 字段。&nbsp; 仅添加对 .class 对象的引用的简单更改将为类添加合成字段，这不幸地将改变隐式的 serialVersionUID（例如，添加对某个对象的引用会生成一个静态字段）。此外，不同的源代码到字节码编译器可能使用不同的命名约定来生成类对象或内部类引用的合成变量。为了确保跨版本的可序列化性，请考虑添加显式的 serialVersionUID。"
        },
        "SE_COMPARATOR_SHOULD_BE_SERIALIZABLE": {
            "ShortDescription": "比较器未实现 Serializable",
            "LongDescription": "{0} 实现 Comparator 但未实现 Serializable",
            "Details": "该类实现了 Comparator 接口。您应该考虑它是否也应该实现 Serializable 接口。如果比较器用于构造有序集合，如 PriorityQueue，则只有当比较器也是可序列化时，构建的集合才能被序列化。由于大多数比较器几乎没有状态，因此使其可序列化通常是容易的，也是良好的防御性编程。"
        },
        "SF_SWITCH_FALLTHROUGH": {
            "ShortDescription": "发现 switch 语句，其中一个 case 通过到下一个 case",
            "LongDescription": "在 {1} 中发现 switch 语句，其中一个 case 通过到下一个 case",
            "Details": "该方法包含一个 switch 语句，其中一个 case 分支将通过到下一个 case。通常，您需要以 break 或 return 结束此 case。"
        },
        "SF_SWITCH_NO_DEFAULT": {
            "ShortDescription": "发现 switch 语句，缺少 default case",
            "LongDescription": "在 {1} 中发现 switch 语句，缺少 default case",
            "Details": "该方法包含一个 switch 语句，缺少 default case。通常，您需要提供一个 default case。由于分析仅查看生成的字节码，如果 default case 在 switch 语句的末尾，且 switch 语句中的其他 case 没有 break 声明，则可能错误地触发此警告。"
        },
        "SF_DEAD_STORE_DUE_TO_SWITCH_FALLTHROUGH": {
            "ShortDescription": "由于 switch 语句的 fall through 导致的无用存储",
            "LongDescription": "前一个 case 的值 {2.givenClass} 在此被覆盖，原因是 switch 语句的 fall through",
            "Details": "由于 switch case 的 fall through，在此覆盖了前一个 case 中存储的值。您可能忘了在前一个 case 的末尾放置 break 或 return。"
        },
        "SF_DEAD_STORE_DUE_TO_SWITCH_FALLTHROUGH_TO_THROW": {
            "ShortDescription": "由于 switch 语句的 fall through 到 throw 导致的无用存储",
            "LongDescription": "前一个 case 的值 {2.givenClass} 在此丢失，原因是 switch 语句的 fall through 到 throw",
            "Details": "由于 switch case 的 fall through，前一个 case 中存储的值在此被忽略。您可能忘了在前一个 case 的末尾放置 break 或 return。"
        },
        "WS_WRITEOBJECT_SYNC": {
            "ShortDescription": "类的 writeObject() 方法是同步的，但其他方法不是",
            "LongDescription": "{0} 的 writeObject 方法是同步的，但其他方法不是",
            "Details": "该类具有一个同步的方法；但是，该类没有其他方法是同步的。"
        },
        "RS_READOBJECT_SYNC": {
            "ShortDescription": "类的 readObject() 方法是同步的",
            "LongDescription": "{0} 的 readObject 方法是同步的",
            "Details": "这个可序列化类定义了一个同步的 readObject() 方法。&nbsp; 根据定义，通过反序列化创建的对象只能被一个线程访问，因此没有必要进行同步。&nbsp; 如果该方法本身导致对象对另一个线程可见，则这就是非常可疑的编码风格的例子。"
        },
        "SE_NONSTATIC_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID 不是静态的",
            "LongDescription": "{1} 不是静态的",
            "Details": "该类定义了一个非静态的 serialVersionUID 字段。&nbsp; 如果它打算为序列化指定版本 UID，则该字段应设置为静态。"
        },
        "SE_NONFINAL_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID 不是最终的",
            "LongDescription": "{1} 不是最终的",
            "Details": "该类定义了一个非最终的 serialVersionUID 字段。&nbsp; 如果它打算为序列化指定版本 UID，则该字段应设置为最终。"
        },
        "SE_NONLONG_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID 不是长整型",
            "LongDescription": "{1} 不是长整型",
            "Details": "该类定义了一个非长整型的 serialVersionUID 字段。&nbsp; 如果它打算为序列化指定版本 UID，则该字段应设置为长整型。"
        },
        "SE_BAD_FIELD": {
            "ShortDescription": "可序列化类中的非瞬态非可序列化实例字段",
            "LongDescription": "类 {0} 定义了非瞬态非可序列化实例字段 {1.name}",
            "Details": "该可序列化类定义了一个非基本类型的实例字段，该字段既不是瞬态的，也不是可序列化的，并且未实现 Serializable 接口或 Externalizable 接口。&nbsp; 如果该字段中存储的对象不是可序列化的，则该类的对象在反序列化时将无法正确还原。"
        },
        "SE_BAD_FIELD_INNER_CLASS": {
            "ShortDescription": "不可序列化类具有可序列化的内部类",
            "LongDescription": "{0} 是可序列化的，但也是不可序列化类的内部类",
            "Details": "该可序列化类是不可序列化类的内部类。&nbsp; 因此，尝试序列化它也将尝试关联与之相关联的外部类的实例，导致运行时错误。&nbsp; 如果可能，应该将内部类声明为静态内部类，以解决此问题。将外部类设为可序列化也能奏效，但这意味着序列化内部类的实例将始终同时序列化外部类的实例，这通常并不是您真正想要的行为。"
        },
        "SE_INNER_CLASS": {
            "ShortDescription": "可序列化的内部类",
            "LongDescription": "{0} 是可序列化的内部类",
            "Details": "该可序列化类是一个内部类。&nbsp; 尝试序列化它也会序列化相关联的外部实例。该外部实例是可序列化的，因此这不会失败，但它可能会序列化比预期多得多的数据。&nbsp; 如果可能，应该将内部类声明为静态内部类（也称为嵌套类），以解决此问题。"
        },
        "SE_BAD_FIELD_STORE": {
            "ShortDescription": "非可序列化值存储在可序列化类的实例字段中",
            "LongDescription": "{2} 存储在非瞬态字段 {1.givenClass} 中",
            "Details": "一个非可序列化的值存储在可序列化类的非瞬态字段中。"
        },
        "SC_START_IN_CTOR": {
            "ShortDescription": "构造函数调用 Thread.start()",
            "LongDescription": "{1} 调用 {2}",
            "Details": "构造函数启动了一个线程。如果该类被扩展/子类化，这可能是错误的，因为线程将在子类构造函数开始之前启动。"
        },
        "SS_SHOULD_BE_STATIC": {
            "ShortDescription": "未读字段：这个字段应该是静态的吗？",
            "LongDescription": "未读字段：{1}；这个字段应该是静态的吗？",
            "Details": "该类包含一个实例最终字段，它被初始化为编译时静态值。考虑将该字段声明为静态。"
        },
        "UUF_UNUSED_FIELD": {
            "ShortDescription": "未使用的字段",
            "LongDescription": "未使用的字段：{1}",
            "Details": "该字段从未使用过。&nbsp; 考虑将其从类中移除。"
        },
        "URF_UNREAD_FIELD": {
            "ShortDescription": "未读字段",
            "LongDescription": "未读字段：{1}",
            "Details": "该字段从未读取。&nbsp; 考虑将其从类中移除。"
        },
        "UUF_UNUSED_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未使用的公共或受保护字段",
            "LongDescription": "未使用的公共或受保护字段：{1}",
            "Details": "该字段从未使用过。&nbsp;\n该字段是公共或受保护的，因此可能打算与未在分析中查看的类一起使用。如果不是，\n考虑除去该字段。"
        },
        "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未读公共/受保护字段",
            "LongDescription": "未读公共/受保护字段：{1}",
            "Details": "该字段从未读取。&nbsp;\n该字段是公共或受保护的，因此可能打算与未在分析中查看的类一起使用。如果不是，\n考虑除去该字段。"
        },
        "QF_QUESTIONABLE_FOR_LOOP": {
            "ShortDescription": "for 循环中复杂、微妙或错误的增量",
            "LongDescription": "for 循环中复杂、微妙或错误的增量 {1}",
            "Details": "您确定这个 for 循环正在递增/递减正确的变量吗？似乎另一个变量被初始化并通过 for 循环进行检查。"
        },
        "UWF_NULL_FIELD": {
            "ShortDescription": "字段仅设置为 null",
            "LongDescription": "字段仅设置为 null：{1}",
            "Details": "对此字段的所有写入都是常量值 null，因此所有读取该字段将返回 null。\n检查是否有错误，或者如果没有用处则移除它。"
        },
        "UWF_UNWRITTEN_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未写入的公共或受保护字段",
            "LongDescription": "未写入的公共或受保护字段：{1}",
            "Details": "对该公共/受保护字段未看到任何写入。&nbsp; 所有读取它将返回默认值。检查是否有错误（是否应已初始化？），或者如果没有用处则移除它。"
        },
        "UWF_UNWRITTEN_FIELD": {
            "ShortDescription": "未写入字段",
            "LongDescription": "未写入字段：{1}",
            "Details": "该字段从未被写入。&nbsp; 所有读取它将返回默认值。检查是否有错误（是否应已初始化？），或者如果没有用处则移除它。"
        },
        "ST_WRITE_TO_STATIC_FROM_INSTANCE_METHOD": {
            "ShortDescription": "通过实例方法写入静态字段",
            "LongDescription": "从实例方法 {1} 写入静态字段 {2}",
            "Details": "该实例方法写入一个静态字段。如果操作多个实例，这样做很容易出错，\n通常也是不好的做法。\n"
        },
        "NP_LOAD_OF_KNOWN_NULL_VALUE": {
            "ShortDescription": "已知的空值加载",
            "LongDescription": "在 {1} 中加载已知的空值",
            "Details": "此时引用的变量由于之前的空值检查已知为空。虽然这是有效的，但这可能是错误的（也许您\n打算引用不同的变量，或者之前的空值检查应该是检查该\n变量是否非空）。\n"
        },
        "NP_DEREFERENCE_OF_READLINE_VALUE": {
            "ShortDescription": "没有空值检查的 readLine() 结果解引用",
            "LongDescription": "在 {1} 中没有空值检查的 readLine() 结果解引用",
            "Details": "调用 readLine() 的结果在没有检查结果是否为空的情况下被解引用。如果没有更多的文本行\n可读，readLine() 将返回空，并且解引用将生成空指针异常。\n"
        },
        "NP_IMMEDIATE_DEREFERENCE_OF_READLINE": {
            "ShortDescription": "立即解引用 readLine() 的结果",
            "LongDescription": "在 {1} 中立即解引用 readLine() 的结果",
            "Details": "调用 readLine() 的结果立即被解引用。如果没有更多的文本行\n可读，readLine() 将返回空，并且解引用将生成空指针异常。\n"
        },
        "NP_UNWRITTEN_FIELD": {
            "ShortDescription": "未写入字段的读取",
            "LongDescription": "在 {1} 中读取未写入字段 {2.name}",
            "Details": "程序正在解引用一个似乎从未写入非空值的字段。\n除非通过分析未能检测到的一些机制对字段进行了初始化，\n否则解引用该值将生成空指针异常。\n"
        },
        "NP_UNWRITTEN_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未写入公共或受保护字段的读取",
            "LongDescription": "在 {1} 中读取未写入的公共或受保护字段 {2.name}",
            "Details": "程序正在解引用一个似乎从未写入非空值的公共或受保护的字段。\n除非通过分析未能检测到的一些机制对字段进行了初始化，\n否则解引用该值将生成空指针异常。\n"
        },
        "SIC_THREADLOCAL_DEADLY_EMBRACE": {
            "ShortDescription": "非静态内部类和线程局部的致命拥抱",
            "LongDescription": "{0} 需要为 _static_ 以避免与 {1} 之间的致命拥抱",
            "Details": "这个类是一个内部类，但可能应该是一个静态内部类。因为它不是静态的，所以存在内部类和外部类中的线程局部之间发生致命拥抱的严重危险。由于内部类不是静态的，它保留了对外部类的引用。如果线程局部包含内部类的实例引用，内部和外部实例将都能被访问，而不适合进行垃圾回收。\n"
        },
        "SIC_INNER_SHOULD_BE_STATIC": {
            "ShortDescription": "应该是一个静态内部类",
            "LongDescription": "{0} 应该是一个 _static_ 内部类吗？",
            "Details": "这个类是一个内部类，但没有使用其创建它的对象的嵌入引用。\n这个引用使类的实例变得更大，并可能使对创建者对象的引用存活得比必要的时间更长。\n如果可能，应该将该类设为静态。\n"
        },
        "UWF_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR": {
            "ShortDescription": "构造函数中未初始化的字段，但在没有空值检查的情况下解引用",
            "LongDescription": "{1.givenClass} 在构造函数中未初始化，并在 {2} 中解引用",
            "Details": "该字段在任何构造函数中都未初始化，因此在对象构造后可能为 null。\n在其他地方，它被加载并在没有空值检查的情况下解引用。\n这可能是错误或可疑的设计，因为如果在初始化之前解引用该字段，将生成空指针异常。\n"
        },
        "SIC_INNER_SHOULD_BE_STATIC_ANON": {
            "ShortDescription": "可以重构为命名的静态内部类",
            "LongDescription": "类 {0} 可以重构为一个命名的 _static_ 内部类",
            "Details": "这个类是一个内部类，但没有使用其创建它的对象的嵌入引用。这个引用使类的实例变得更大，并可能使对创建者对象的引用存活得比必要的时间更长。 如果可能，应该将该类设为静态。由于匿名内部类不能标记为静态，因此这样做将需要重构内部类，使其成为命名的内部类。"
        },
        "SIC_INNER_SHOULD_BE_STATIC_NEEDS_THIS": {
            "ShortDescription": "可以重构为静态内部类",
            "LongDescription": "类 {0} 可以重构为 _static_ 内部类",
            "Details": "这个类是一个内部类，但在创建内部对象时没有使用其嵌入引用。这个引用使类的实例变得更大，并可能使对创建者对象的引用存活得比必要的时间更长。 如果可能，应该将该类设为静态。由于在创建内部实例时需要对外部对象的引用，因此内部类需要重构，以便将对外部实例的引用传递给内部类的构造函数。"
        },
        "WA_NOT_IN_LOOP": {
            "ShortDescription": "等待不在循环中",
            "LongDescription": "在 {1} 中等待不在循环中",
            "Details": "该方法包含对不在循环中的调用。如果监视器用于多个条件，则调用者打算等待的条件可能不是实际发生的条件。"
        },
        "WA_AWAIT_NOT_IN_LOOP": {
            "ShortDescription": "Condition.await() 不在循环中",
            "LongDescription": "在 {1} 中 Condition.await() 不在循环中",
            "Details": "该方法包含对不在循环中的调用。如果该对象用于多个条件，则调用者打算等待的条件可能不是实际发生的条件。"
        },
        "NO_NOTIFY_NOT_NOTIFYALL": {
            "ShortDescription": "使用 notify() 而不是 notifyAll()",
            "LongDescription": "在 {1} 中使用 notify 而不是 notifyAll",
            "Details": "该方法调用了 notify，而不是 notifyAll。Java 监视器通常用于多个条件。仅调用 notify 将唤醒一个线程，这意味着唤醒的线程可能不是等待调用者刚刚满足的条件的线程。"
        },
        "UC_USELESS_VOID_METHOD": {
            "ShortDescription": "无用的非空 void 方法",
            "LongDescription": "方法 {1} 似乎是无用的",
            "Details": "我们的分析显示，该非空的 void 方法实际上没有执行任何有用的工作。请检查它：可能代码中有错误或其主体可以完全移除。我们正在尽量减少误报，但在某些情况下，此警告可能是错误的。常见的误报情况包括：该方法旨在触发某个类的加载，从而可能造成副作用。该方法旨在隐式抛出某个晦涩的异常。"
        },
        "UC_USELESS_CONDITION": {
            "ShortDescription": "条件没有效果",
            "LongDescription": "无用的条件：在此时已知 {2}",
            "Details": "该条件始终产生与先前缩减的相关变量的值相同的结果。可能是另有所指，或条件可以被移除。"
        },
        "UC_USELESS_CONDITION_TYPE": {
            "ShortDescription": "由于变量类型条件没有效果",
            "LongDescription": "无用的条件：由于变量类型为 {3}，因此它始终是 {2}",
            "Details": "该条件由于相关变量的类型范围始终产生相同的结果。可能是另有所指，或条件可以被移除。"
        },
        "UC_USELESS_OBJECT": {
            "ShortDescription": "创建了无用的对象",
            "LongDescription": "在方法 {1} 的变量 {2} 中存储了无用的对象",
            "Details": "我们的分析显示，这个对象是无用的。它被创建和修改，但其值从未超出该方法或产生任何副作用。要么是错误，预期使用该对象，要么它可以被移除。这种分析很少产生误报。常见的误报情况包括：该对象用于隐式抛出某个晦涩的异常。该对象作为存根用于概括代码。该对象用于持有对弱引用/软引用对象的强引用。"
        },
        "UC_USELESS_OBJECT_STACK": {
            "ShortDescription": "创建了栈上的无用对象",
            "LongDescription": "在方法 {1} 中创建了无用的对象",
            "Details": "这个对象仅被创建以执行一些没有任何副作用的修改。可能是另有所指，或者该对象可以被移除。"
        },
        "RANGE_ARRAY_INDEX": {
            "ShortDescription": "数组索引超出范围",
            "LongDescription": "数组索引超出范围：{3}",
            "Details": "执行了数组操作，但数组索引超出范围，这将在运行时导致 ArrayIndexOutOfBoundsException。"
        },
        "RANGE_ARRAY_OFFSET": {
            "ShortDescription": "数组偏移量超出范围",
            "LongDescription": "数组偏移量超出范围：{3}",
            "Details": "使用数组参数和偏移量参数调用方法，但偏移量超出范围。这将在运行时导致 IndexOutOfBoundsException。"
        },
        "RANGE_ARRAY_LENGTH": {
            "ShortDescription": "数组长度超出范围",
            "LongDescription": "数组长度超出范围：{3}",
            "Details": "使用数组参数和长度参数调用方法，但长度超出范围。这将在运行时导致 IndexOutOfBoundsException。"
        },
        "RANGE_STRING_INDEX": {
            "ShortDescription": "字符串索引超出范围",
            "LongDescription": "调用 {5} 时字符串索引超出范围：{3}",
            "Details": "调用字符串方法时指定的字符串索引超出范围。这将在运行时导致 StringIndexOutOfBoundsException。"
        },
        "RV_CHECK_FOR_POSITIVE_INDEXOF": {
            "ShortDescription": "方法检查 String.indexOf 的结果是否为正",
            "LongDescription": "{1} 检查 String.indexOf 的结果是否为正",
            "Details": "该方法调用 String.indexOf 并检查结果是否为正或非正。通常是检查结果是否为负或非负。仅在检查的子字符串出现在字符串的开头以外的地方时，才会为正。"
        },
        "RV_DONT_JUST_NULL_CHECK_READLINE": {
            "ShortDescription": "方法在检查非空后丢弃 readLine 的结果",
            "LongDescription": "{1} 在检查非空后丢弃 readLine 的结果",
            "Details": "readLine 返回的值在检查它是否为非空后被丢弃。在几乎所有情况下，如果结果非空，您会想使用该非空值。再次调用 readLine 将为您提供不同的行。"
        },
        "RV_RETURN_VALUE_IGNORED_INFERRED": {
            "ShortDescription": "方法忽略返回值，这合适吗？",
            "LongDescription": "在 {1} 中忽略了 {2.givenClass} 的返回值，这合适吗？",
            "Details": "该代码调用一个方法并忽略返回值。返回值的类型与调用方法的类型相同，\n我们的分析表明返回值可能很重要（例如，忽略的返回值）。我们猜测，忽略返回值可能是个坏主意，仅从方法主体的简单分析来看。您可以使用 @CheckReturnValue 注释来指示 SpotBugs 是否重要或可接受忽略该方法的返回值。\n请仔细调查以决定是否可以忽略返回值。\n"
        },
        "RV_RETURN_VALUE_IGNORED_NO_SIDE_EFFECT": {
            "ShortDescription": "没有副作用的方法的返回值被忽略",
            "LongDescription": "在 {1} 中忽略了返回值 {2.givenClass}，但该方法没有副作用",
            "Details": "该代码调用一个方法并忽略返回值。然而，我们的分析显示，该方法（包括其在子类中的实现，如果有的话）不产生任何作用，除了返回值。因此，这个调用可以被移除。\n我们正在尽量减少误报，但在某些情况下，此警告可能是错误的。常见的误报情况包括：该方法旨在被重写，并在其他项目中产生副作用，而这些超出了分析的范围。该方法的调用旨在触发类加载，可能有副作用。该方法的调用仅用于获得某些异常。如果您觉得我们的假设不正确，可以使用 @CheckReturnValue 注释来指示 SpotBugs 忽略该方法的返回值是可接受的。\n"
        },
        "RV_RETURN_VALUE_IGNORED": {
            "ShortDescription": "方法忽略返回值",
            "LongDescription": "在 {1} 中忽略了 {2.givenClass} 的返回值",
            "Details": "此方法的返回值应该被检查。常见的警告原因是调用一个不可变对象的方法，\n认为它会更新该对象。例如，在以下代码片段中，\nString dateString = getHeaderField(name);\ndateString.trim();\n程序员似乎认为 trim() 方法会更新 dateString 引用的字符串。但由于字符串是不可变的，trim() 函数返回一个新字符串值，而该值在这里被忽略。代码应该被更正为：String dateString = getHeaderField(name);\ndateString = dateString.trim();\n"
        },
        "RV_RETURN_VALUE_IGNORED_BAD_PRACTICE": {
            "ShortDescription": "方法忽略异常返回值",
            "LongDescription": "在 {1} 中忽略了 {2} 的异常返回值",
            "Details": "该方法返回一个未检查的值。应检查返回值，因为它可能指示异常或意外的功能执行。例如，\n该方法返回 false\n如果文件无法成功删除（而不是抛出一个异常）。\n如果您不检查结果，就不会注意到方法调用是否通过返回不典型的返回值信号表示意外行为。\n"
        },
        "RV_CHECK_COMPARETO_FOR_SPECIFIC_RETURN_VALUE": {
            "ShortDescription": "代码检查 compareTo 返回的特定值",
            "LongDescription": "检查 {2.givenClass} 的返回值是否等于 {3}",
            "Details": "该代码调用了 compareTo 或 compare 方法，并检查返回值是否为特定值，\n例如 1 或 -1。在调用这些方法时，您只应检查结果的符号，而不是任何特定的非零值。虽然许多或大多数 compareTo 和 compare 方法只返回 -1、0 或 1，但其中一些将返回其他值。"
        },
        "RV_EXCEPTION_NOT_THROWN": {
            "ShortDescription": "创建异常但未抛出",
            "LongDescription": "{2.givenClass} 在 {1} 中未抛出",
            "Details": "该代码创建了一个异常（或错误）对象，但没有对其进行任何操作。例如，\n类似于 if (x < 0) { new IllegalArgumentException(\"x must be nonnegative\");\n}\n这可能是程序员的意图是抛出创建的异常：if (x < 0) { throw new IllegalArgumentException(\"x must be nonnegative\");\n}\n"
        },
        "NP_ALWAYS_NULL": {
            "ShortDescription": "空指针解引用",
            "LongDescription": "在 {1} 中解引用空指针 {2.givenClass}",
            "Details": "在这里解引用了一个空指针。这会在代码执行时导致错误。"
        },
        "NP_CLOSING_NULL": {
            "ShortDescription": "在始终为空的值上调用 close()",
            "LongDescription": "无法关闭 {2.givenClass}，因为它在 {1} 中始终为空",
            "Details": "close() 被调用在一个始终为空的值上。如果执行此语句，\n将发生空指针异常。但更大的风险在于您从未关闭应该关闭的内容。"
        },
        "NP_STORE_INTO_NONNULL_FIELD": {
            "ShortDescription": "将空值存储到标注为 @Nonnull 的字段中",
            "LongDescription": "在 {1} 中将空值存储到标注为 @Nonnull 的字段 {2.givenClass} 中",
            "Details": "将可能为 null 的值存储到已标注为 @Nonnull 的字段中。"
        },
        "NP_ALWAYS_NULL_EXCEPTION": {
            "ShortDescription": "在异常路径上方法中的空指针解引用",
            "LongDescription": "在异常路径上解引用 {2.givenClass} 的空指针在 {1}",
            "Details": "在异常路径上解引用空指针。在代码执行时，这会导致错误。\n请注意，由于 SpotBugs 当前不会修剪不可行的异常路径，\n这可能是误警告。同样，请注意，SpotBugs 将 switch 语句的默认情况视为异常路径，\n因为默认情况通常是不可行的。"
        },
        "NP_PARAMETER_MUST_BE_NONNULL_BUT_MARKED_AS_NULLABLE": {
            "ShortDescription": "参数必须为非空但标记为可空",
            "LongDescription": "{2} 必须为非空但标记为可空",
            "Details": "此参数始终以需要它为非空的方式使用，\n但该参数显式标注为 Nullable。参数的使用或注释有误。"
        },
        "NP_NULL_ON_SOME_PATH": {
            "ShortDescription": "可能的空指针解引用",
            "LongDescription": "在 {1} 中可能的空指针解引用 {2.givenClass}",
            "Details": "有一条语句分支，如果执行，确保将解引用一个空值，这\n将导致在代码执行时出现错误。\n当然，问题可能是该分支或语句不可行，空指针异常可能根本无法执行；判断这一点超出了 SpotBugs 的能力。"
        },
        "NP_NULL_ON_SOME_PATH_MIGHT_BE_INFEASIBLE": {
            "ShortDescription": "可能的空指针解引用，分支可能是不可行的",
            "LongDescription": "在 {1} 中可能的空指针解引用 {2.givenClass}，在可能不可行的分支上",
            "Details": "有一条语句分支，如果执行，确保将解引用一个空值，这\n将导致在代码执行时出现错误。\n当然，问题可能是该分支或语句不可行，空指针异常可能根本无法执行；判断这一点超出了 SpotBugs 的能力。\n由于之前对此值进行了空值测试，\n这是一种确定的可能性。"
        },
        "NP_NULL_ON_SOME_PATH_EXCEPTION": {
            "ShortDescription": "在异常路径上方法中的可能空指针解引用",
            "LongDescription": "在异常路径上在 {1} 中可能的空指针解引用 {2.givenClass}",
            "Details": "在某些异常控制路径上解引用的值是空指针。\n这可能会导致在代码执行时出现错误。\n请注意，由于 SpotBugs 当前不会修剪不可行的异常路径，\n这可能是误警告。同样，请注意，SpotBugs 将 switch 语句的默认情况视为异常路径，\n因为默认情况通常是不可行的。"
        },
        "NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE": {
            "ShortDescription": "由于被调用方法的返回值导致可能的空指针解引用",
            "LongDescription": "在 {1} 中由于被调用方法的返回值导致可能的空指针解引用",
            "Details": "一个方法的返回值在没有空值检查的情况下被解引用，\n该方法的返回值一般应该检查是否为 null。这可能会导致\n在代码执行时出现错误。\n"
        },
        "NP_NULL_PARAM_DEREF_NONVIRTUAL": {
            "ShortDescription": "非虚拟方法调用传递 null 给非空参数",
            "LongDescription": "在 {1} 中的非虚拟方法调用为 {2.givenClass} 的非空参数传递了 null",
            "Details": "一个可能为 null 的值被传递给一个非空方法参数。要么该参数被标注为应该始终非空的参数，要么分析显示它将始终被解引用。"
        },
        "NP_NULL_PARAM_DEREF_ALL_TARGETS_DANGEROUS": {
            "ShortDescription": "方法调用为非空参数传递 null",
            "LongDescription": "在 {1} 中为 {2.givenClass} 的非空参数传递 null",
            "Details": "在调用点处传递一个可能为 null 的值，而所有已知目标方法都要求该参数为非空。要么该参数被标注为应该始终非空的参数，要么分析显示它将始终被解引用。"
        },
        "NP_NULL_PARAM_DEREF": {
            "ShortDescription": "方法调用为非空参数传递 null",
            "LongDescription": "在 {1} 中为 {2.givenClass} 的非空参数传递 null",
            "Details": "该方法调用为非空方法参数传递了一个 null 值。要么该参数被标注为应该始终非空的参数，要么分析显示它将始终被解引用。"
        },
        "NP_NONNULL_PARAM_VIOLATION": {
            "ShortDescription": "方法调用为非空参数传递 null",
            "LongDescription": "在 {1} 中为 {2.givenClass} 的非空参数传递 null",
            "Details": "该方法将一个 null 值作为必须为非空的方法参数传递。要么该参数已显式标记为 @Nonnull，要么分析已确定该参数总是被解引用。"
        },
        "NP_NONNULL_RETURN_VIOLATION": {
            "ShortDescription": "方法可能返回 null，但声明为 @Nonnull",
            "LongDescription": "{1} 可能返回 null，但声明为 @Nonnull",
            "Details": "该方法可能返回一个 null 值，但该方法（或它重写的超类方法）声明返回 @Nonnull。"
        },
        "NP_CLONE_COULD_RETURN_NULL": {
            "ShortDescription": "克隆方法可能返回 null",
            "LongDescription": "{1} 可能返回 null",
            "Details": "该克隆方法在某些情况下似乎返回 null，但克隆绝不应返回 null 值。如果您确信此路径是不可达的，请改为抛出 AssertionError。"
        },
        "NP_TOSTRING_COULD_RETURN_NULL": {
            "ShortDescription": "toString 方法可能返回 null",
            "LongDescription": "{1} 可能返回 null",
            "Details": "该 toString 方法在某些情况下似乎返回 null。对规范的宽松解读可以被理解为允许这样做，但这可能是个坏主意，并且可能导致其他代码崩溃。返回空字符串或其他适当的字符串而不是 null。"
        },
        "NP_GUARANTEED_DEREF": {
            "ShortDescription": "空值保证被解引用",
            "LongDescription": "{2.givenClass} 可能为 null，并确保在 {1} 中被解引用",
            "Details": "有一个语句或分支，如果执行，保证在此时一个值为 null，并且该值保证被解引用（除非涉及运行时异常的向前路径）。请注意，像 if (x == null) throw new NullPointerException(); 这样的检查被视为解引用。"
        },
        "NP_GUARANTEED_DEREF_ON_EXCEPTION_PATH": {
            "ShortDescription": "值为 null，并保证在异常路径上被解引用",
            "LongDescription": "{2.name} 为 null，保证在 {1} 的异常路径中被解引用",
            "Details": "在异常路径上有一个语句或分支，如果执行，保证此时一个值为 null，并且该值保证被解引用（除非涉及运行时异常的向前路径）。"
        },
        "SI_INSTANCE_BEFORE_FINALS_ASSIGNED": {
            "ShortDescription": "静态初始化器在所有静态最终字段分配之前创建实例",
            "LongDescription": "在 {0} 的静态初始化器在所有静态最终字段分配之前创建实例",
            "Details": "该类的静态初始化器在所有静态最终字段分配之前创建了该类的一个实例。"
        },
        "OS_OPEN_STREAM": {
            "ShortDescription": "方法可能未能关闭流",
            "LongDescription": "{1} 可能未能关闭流",
            "Details": "该方法创建了一个 IO 流对象，但未将其分配给任何字段，未将其传递给可能关闭它的其他方法，\n或返回它，并且在所有方法的返回路径中似乎未关闭流。 这可能导致文件描述符泄漏。 通常，使用块来确保流被关闭是个好主意。"
        },
        "OS_OPEN_STREAM_EXCEPTION_PATH": {
            "ShortDescription": "方法在异常情况下可能未能关闭流",
            "LongDescription": "{1} 在异常情况下可能未能关闭流",
            "Details": "该方法创建了一个 IO 流对象，但未将其分配给任何字段，未将其传递给其他方法或返回，并且在所有可能的异常路径中似乎未关闭它。 这可能导致文件描述符泄漏。 通常，使用块来确保流被关闭是个好主意。"
        },
        "PZLA_PREFER_ZERO_LENGTH_ARRAYS": {
            "ShortDescription": "考虑返回长度为零的数组而不是 null",
            "LongDescription": "是否应返回长度为零的数组而不是 null?",
            "Details": "通常返回长度为零的数组而不是 null 引用以指示没有结果（即，空的结果列表）是更好的设计。 这样，方法的调用者无需显式检查是否为 null。另一方面，使用 null 来指示“没有这个问题的答案”可能是合适的。例如，如果给定一个不包含文件的目录，则返回空列表，\n如果文件不是目录，则返回 null。"
        },
        "UCF_USELESS_CONTROL_FLOW": {
            "ShortDescription": "无用的控制流",
            "LongDescription": "在 {1} 中无用的控制流",
            "Details": "该方法包含一个无用的控制流语句，无论分支是否被执行，控制流都会继续到同一个地方。例如，\n这是由于在 if 语句中有一个空语句块导致的：if (argv.length == 0) { // TODO: 处理此情况\n}\n"
        },
        "UCF_USELESS_CONTROL_FLOW_NEXT_LINE": {
            "ShortDescription": "无用的控制流到下一行",
            "LongDescription": "在 {1} 中无用的控制流到下一行",
            "Details": "该方法包含一个无用的控制流语句，其中控制流无论分支是否被执行，都会跟随到同一行或下一行。\n通常，这是由于不小心将空语句用作 if 语句的主体造成的，例如：if (argv.length == 1); System.out.println(\"Hello, \" + argv[0]);\n"
        },
        "RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE": {
            "ShortDescription": "对先前解引用值的空检查",
            "LongDescription": "在 {1} 中对 {2.givenClass} 于 {4.lineNumber} 处的空检查，该值先前已被解引用",
            "Details": "此处检查一个值是否为 null，但此值不能为 null，因为它之前已被解引用，\n如果它为 null，在先前的解引用时将发生空指针异常。 本质上，此代码与先前的解引用不一致，\n即该值是否允许为 null。检查要么是多余的，要么之前的解引用是错误的。"
        },
        "RCN_REDUNDANT_NULLCHECK_OF_NULL_VALUE": {
            "ShortDescription": "对已知为 null 的值的冗余空检查",
            "LongDescription": "在 {1} 中对已知为 null 的 {2} 的冗余空检查",
            "Details": "该方法包含对一个已知为空的值进行冗余检查，检查是否等于常量 null。"
        },
        "RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE": {
            "ShortDescription": "对已知为非空值的冗余空检查",
            "LongDescription": "在 {1} 中对已知为非空的 {2} 的冗余空检查",
            "Details": "该方法包含对一个已知为非空的值进行冗余检查，检查是否等于常量 null。"
        },
        "RCN_REDUNDANT_COMPARISON_TWO_NULL_VALUES": {
            "ShortDescription": "对两个 null 值的冗余比较",
            "LongDescription": "在 {1} 中对两个 null 值的冗余比较",
            "Details": "该方法包含对已知都为空的两个引用的冗余比较。"
        },
        "RCN_REDUNDANT_COMPARISON_OF_NULL_AND_NONNULL_VALUE": {
            "ShortDescription": "对非空值与 null 的冗余比较",
            "LongDescription": "在 {1} 中对非空值与 null 的冗余比较",
            "Details": "该方法包含一个已知为非空的引用与另一个已知为 null 的引用的比较。"
        },
        "RCN_REDUNDANT_CHECKED_NULL_COMPARISON": {
            "deprecated": "true",
            "ShortDescription": "对先前检查的值的冗余空比较",
            "LongDescription": "在 {1} 中对先前检查的 {2} 进行冗余空比较",
            "Details": "该方法包含对一个引用值进行的冗余空比较。两种类型的冗余比较被报告：\n比较的两个值都是 definitely null，一个值是 definitely null，另一个值是 definitely not null。这条特定的警告通常表示，\n对已知非空的值进行了空检查。虽然该检查不是必要的，但这可能只是防御性编程的一个案例。"
        },
        "UL_UNRELEASED_LOCK": {
            "ShortDescription": "方法没有在所有路径上释放锁",
            "LongDescription": "{1} 没有在所有路径上释放锁",
            "Details": "该方法获取了一个 JSR-166 () 锁，\n但没有在所有方法的返回路径上释放它。一般来说，使用 JSR-166 锁的正确习惯是：\nLock l = ...;\nl.lock();\ntry { // 执行一些操作\n} finally { l.unlock();\n}\n"
        },
        "UL_UNRELEASED_LOCK_EXCEPTION_PATH": {
            "ShortDescription": "方法没有在所有异常路径上释放锁",
            "LongDescription": "{1} 没有在所有异常路径上释放锁",
            "Details": "该方法获取了一个 JSR-166 () 锁，\n但没有在所有异常路径中释放它。一般来说，使用 JSR-166 锁的正确习惯是：\nLock l = ...;\nl.lock();\ntry { // 执行一些操作\n} finally { l.unlock();\n}\n"
        },
        "RC_REF_COMPARISON": {
            "ShortDescription": "可疑的引用比较",
            "LongDescription": "在 {1} 中对 {2} 引用的可疑比较",
            "Details": "该方法使用 == 或 != 操作符比较两个引用值，通常比较此类型的实例的正确方式是使用 equals() 方法。\n可能会创建不同的实例，这些实例是相等但不通过 == 比较，因为它们是不同的对象。\n通常不应通过引用比较的类示例包括 java.lang.Integer、java.lang.Float 等。 RC_REF_COMPARISON 仅涵盖原始类型的包装类型。 可疑类型列表可以通过添加带有逗号分隔类的 frc.suspicious 系统属性来扩展：<systemPropertyVariables> <frc.suspicious>java.time.LocalDate,java.util.List</frc.suspicious> </systemPropertyVariables>"
        },
        "RC_REF_COMPARISON_BAD_PRACTICE": {
            "ShortDescription": "可疑的引用比较与常量",
            "LongDescription": "在 {1} 中与常量 {2} 引用的可疑比较",
            "Details": "该方法使用 == 或 != 操作符将引用值与常量进行比较，通常比较此类型的实例的正确方式是使用 equals() 方法。\n可能会创建不同的实例，这些实例是相等但不通过 == 比较，因为它们是不同的对象。\n通常不应通过引用比较的类示例包括 java.lang.Integer、java.lang.Float 等。"
        },
        "RC_REF_COMPARISON_BAD_PRACTICE_BOOLEAN": {
            "ShortDescription": "可疑的布尔值引用比较",
            "LongDescription": "在 {1} 中对布尔值的可疑比较",
            "Details": "该方法使用 == 或 != 操作符比较两个布尔值。通常，只有两个布尔值 (Boolean.TRUE 和 Boolean.FALSE)，\n但可以使用 new Boolean(b) 构造函数创建其他布尔对象。最好避免这些对象，但如果它们确实存在，\n那么使用 == 或 != 检查布尔对象的相等性将得到不同于使用 equals() 的结果。"
        },
        "EC_UNRELATED_TYPES_USING_POINTER_EQUALITY": {
            "ShortDescription": "使用指针相等比较不同类型",
            "LongDescription": "在 {1} 中使用指针相等比较 {2.givenClass} 和 {3.givenClass}",
            "Details": "该方法使用指针相等比较两个似乎是不同类型的引用。此比较的结果在运行时将始终为 false。"
        },
        "EC_UNRELATED_TYPES": {
            "ShortDescription": "调用 equals() 比较不同类型",
            "LongDescription": "在 {1} 中调用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "该方法在两个不同类类型的引用上调用 equals(Object)，分析表明，它们在运行时将是不同类对象。此外，检查将被调用的 equals 方法表明，\n此调用总是返回 false，或者 equals 方法不是对称的（这是 Object 类中 equals 的合同所要求的属性）。"
        },
        "EC_UNRELATED_INTERFACES": {
            "ShortDescription": "调用 equals() 比较不同接口类型",
            "LongDescription": "在 {1} 中调用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "该方法在两个不相关的接口类型的引用上调用 equals(Object)，其中两者都不是彼此的子类型，且没有已知的非抽象类实现这两个接口。\n因此，被比较的对象在运行时不太可能属于同一类（除非有些应用程序类未被分析，或者可以在运行时动态加载类）。\n根据 equals() 的合同，不同类的对象应始终比较为不相等；因此，根据 java.lang.Object.equals(Object) 定义的合同，\n此比较的结果在运行时将始终为 false。"
        },
        "EC_UNRELATED_CLASS_AND_INTERFACE": {
            "ShortDescription": "调用 equals() 比较不相关的类和接口",
            "LongDescription": "在 {1} 中调用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "\n该方法在两个引用上调用 equals(Object)，其中一个是类，另一个是接口，且类及其所有非抽象子类都未实现该接口。\n因此，被比较的对象在运行时不太可能属于同一类（除非有些应用程序类未被分析，或者可以在运行时动态加载类）。\n根据 equals() 的合同，不同类的对象应始终比较为不相等；因此，根据 java.lang.Object.equals(Object) 定义的合同，\n此比较的结果在运行时将始终为 false。"
        },
        "EC_NULL_ARG": {
            "ShortDescription": "调用 equals(null)",
            "LongDescription": "在 {1} 中调用 equals(null)",
            "Details": "该方法调用 equals(Object)，将 null 值作为参数传递。根据 equals() 方法的合同，此调用应始终返回false。"
        },
        "MWN_MISMATCHED_WAIT": {
            "ShortDescription": "不匹配的 wait()",
            "LongDescription": "在 {1} 中不匹配的 wait()",
            "Details": "该方法调用 Object.wait()，但显然没有持有对象上的锁。调用 wait() 而没有持有锁将导致线程抛出 IllegalMonitorStateException。"
        },
        "MWN_MISMATCHED_NOTIFY": {
            "ShortDescription": "不匹配的 notify()",
            "LongDescription": "在 {1} 中不匹配的 notify()",
            "Details": "该方法调用 Object.notify() 或 Object.notifyAll()，但显然没有持有对象上的锁。调用 notify() 或 notifyAll() 而没有持有锁将导致线程抛出 IllegalMonitorStateException。"
        },
        "SA_LOCAL_SELF_ASSIGNMENT_INSTEAD_OF_FIELD": {
            "ShortDescription": "局部变量自赋值而不是赋值给字段",
            "LongDescription": "在 {1} 中局部变量 {2} 自赋值而不是赋值给字段",
            "Details": "该方法包含局部变量的自赋值，并且有一个相同名称的字段，例如：int foo; public void setFoo(int foo) { foo = foo; }\n该赋值是无用的。您是想将值赋给字段吗？"
        },
        "SA_LOCAL_SELF_ASSIGNMENT": {
            "ShortDescription": "局部变量自赋值",
            "LongDescription": "在 {1} 中局部变量 {2} 自赋值",
            "Details": "该方法包含局部变量的自赋值；例如 public void foo() { int x = 3; x = x; }\n\n这样的赋值是无用的，可能表示逻辑错误或拼写错误。"
        },
        "SA_FIELD_SELF_ASSIGNMENT": {
            "ShortDescription": "字段自赋值",
            "LongDescription": "在 {1} 中字段 {2.givenClass} 自赋值",
            "Details": "该方法包含字段的自赋值；例如 int x;\npublic void foo() { x = x; }\n这样的赋值是无用的，可能表示逻辑错误或拼写错误。"
        },
        "SA_FIELD_DOUBLE_ASSIGNMENT": {
            "ShortDescription": "字段的双重赋值",
            "LongDescription": "在 {1} 中字段 {2.givenClass} 的双重赋值",
            "Details": "该方法包含字段的双重赋值；例如 int x, y;\npublic void foo() { x = x = 17; }\n对一个字段进行两次赋值是无用的，可能表示逻辑错误或拼写错误。"
        },
        "SA_LOCAL_DOUBLE_ASSIGNMENT": {
            "ShortDescription": "局部变量的双重赋值",
            "LongDescription": "在 {1} 中局部变量 {2} 的双重赋值",
            "Details": "该方法包含局部变量的双重赋值；例如 public void foo() { int x, y; x = x = 17; }\n对一个变量赋值两次是无用的，可能表示逻辑错误或拼写错误。"
        },
        "SA_FIELD_SELF_COMPUTATION": {
            "ShortDescription": "涉及字段的无意义自计算（例如，x & x）",
            "LongDescription": "在 {1} 中对 {2.givenClass} 进行无意义的自计算",
            "Details": "该方法对一个字段与另一个相同字段的引用进行无意义的计算（例如，x & x 或 x - x）。由于计算的性质，\n该操作似乎没有意义，可能表示拼写错误或逻辑错误。请再次检查计算。"
        },
        "SA_LOCAL_SELF_COMPUTATION": {
            "ShortDescription": "涉及变量的无意义自计算（例如，x & x）",
            "LongDescription": "在 {1} 中对 {2} 进行无意义的自计算",
            "Details": "该方法对一个局部变量与另一个相同变量的引用进行无意义的计算（例如，x & x 或 x - x）。由于计算的性质，\n该操作似乎没有意义，可能表示拼写错误或逻辑错误。请再次检查计算。"
        },
        "SA_FIELD_SELF_COMPARISON": {
            "ShortDescription": "字段与自身的自比较",
            "LongDescription": "在 {1} 中，{2.givenClass} 与自身的自比较",
            "Details": "该方法将字段与自身进行比较，这可能表示拼写错误或逻辑错误。确保您比较的是正确的内容。\n"
        },
        "SA_LOCAL_SELF_COMPARISON": {
            "ShortDescription": "值与自身的自比较",
            "LongDescription": "在 {1} 中，{2} 与自身的自比较",
            "Details": "该方法将局部变量与自身进行比较，这可能表示拼写错误或逻辑错误。确保您比较的是正确的内容。\n"
        },
        "DMI_LONG_BITS_TO_DOUBLE_INVOKED_ON_INT": {
            "ShortDescription": "在整型上调用 Double.longBitsToDouble",
            "LongDescription": "在 {1} 中调用了 Double.longBitsToDouble，但传递了一个整型",
            "Details": "调用了 Double.longBitsToDouble 方法，但传递了一个 32 位的整型值作为参数。这几乎肯定不是预期的，与预期结果不符。\n"
        },
        "DMI_ARGUMENTS_WRONG_ORDER": {
            "ShortDescription": "方法参数顺序错误",
            "LongDescription": "在 {1} 中，调用 {2.name} 的参数顺序错误",
            "Details": "该方法调用的参数似乎顺序错误。例如，调用 Preconditions.checkNotNull(\"message\", message) 时\n未按照预期的顺序传递参数：待检查的值是第一个参数。\n"
        },
        "DMI_RANDOM_USED_ONLY_ONCE": {
            "ShortDescription": "随机对象仅创建和使用一次",
            "LongDescription": "在 {1} 中创建和使用了一个随机对象，仅使用一次",
            "Details": "该代码创建了一个 java.util.Random 对象，使用它生成一个随机数，然后丢弃了该随机对象。这将产生质量一般的随机数，并且效率低下。\n如果可能，重写代码，使得随机对象只创建一次并保存，每次需要新的随机数时调用已有的随机对象的方法来获取。\n如果生成的随机数不应易于猜测，请不要为每个随机数创建新的 Random；这些值太容易被猜测。您应考虑使用 java.security.SecureRandom 而不是（并避免为每个随机数分配新的 SecureRandom）。\n"
        },
        "RV_ABSOLUTE_VALUE_OF_RANDOM_INT": {
            "ShortDescription": "计算有符号随机整数绝对值的不当尝试",
            "LongDescription": "在 {1} 中计算有符号随机整数绝对值的不当尝试",
            "Details": "该代码生成一个随机的有符号整数，然后计算该随机整数的绝对值。如果随机数生成器返回的数字是 Integer.MIN_VALUE，那么结果也将是负数（因为 Math.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE）。（对于长整型也会出现同样的问题）。\n"
        },
        "RV_ABSOLUTE_VALUE_OF_HASHCODE": {
            "ShortDescription": "计算有符号32位哈希码绝对值的不当尝试",
            "LongDescription": "在 {1} 中计算有符号32位哈希码绝对值的不当尝试",
            "Details": "该代码生成一个哈希码，然后计算该哈希码的绝对值。如果哈希码是 Integer.MIN_VALUE，那么结果也将是负数（因为 Math.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE）。\n在 2^32 个字符串中，有一个哈希码为 Integer.MIN_VALUE，包括 \"polygenelubricants\"、\"GydZG_\" 和 \"DESIGNING WORKHOUSES\"。\n"
        },
        "RV_REM_OF_RANDOM_INT": {
            "ShortDescription": "32位有符号随机整数的余数",
            "LongDescription": "在 {1} 中计算的32位有符号随机整数的余数",
            "Details": "该代码生成一个随机的有符号整数，然后计算该值除以其他值的余数。由于随机数可能是负数，因此余数操作的结果也可能是负数。请确保这是有意的，并强烈考虑使用 Random.nextInt(int) 方法替代。\n"
        },
        "RV_REM_OF_HASHCODE": {
            "ShortDescription": "哈希码的余数可能为负",
            "LongDescription": "在 {1} 中，哈希码的余数可能为负",
            "Details": "该代码计算一个哈希码，然后计算该值除以其他值的余数。由于哈希码可能为负，因此余数操作的结果也可能为负。如果您希望确保计算结果为非负，您可能需要更改您的代码。\n如果您知道除数是2的幂，\n可以使用按位与运算符替代（即，用位与运算符代替除法）。这可能比计算余数更快。\n如果您不知道除数是2的幂，请取余数操作结果的绝对值。\n"
        },
        "INT_BAD_COMPARISON_WITH_NONNEGATIVE_VALUE": {
            "ShortDescription": "与负常量或零的非负值比较不当",
            "LongDescription": "在 {1} 中与 {2} 的不当比较",
            "Details": "该代码将一个保证非负的值与负的常量或零进行比较。\n"
        },
        "INT_BAD_COMPARISON_WITH_SIGNED_BYTE": {
            "ShortDescription": "与签名字节的比较不当",
            "LongDescription": "在 {1} 中与 {2} 的签名字节比较不当",
            "Details": "签名字节的值只能在 -128 到 127 的范围内。将签名字节与超出该范围的值进行比较是无效的，且可能不正确。\n要将一个签名字节转换为范围0..255的无符号值，使用 0xff &amp; b。"
        },
        "INT_BAD_COMPARISON_WITH_INT_VALUE": {
            "ShortDescription": "与长整型常量的整型值比较不当",
            "LongDescription": "在 {1} 中与 {2} 的整型比较不当",
            "Details": "该代码将一个整型值与一个超出整型值表示范围的长整型常量进行比较。\n该比较是无效的，且可能不正确。\n"
        },
        "INT_VACUOUS_BIT_OPERATION": {
            "ShortDescription": "对整型值的无效按位掩码操作",
            "LongDescription": "在 {1} 中进行的无效 {2} 操作",
            "Details": "这是对整型进行的按位操作（与、或、异或），但没有任何有用的工作（例如，v & 0xffffffff）。"
        },
        "INT_VACUOUS_COMPARISON": {
            "ShortDescription": "整型值的无效比较",
            "LongDescription": "整型值 {1} 的无效比较",
            "Details": "有一个整型比较总是返回相同的值（例如，x &lt;= Integer.MAX_VALUE）。\n"
        },
        "INT_BAD_REM_BY_1": {
            "ShortDescription": "整型对1的余数",
            "LongDescription": "在 {1} 中计算的整型对1的余数",
            "Details": "任何表达式 (exp % 1) 保证总是返回零。\n您是否想表示 (exp &amp; 1) 或 (exp % 2)？\n"
        },
        "BIT_IOR_OF_SIGNED_BYTE": {
            "ShortDescription": "签名字节值的按位或",
            "LongDescription": "在 {1} 中计算的签名字节值的按位或",
            "Details": "加载一个字节值（例如，从字节数组中加载的值或返回类型为 byte 的方法返回的值），并与该值进行按位或操作。字节值在进行任何按位操作之前会扩展为32位。\n因此，如果包含该值，并且初始值为 0，则代码 ((x &lt;&lt; 8) | b[0]) 会签名扩展为，为结果提供该值。\n尤其是，用于将字节数组打包为整型的以下代码是错误的：int result = 0;\nfor (int i = 0; i &lt; 4; i++) { result = ((result &lt;&lt; 8) | b[i]);\n}\n以下习惯将正常工作：int result = 0;\nfor (int i = 0; i &lt; 4; i++) { result = ((result &lt;&lt; 8) | (b[i] &amp; 0xff));\n}\n"
        },
        "BIT_ADD_OF_SIGNED_BYTE": {
            "ShortDescription": "签名字节值的按位加",
            "LongDescription": "在 {1} 中计算的签名字节值的按位加",
            "Details": "加上一个字节值和一个已知低8位清除的值。 从字节数组加载的值在进行任何按位操作之前会扩展为32位。\n因此，如果包含该值，并且初始值为 0，则代码 ((x &lt;&lt; 8) + b[0]) 会签名扩展为，为结果提供该值。\n尤其是，用于将字节数组打包为整型的以下代码是错误的：int result = 0;\nfor (int i = 0; i &lt; 4; i++) result = ((result &lt;&lt; 8) + b[i]);\n以下习惯将正常工作：int result = 0;\nfor (int i = 0; i &lt; 4; i++) result = ((result &lt;&lt; 8) + (b[i] &amp; 0xff));\n"
        },
        "BIT_AND": {
            "ShortDescription": "不兼容的位掩码",
            "LongDescription": "在 {1} 中 (e & {2} == {3}) 的不兼容位掩码将产生常量结果",
            "Details": "该方法将形式为 (e &amp; C) 的表达式与 D 进行比较，这将始终比较为不相等，\n由于常量 C 和 D 的特定值。这可能表示逻辑错误或拼写错误。"
        },
        "BIT_SIGNED_CHECK": {
            "ShortDescription": "检查按位操作的符号",
            "LongDescription": "在 {1} 中检查按位操作的符号",
            "Details": "该方法比较一个表达式，例如\n((event.detail &amp; SWT.SELECTED) &gt; 0)。使用位运算后再与大于操作符比较可能会导致意外结果（当然取决于\nSWT.SELECTED 的值）。如果 SWT.SELECTED 是负数，那么这是一个错误的候选。\n即使 SWT.SELECTED 不是负数，使用 '!= 0' 替代 ' > 0 ' 似乎也是个好主意。\n"
        },
        "BIT_SIGNED_CHECK_HIGH_BIT": {
            "ShortDescription": "检查涉及负数的按位操作的符号",
            "LongDescription": "在 {1} 中检查涉及 {2} 的按位操作的符号",
            "Details": "该方法比较一个按位表达式，例如\n((val &amp; CONSTANT) &gt; 0)，其中 CONSTANT 是负数。\n用位运算处理后再与大于操作符比较可能会导致意外结果。这样的比较不太可能按照预期工作，好的做法是用 '!= 0' 替代 ' > 0 '。\n"
        },
        "BIT_AND_ZZ": {
            "ShortDescription": "检查 ((...) & 0) == 0",
            "LongDescription": "在 {1} 中检查 ((...) & 0) == 0",
            "Details": "该方法将形式为 (e &amp; 0) 的表达式与 0 进行比较，\n这将始终比较相等。\n这可能表示逻辑错误或拼写错误。"
        },
        "BIT_IOR": {
            "ShortDescription": "不兼容的位掩码",
            "LongDescription": "在 (e | {2} == {3}) 中的不兼容位掩码将产生常量结果",
            "Details": "该方法将形式为 (e | C) 的表达式与 D 进行比较，\n由于常量 C 和 D 的特定值，这将始终比较为不相等。\n这可能表示逻辑错误或拼写错误。通常，此错误发生是因为代码想要执行\n位集中的成员测试，但使用了按位或运算符（\"|\"）而不是按位与（\"&amp;\"）。此错误也可能出现在（e &amp; A | B） == C\n这样的表达式中，解析为 ((e &amp; A) | B) == C，而应该是 (e &amp; (A | B)) == C。"
        },
        "LI_LAZY_INIT_INSTANCE": {
            "deprecated": "true",
            "ShortDescription": "实例字段的懒初始化不正确",
            "LongDescription": "在 {1} 中的实例字段 {2} 的懒初始化不正确",
            "Details": "该方法包含一个非同步的非易失字段的懒初始化。\n由于编译器或处理器可能重新排序指令，\n线程不能确保看到完全初始化的对象，\n如果该方法可以被多个线程调用。您可以将字段声明为 volatile 来修正该问题。\n有关更多信息，请查看\n<a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/\">Java 内存模型网站</a>。"
        },
        "LI_LAZY_INIT_STATIC": {
            "ShortDescription": "静态字段的懒初始化不正确",
            "LongDescription": "在 {1} 中静态字段 {2} 的懒初始化不正确",
            "Details": "该方法包含一个非同步的非易失静态字段的懒初始化。\n由于编译器或处理器可能重新排序指令，\n线程不能确保看到完全初始化的对象，\n如果该方法可以被多个线程调用。您可以将字段声明为 volatile 来修正该问题。\n有关更多信息，请查看\n<a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/\">Java 内存模型网站</a>。"
        },
        "LI_LAZY_INIT_UPDATE_STATIC": {
            "ShortDescription": "静态字段的懒初始化和更新不正确",
            "LongDescription": "在 {1} 中静态字段 {2} 的懒初始化和更新不正确",
            "Details": "该方法包含一个非同步的静态字段的懒初始化。\n在设置字段后，存储在该位置的对象被进一步更新或访问。\n字段的设置在其被设置后立即对其他线程可见。如果\n方法中的进一步访问设置字段的目的是初始化对象，则\n您有一个非常严重的多线程错误，除非其他某些内容阻止\n任何其他线程在完全初始化之前访问存储的对象。即使您很确信该方法不会被多个\n线程调用，可能最好在设置静态字段之前等待设置的值被完全填充/初始化。"
        },
        "JLM_JSR166_LOCK_MONITORENTER": {
            "ShortDescription": "在 Lock 上执行同步",
            "LongDescription": "在 {1} 中对 {2} 执行同步",
            "Details": "该方法在实现了 java.util.concurrent.locks.Lock 的对象上执行同步。该对象使用\n锁定/解锁，而不是使用 synchronized (...) 结构。"
        },
        "JML_JSR166_CALLING_WAIT_RATHER_THAN_AWAIT": {
            "ShortDescription": "在 util.concurrent 抽象上使用监视器样式的等待方法",
            "LongDescription": "在 {1} 中调用 {2.name} 而不是 {3.name}",
            "Details": "该方法在也提供有方法（如 util.concurrent Condition 对象）的对象上调用 wait() 和 notify()。\n这可能不是您想要的，即使您确实想要这样，也应该考虑更改您的设计，因为其他开发人员会发现这非常混淆。\n"
        },
        "JLM_JSR166_UTILCONCURRENT_MONITORENTER": {
            "ShortDescription": "在 util.concurrent 实例上执行同步",
            "LongDescription": "在 {1} 中对 {2} 执行同步",
            "Details": "该方法在 java.util.concurrent 包（或其子类）的类实例上执行同步。 这些类的实例具有自己的并发控制机制，与 Java 关键字提供的同步是正交的。例如，\n对一个 Object 进行同步不会阻止其他线程修改该对象。\n此代码可能是正确的，但应仔细审核和记录，\n并且可能会混淆将来维护该代码的人。\n"
        },
        "UPM_UNCALLED_PRIVATE_METHOD": {
            "ShortDescription": "私有方法从未被调用",
            "LongDescription": "私有方法 {1} 从未被调用",
            "Details": "该私有方法从未被调用。虽然通过反射调用该方法是可能的，但更可能的是该方法从未使用，应予以删除。\n"
        },
        "UMAC_UNCALLABLE_METHOD_OF_ANONYMOUS_CLASS": {
            "ShortDescription": "匿名类中定义的不可调用方法",
            "LongDescription": "匿名类中定义的不可调用方法 {1}",
            "Details": "该匿名类定义了一个未直接调用的方法，并且没有重写超类中的方法。由于其他类中的方法无法直接调用匿名类中声明的方法，因此似乎该方法是不可调用的。该方法可能只是死代码，但也有可能该方法旨在重写超类中声明的方法，由于拼写错误或其他错误，该方法并未真正重写其意图重写的方法。\n"
        },
        "ODR_OPEN_DATABASE_RESOURCE": {
            "ShortDescription": "方法可能未能关闭数据库资源",
            "LongDescription": "{1} 可能未能关闭 {2.excludingPackage}",
            "Details": "该方法创建了一个数据库资源（如数据库连接或行集），\n未将其分配给任何字段，未传递给其他方法或返回，并且似乎没有在所有方法的返回路径中关闭该对象。未能在所有路径中关闭数据库资源可能导致性能下降，并可能导致应用程序与数据库的通信出现问题。\n"
        },
        "ODR_OPEN_DATABASE_RESOURCE_EXCEPTION_PATH": {
            "ShortDescription": "方法在异常情况下可能未关闭数据库资源",
            "LongDescription": "{1} 在异常情况下可能未关闭数据库资源",
            "Details": "该方法创建了一个数据库资源（如数据库连接或行集），\n未将其分配给任何字段，未传递给其他方法或返回，并且在所有异常路径中似乎未关闭该对象。未能在所有路径中关闭数据库资源可能导致性能下降，并可能导致应用程序与数据库的通信出现问题。"
        },
        "SBSC_USE_STRINGBUFFER_CONCATENATION": {
            "ShortDescription": "方法在循环中使用 + 连接字符串",
            "LongDescription": "{1} 在循环中使用 + 连接字符串",
            "Details": "该方法似乎在循环中使用连接方式构建字符串。\n在每次迭代中，字符串被转换为 StringBuffer/StringBuilder，进行追加，然后转换回字符串。这会导致与迭代次数成二次方的成本，因为在每次迭代中，增长的字符串会被重新复制。通过显式使用 StringBuffer（或 Java 5 中的 StringBuilder）可以获得更好的性能。例如：// 这不好\nString s = \"\";\nfor (int i = 0; i &lt; field.length; ++i) { s = s + field[i];\n}\n\n// 这样更好\nStringBuffer buf = new StringBuffer();\nfor (int i = 0; i &lt; field.length; ++i) { buf.append(field[i]);\n}\nString s = buf.toString();\n"
        },
        "IIL_PREPARE_STATEMENT_IN_LOOP": {
            "ShortDescription": "方法在循环中调用 prepareStatement",
            "LongDescription": "{1} 在循环中以常量参数调用 prepareStatement",
            "Details": "该方法在循环中调用 Connection.prepareStatement，传递常量参数。\n如果 PreparedStatement 应该多次执行，就没有必要在每次循环迭代时重新创建它。\n将此调用移到循环外部。"
        },
        "IIL_ELEMENTS_GET_LENGTH_IN_LOOP": {
            "ShortDescription": "在循环中调用 NodeList.getLength()",
            "LongDescription": "{1} 在循环中调用 NodeList.getLength()，用于 getElementsByTagName 的返回值",
            "Details": "该方法在循环中调用 NodeList.getLength()，而 NodeList 是通过 getElementsByTagName 调用生成的。\n这个 NodeList 不存储其长度，而是在每次调用时都会以不太理想的方式计算。\n考虑在循环之前将长度存储到变量中。\n"
        },
        "IIL_PATTERN_COMPILE_IN_LOOP": {
            "ShortDescription": "方法在循环中调用 Pattern.compile",
            "LongDescription": "{1} 在循环中用常量参数调用 Pattern.compile",
            "Details": "该方法在循环中调用 Pattern.compile，传递常量参数。\n如果该模式要使用多次，就没有必要在每次循环迭代时编译它。\n将此调用移到循环外部，甚至移动到静态最终字段。"
        },
        "IIL_PATTERN_COMPILE_IN_LOOP_INDIRECT": {
            "ShortDescription": "方法在循环中编译正则表达式",
            "LongDescription": "{1} 在循环中编译正则表达式",
            "Details": "该方法在循环中创建相同的正则表达式，因此每次迭代都将编译。\n将首先使用 Pattern.compile 在循环外编译该正则表达式，将更具优化。"
        },
        "IIO_INEFFICIENT_INDEX_OF": {
            "ShortDescription": "低效使用 String.indexOf(String)",
            "LongDescription": "{1} 使用 String.indexOf(String) 而不是 String.indexOf(int)",
            "Details": "该代码将常量字符串（长度为 1）传递给 String.indexOf()。\n使用 String.indexOf() 的整数实现更为高效。\n例如，调用而不是"
        },
        "IIO_INEFFICIENT_LAST_INDEX_OF": {
            "ShortDescription": "低效使用 String.lastIndexOf(String)",
            "LongDescription": "{1} 使用 String.lastIndexOf(String) 而不是 String.lastIndexOf(int)",
            "Details": "该代码将常量字符串（长度为 1）传递给 String.lastIndexOf()。\n使用 String.lastIndexOf() 的整数实现更为高效。\n例如，调用而不是"
        },
        "ITA_INEFFICIENT_TO_ARRAY": {
            "ShortDescription": "方法使用了带有零长度数组参数的 toArray()",
            "LongDescription": "{1} 使用了带有零长度数组参数的 Collection.toArray()",
            "Details": "该方法使用了派生类的 toArray() 方法，并传入了一个零长度的原型数组参数。更高效的做法是使用\nmyCollection.toArray(new Foo[myCollection.size()])\n如果传入的数组足够大以存储集合中的所有元素，那么它将被填充并直接返回。这避免了通过反射创建第二个数组作为结果。"
        },
        "IJU_ASSERT_METHOD_INVOKED_FROM_RUN_METHOD": {
            "ShortDescription": "在运行方法中进行的 JUnit 断言将不会被 JUnit 发现",
            "LongDescription": "在 {1} 中，JUnit 断言将不会被 JUnit 发现",
            "Details": "在一个运行方法中执行了 JUnit 断言。失败的 JUnit 断言只会导致异常被抛出。\n因此，如果此异常发生在调用测试方法的线程以外的线程中，该异常将终止该线程，但是不会导致测试失败。\n"
        },
        "IJU_SETUP_NO_SUPER": {
            "ShortDescription": "TestCase 定义的 setUp 没有调用 super.setUp()",
            "LongDescription": "TestCase {0} 定义的 setUp 没有调用 super.setUp()",
            "Details": "该类是 JUnit TestCase，并实现了 setUp 方法。setUp 方法应调用\nsuper.setUp()，但没有调用。"
        },
        "IJU_TEARDOWN_NO_SUPER": {
            "ShortDescription": "TestCase 定义的 tearDown 没有调用 super.tearDown()",
            "LongDescription": "TestCase {0} 定义的 tearDown 没有调用 super.tearDown()",
            "Details": "该类是 JUnit TestCase，并实现了 tearDown 方法。tearDown 方法应调用\nsuper.tearDown()，但没有调用。"
        },
        "IJU_SUITE_NOT_STATIC": {
            "ShortDescription": "TestCase 实现了非静态的 suite 方法",
            "LongDescription": "TestCase {0} 实现了一个非静态的 suite 方法",
            "Details": "该类是 JUnit TestCase，并实现了 suite() 方法。suite 方法应被声明为静态，但没有被声明为静态。"
        },
        "IJU_BAD_SUITE_METHOD": {
            "ShortDescription": "TestCase 声明了一个错误的 suite 方法",
            "LongDescription": "在 {0} 中，suite 方法的声明错误",
            "Details": "该类是 JUnit TestCase，并定义了 suite() 方法。但是，suite 方法需要声明为\npublic static junit.framework.Test suite()\n或 public static junit.framework.TestSuite suite()"
        },
        "IJU_NO_TESTS": {
            "ShortDescription": "TestCase 没有测试",
            "LongDescription": "TestCase {0} 没有测试",
            "Details": "该类是 JUnit TestCase，但没有实现任何测试方法。"
        },
        "BOA_BADLY_OVERRIDDEN_ADAPTER": {
            "ShortDescription": "类错误地重写了超类 Adapter 中实现的方法",
            "LongDescription": "类 {0} 错误地重写了超类 Adapter 中实现的方法 {1}",
            "Details": "该方法重写了父类中的一个方法，而该父类是一个实现了 java.awt.event 或 javax.swing.event 包中定义的监听器的适配器。因此，当事件发生时，此方法将不会被调用。"
        },
        "BRSA_BAD_RESULTSET_ACCESS": {
            "deprecated": "true",
            "ShortDescription": "方法尝试访问索引为 0 的结果集字段",
            "LongDescription": "{1} 尝试访问索引为 0 的结果集字段",
            "Details": "对结果集的 getXXX 或 updateXXX 方法的调用 where 字段索引为 0。由于 ResultSet 字段从索引 1 开始，因此这始终是一个错误。"
        },
        "SQL_BAD_RESULTSET_ACCESS": {
            "ShortDescription": "方法尝试访问索引为 0 的结果集字段",
            "LongDescription": "{1} 尝试访问索引为 0 的结果集字段",
            "Details": "对结果集的 getXXX 或 updateXXX 方法的调用 where 字段索引为 0。由于 ResultSet 字段从索引 1 开始，因此这始终是一个错误。"
        },
        "SQL_BAD_PREPARED_STATEMENT_ACCESS": {
            "ShortDescription": "方法尝试访问索引为 0 的预编译语句参数",
            "LongDescription": "{1} 尝试访问索引为 0 的预编译语句参数",
            "Details": "对预编译语句的 setXXX 方法的调用，其中参数索引为 0。由于参数索引从索引 1 开始，因此这始终是一个错误。"
        },
        "SIO_SUPERFLUOUS_INSTANCEOF": {
            "ShortDescription": "使用 instanceof 运算符进行不必要的类型检查",
            "LongDescription": "{1} 进行不必要的类型检查，使用 instanceof 运算符可以静态确定",
            "Details": "使用 instanceof 运算符执行类型检查，但可以静态确定对象是否属于请求的类型。"
        },
        "BAC_BAD_APPLET_CONSTRUCTOR": {
            "ShortDescription": "不合适的 Applet 构造函数依赖于未初始化的 AppletStub",
            "LongDescription": "不合适的 Applet 构造函数依赖于未初始化的 AppletStub",
            "Details": "该构造函数调用父类 Applet 中依赖于 AppletStub 的方法。由于 AppletStub 只有在调用此 applet 的 init() 方法后才会被初始化，因此这些方法无法正确执行。\n"
        },
        "EC_ARRAY_AND_NONARRAY": {
            "ShortDescription": "使用 equals() 比较数组和非数组",
            "LongDescription": "在 {1} 中调用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "该方法调用 .equals(Object o) 来比较一个数组和似乎不是数组的引用。如果被比较的对象类型不同，它们保证不相等，比较几乎肯定是个错误。即使它们都是数组，数组上的该方法也仅仅确定两个数组是否是同一对象。\n要比较数组的内容，请使用 java.util.Arrays.equals(Object[], Object[])"
        },
        "EC_BAD_ARRAY_COMPARE": {
            "ShortDescription": "对数组调用 equals()，这相当于 ==",
            "LongDescription": "在 {1} 中使用 .equals 比较两个 {2.simpleClass}（等价于 ==）",
            "Details": "该方法在数组上调用 .equals(Object o) 方法。由于数组没有重写 Object 的 equals 方法，因此在数组上调用 equals 与比较它们的地址是相同的。要比较数组的内容，请使用 java.util.Arrays.equals(Object[], Object[])。\n比较数组的地址，最好显式检查指针相等性。"
        },
        "EC_INCOMPATIBLE_ARRAY_COMPARE": {
            "ShortDescription": "使用 equals(...) 比较不兼容的数组",
            "LongDescription": "在 {1} 中使用 equals 比较 {2.simpleClass} 和 {3.simpleClass}",
            "Details": "该方法调用 .equals(Object o) 比较两个数组，但数组类型不兼容（例如，String[] 和 StringBuffer[]，或 String[] 和 int[]）。它们将永远不相等。此外，当使用 equals(...) 比较数组时，它仅检查它们是否是同一个数组，忽略数组的内容。\n"
        },
        "STI_INTERRUPTED_ON_CURRENTTHREAD": {
            "ShortDescription": "对 currentThread() 的不必要调用以便调用 interrupted()",
            "LongDescription": "{1} 进行了一次不必要的调用 currentThread() 只是为了调用 interrupted()",
            "Details": "该方法调用了 currentThread()，只是为了调用 interrupted() 方法。由于 interrupted() 是静态方法，因此使用更简单明了的方法更好。"
        },
        "STI_INTERRUPTED_ON_UNKNOWNTHREAD": {
            "ShortDescription": "对线程实例调用静态 Thread.interrupted() 方法",
            "LongDescription": "{1} 在线程实例上调用静态 Thread.interrupted() 方法",
            "Details": "该方法在一个看似不是当前线程的 Thread 对象上调用了 Thread.interrupted() 方法。由于 interrupted() 方法是静态的，interrupted 方法将被调用到与作者意图不同的对象上。\n"
        },
        "IP_PARAMETER_IS_DEAD_BUT_OVERWRITTEN": {
            "ShortDescription": "方法进入时参数为死参数但被覆盖",
            "LongDescription": "进入 {1} 的参数 {2} 是死参数但被覆盖",
            "Details": "此参数的初始值被忽略，并在此处被覆盖。这通常表明错误的信念，即\nthe 对参数的写入将被传回给调用者。\n"
        },
        "DLS_DEAD_LOCAL_STORE_SHADOWS_FIELD": {
            "ShortDescription": "对局部变量的死存储遮蔽字段",
            "LongDescription": "在 {1} 中对 {2} 的死存储，而不是同名字段",
            "Details": "此指令将值分配给局部变量，\n但该值在后续指令中未被读取或使用。\n这通常指示错误，因为计算出的值从未被使用。存在一个与局部变量同名的字段。您是想将值赋给那个变量吗？\n"
        },
        "DLS_DEAD_LOCAL_STORE": {
            "ShortDescription": "对局部变量的死存储",
            "LongDescription": "在 {1} 中对 {2} 的死存储",
            "Details": "此指令将值分配给局部变量，\n但该值在后续指令中未被读取或使用。\n这通常指示错误，因为计算出的值从未被使用。\n\n请注意，Sun 的 javac 编译器通常为最终局部变量生成死存储。由于 SpotBugs 是一个基于字节码的工具，\n没有简单的方法来消除此类误报。\n"
        },
        "DLS_DEAD_LOCAL_STORE_IN_RETURN": {
            "ShortDescription": "返回语句中的无用赋值",
            "LongDescription": "来自 {1} 的返回中的无用赋值",
            "Details": "该语句在返回语句中对局部变量进行了赋值。此赋值\n没有效果。请验证该语句是否正确。\n"
        },
        "DLS_DEAD_LOCAL_INCREMENT_IN_RETURN": {
            "ShortDescription": "返回语句中的无用自增",
            "LongDescription": "来自 {1} 的返回中的无用自增",
            "Details": "该语句有一个返回，例如 return x++;/return x--;。\n后缀自增/自减对表达式的值没有影响，\n因此此自增/自减没有效果。\n请验证该语句是否正确。\n"
        },
        "DLS_DEAD_STORE_OF_CLASS_LITERAL": {
            "ShortDescription": "类字面量的死存储",
            "LongDescription": "在 {1} 中的 {3}.class 的死存储",
            "Details": "该指令将类字面量分配给变量，然后从未使用。\n<a href=\"http://www.oracle.com/technetwork/java/javase/compatibility-137462.html#literal\">在 Java 1.4 和 Java 5 中，这种行为有所不同。\n在 Java 1.4 及更早版本中，对引用的使用会强制执行静态初始化程序，如果已经执行过则不会。\n在 Java 5 及更高版本中，则不会。\n有关更多详细信息和示例，请参阅 Oracle <a href=\"http://www.oracle.com/technetwork/java/javase/compatibility-137462.html#literal\">关于 Java SE 兼容性</a>的文章，并获取有关如何在 Java 5 以上强制类初始化的建议。\n"
        },
        "DLS_DEAD_LOCAL_STORE_OF_NULL": {
            "ShortDescription": "将 null 存储到局部变量的死存储",
            "LongDescription": "在 {1} 中对 {2} 的死存储为 null",
            "Details": "代码将 null 存储到局部变量中，存储的值没有被读取。此存储可能是为了辅助垃圾收集器引入的，但\n自从 Java SE 6.0 以来，这不再需要或有用。\n"
        },
        "MF_METHOD_MASKS_FIELD": {
            "ShortDescription": "方法定义一个变量，遮蔽了字段",
            "LongDescription": "{1} 定义了一个变量，遮蔽了字段 {2.givenClass}",
            "Details": "该方法定义了一个局部变量，名称与该类或超类中的字段相同。\n这可能导致该方法从字段中读取未初始化的值，使字段保持未初始化状态，或者两者都有。"
        },
        "MF_CLASS_MASKS_FIELD": {
            "ShortDescription": "类定义了一个字段，遮蔽了超类字段",
            "LongDescription": "字段 {1.givenClass} 遮蔽了超类 {2.class} 中的字段",
            "Details": "该类定义了一个字段，名称与超类中可见的实例字段相同。\n这会造成混淆，并且如果方法在访问一个字段时想要访问另一个字段，则可能会导致错误。"
        },
        "WMI_WRONG_MAP_ITERATOR": {
            "ShortDescription": "低效使用 keySet 迭代器而不是 entrySet 迭代器",
            "LongDescription": "{1} 低效使用了 keySet 迭代器而不是 entrySet 迭代器",
            "Details": "该方法访问 Map 条目的值，使用从 keySet 迭代器检索的键。使用 map 的 entrySet 上的迭代器更高效，以避免 Map.get(key) 查找。"
        },
        "ISC_INSTANTIATE_STATIC_CLASS": {
            "ShortDescription": "不必要的实例化仅提供静态方法的类",
            "LongDescription": "{1} 不必要地实例化一个仅提供静态方法的类",
            "Details": "该类分配了一个基于仅提供静态方法的类的对象。此对象\n没有必要创建，只需使用类名作为限定符直接访问静态方法。"
        },
        "REC_CATCH_EXCEPTION": {
            "ShortDescription": "捕获异常，但并未抛出异常",
            "LongDescription": "在 {1} 中捕获异常，但并未抛出异常",
            "Details": "该方法使用了一个捕获异常对象的 try-catch 块，但在 try 块内未抛出异常，且没有显式捕获 RuntimeException。常见的错误模式是这样写 try { ... } catch (Exception e) { something } 作为捕获多种类型异常的简写，每种 catch 块是相同的，但这种构造也会意外捕获 RuntimeException，从而掩盖潜在的错误。更好的做法是显式捕获抛出的特定异常，或显式捕获 RuntimeException，重新抛出，然后捕获所有非 Runtime 异常，如下所示：try { ...\n} catch (RuntimeException e) { throw e;\n} catch (Exception e) { ... 处理所有非运行时异常 ...\n}\n"
        },
        "DCN_NULLPOINTER_EXCEPTION": {
            "ShortDescription": "捕获了 NullPointerException",
            "LongDescription": "请不要像在 {1} 中那样捕获 NullPointerException",
            "Details": "\n根据 SEI Cert 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR08-J.+Do+not+catch+NullPointerException+or+any+of+its+ancestors\">ERR08-J</a>，NullPointerException 不应被捕获。处理 NullPointerException 被视为一个不如 null 检查的低劣替代方案。\n\n这个不合规代码捕获了一个 NullPointerException 来检查传入的参数是否为 null：\n\nboolean hasSpace(String m) { try { String ms[] = m.split(\" \"); return names.length != 1; } catch (NullPointerException e) { return false; }\n}\n\n合规的解决方案是使用 null 检查，如以下示例所示：\n\nboolean hasSpace(String m) { if (m == null) return false; String ms[] = m.split(\" \"); return names.length != 1;\n}\n"
        },
        "FE_TEST_IF_EQUAL_TO_NOT_A_NUMBER": {
            "ShortDescription": "对 NaN 的绝望等值测试",
            "LongDescription": "在 {1} 中对 NaN 的绝望等值测试",
            "Details": "该代码检查浮点值是否等于特殊的 Not A Number 值（例如，如果 (x == Double.NaN)）。然而，由于的特殊语义，没有值等于，包括。结果是，x == Double.NaN 始终计算为 false。\n要检查值是否为特殊的 Not A Number 值，使用（或如果是浮点精度）。"
        },
        "FE_FLOATING_POINT_EQUALITY": {
            "ShortDescription": "浮点等值测试",
            "LongDescription": "在 {1} 中进行的浮点等值测试",
            "Details": "该操作将两个浮点值进行等值比较。由于浮点计算可能涉及四舍五入，因此计算的 float 和 double 值可能不精确。对于必须精确的值，例如货币值，考虑使用固定精度类型，例如 BigDecimal。对于不需要精确的值，考虑在某个范围内比较等值，例如：if ( Math.abs(x - y) &lt; .0000001 )。请参见 Java 语言规范，第 4.2.4 节。"
        },
        "UM_UNNECESSARY_MATH": {
            "ShortDescription": "方法对常量值调用静态 Math 类方法",
            "LongDescription": "方法对常量值调用静态 Math 类方法",
            "Details": "该方法在常量值上使用 java.lang.Math 的静态方法。在这种情况下，这个方法的结果可以静态确定，并且使用常量的方式更快，且有时更精确。检测到的方法有：\n0.0 或 1.0"
        },
        "CD_CIRCULAR_DEPENDENCY": {
            "ShortDescription": "类之间的循环依赖测试",
            "LongDescription": "类 {0} 与其他类之间存在循环依赖",
            "Details": "该类与其他类之间存在循环依赖。这使得构建这些类变得困难，因为每个类都依赖于另一个类才能正确构建。考虑使用接口来打破这种强依赖。"
        },
        "RI_REDUNDANT_INTERFACES": {
            "ShortDescription": "类实现与超类相同的接口",
            "LongDescription": "类 {0} 实现与超类相同的接口",
            "Details": "该类声明它实现了一个超类也实现的接口。这是冗余的，因为一旦超类实现了一个接口，所有子类默认也实现该接口。这可能表明自该类创建以来，继承层次结构已更改，应考虑接口实现的归属。"
        },
        "MTIA_SUSPECT_STRUTS_INSTANCE_FIELD": {
            "ShortDescription": "类扩展 Struts Action 类并使用实例变量",
            "LongDescription": "类 {0} 扩展 Struts Action 类并使用实例变量",
            "Details": "该类从 Struts Action 类扩展，并使用实例成员变量。由于由 Struts 框架创建的 Struts Action 类仅创建一个实例，并以多线程方式使用，因此这种范式是高度不推荐的，且可能出现问题。仅考虑使用方法局部变量。"
        },
        "MTIA_SUSPECT_SERVLET_INSTANCE_FIELD": {
            "ShortDescription": "类扩展 Servlet 类并使用实例变量",
            "LongDescription": "类 {0} 扩展 Servlet 类并使用实例变量",
            "Details": "该类从 Servlet 类扩展，并使用实例成员变量。由于由 J2EE 框架创建的 Servlet 类仅创建一个实例，并以多线程方式使用，因此这种范式是高度不推荐的，且可能出现问题。仅考虑使用方法局部变量。"
        },
        "PS_PUBLIC_SEMAPHORES": {
            "ShortDescription": "类在其公共接口中暴露同步和信号量",
            "LongDescription": "类 {0} 在其公共接口中暴露同步和信号量",
            "Details": "该类在自身（this 引用）上使用同步及 wait()、notify() 或 notifyAll()。使用该类的客户端类可能还会将该类的实例用作同步对象。由于两个类使用相同对象进行同步，多线程的正确性可疑。您不应在公共引用上进行同步或调用信号量方法。考虑使用内部私有成员变量来控制同步。"
        },
        "ICAST_INTEGER_MULTIPLY_CAST_TO_LONG": {
            "ShortDescription": "将整型乘法结果强制转换为长整型",
            "LongDescription": "在 {1} 中将整型乘法结果强制转换为长整型",
            "Details": "该代码执行整型乘法，然后将结果转换为长整型，例如：long convertDaysToMilliseconds(int days) { return 1000*3600*24*days; }\n\n如果使用长整型数学运算进行乘法，可以避免结果溢出的可能性。例如，您可以修复上述代码为：long convertDaysToMilliseconds(int days) { return 1000L*3600*24*days; }\nstatic final long MILLISECONDS_PER_DAY = 24L*3600*1000;\nlong convertDaysToMilliseconds(int days) { return days * MILLISECONDS_PER_DAY; }\n"
        },
        "ICAST_INT_2_LONG_AS_INSTANT": {
            "ShortDescription": "int 值转换为 long 并作为绝对时间使用",
            "LongDescription": "在 {1} 中，int 转换为 long 并作为绝对时间传递给 {2}",
            "Details": "\n该代码将一个 32 位的 int 值转换为 64 位的 long 值，然后将该值作为需要绝对时间值的方法参数传递。\n绝对时间值是自标准基础时间 \"纪元\"（即 1970 年 1 月 1 日，00:00:00 GMT）以来的毫秒数。\n例如，以下方法意图将纪元以来的秒数转换为日期，但实现存在严重问题：Date getDate(int seconds) { return new Date(seconds * 1000); }\n乘法使用 32 位算术进行运算，然后转换为 64 位值。\n当 32 位值被转换为 64 位并用于表示绝对时间值时，只能表示 1969 年 12 月和 1970 年 1 月的日期。\n上述方法的正确实现是：// 在 2037 年之后将失败\nDate getDate(int seconds) { return new Date(seconds * 1000L); }\n\n// 更好，适用于所有日期\nDate getDate(long seconds) { return new Date(seconds * 1000); }\n"
        },
        "ICAST_INT_CAST_TO_FLOAT_PASSED_TO_ROUND": {
            "ShortDescription": "int 值转换为 float 后传递给 Math.round",
            "LongDescription": "int 值转换为 float 后在 {1} 中传递给 Math.round",
            "Details": "\n该代码将一个 int 值转换为浮点精度的浮点数，然后将结果传递给 Math.round() 函数，该函数返回最接近的 int/long 值。\n此操作应始终无效，因为将整数转换为浮点数应该产生无小数部分的数字。\n生成要传递给 Math.round 的值的操作可能是希望使用浮点算术进行。\n"
        },
        "ICAST_INT_CAST_TO_DOUBLE_PASSED_TO_CEIL": {
            "ShortDescription": "整型值转换为 double 后传递给 Math.ceil",
            "LongDescription": "整型值在 {1} 中转换为 double 后传递给 Math.ceil",
            "Details": "\n该代码将整型值（例如，int 或 long）转换为双精度浮点数，并将结果传递给 Math.ceil() 函数，该函数将双精度浮点数四舍五入到下一个更高的整数值。\n此操作应始终无效，因为将整数转换为双精度浮点数应该产生无小数部分的数字。\n生成要传递给 Math.ceil 的值的操作可能是希望使用双精度浮点算术进行。\n"
        },
        "ICAST_IDIV_CAST_TO_DOUBLE": {
            "ShortDescription": "整型除法结果转换为 double 或 float",
            "LongDescription": "在 {1} 中整型除法结果转换为 double 或 float",
            "Details": "\n该代码将整型除法（例如，int 或 long 除法）操作的结果强制转换为 double 或 float。\n对整数进行除法会将结果截断为最接近零的整数值。结果被强制转换为 double 表明应该保留这一精度。\n可能想到的是将一个或两个操作数强制转换为 double 以执行除法。以下是一个示例：\nint x = 2;\nint y = 5;\n// 错误：产生结果 0.0\ndouble value1 = x / y;\n\n// 正确：产生结果 0.4\ndouble value2 = x / (double) y;\n"
        },
        "J2EE_STORE_OF_NON_SERIALIZABLE_OBJECT_INTO_SESSION": {
            "ShortDescription": "将不可序列化对象存入 HttpSession",
            "LongDescription": "在 {1} 中将不可序列化的 {2} 存入 HttpSession",
            "Details": "\n该代码似乎正在将不可序列化的对象存储到 HttpSession 中。\n如果该会话被挂起或迁移，将会导致错误。\n"
        },
        "DMI_NONSERIALIZABLE_OBJECT_WRITTEN": {
            "ShortDescription": "不可序列化对象写入 ObjectOutput",
            "LongDescription": "在 {1} 中写入不可序列化的 {2} 到 ObjectOutput",
            "Details": "\n该代码似乎正在传递一个不可序列化的对象给 ObjectOutput.writeObject 方法。\n如果该对象确实不可序列化，将会导致错误。\n"
        },
        "VA_FORMAT_STRING_USES_NEWLINE": {
            "ShortDescription": "格式字符串应使用 %n 而不是 \\n",
            "LongDescription": "在 {1} 中格式字符串应使用 %n 而不是 \\n",
            "Details": "\n该格式字符串包含换行符 (\\n)。在格式字符串中，通常使用 %n 更可取，因为它将生成平台特定的行分隔符。当使用 Java 15 引入的文本块时，使用转义序列：\n\t \nString value = \"\"\" first line%n\\ second line%n\\ \"\"\";"
        },
        "FS_BAD_DATE_FORMAT_FLAG_COMBO": {
            "ShortDescription": "日期格式字符串可能导致意外行为",
            "LongDescription": "在 {1.nameAndSignature} 中，'{3}' 日期格式字符串可能导致意外行为",
            "Details": "该格式字符串包含不良的标志组合，可能导致意外行为。潜在的不良组合包括：将周年（\"Y\"）与年份中的月份（\"M\"）和月份中的天（\"d\"）结合使用，而未指定年份中的周（\"w\"）。此处鼠标标志（\"y\"）可能更合适；使用 AM/PM 小时（\"h\" 或 \"K\"）而未指定 AM/PM 标志（\"a\"）或白昼标志（\"B\"）；使用 24 小时制小时（\"H\" 或 \"k\"）与 AM/PM 标志或白昼标志一起使用；同时使用一天的毫秒（\"A\"）和小时（\"H\"、\"h\"、\"K\"、\"k\"）和/或分钟（\"m\"）和/或秒（\"s\"）；同时使用一天的毫秒（\"A\"）和一天纳秒（\"N\"）；同时使用秒的分数（\"S\"）、纳秒（\"n\"）；同时使用 AM/PM 标志（\"a\"）和白昼标志（\"B\"）；同时使用年份（\"y\"）和年代（\"u\"）等。"
        },
        "VA_PRIMITIVE_ARRAY_PASSED_TO_OBJECT_VARARG": {
            "ShortDescription": "原始数组传递给期望可变数量对象参数的函数",
            "LongDescription": "{2} 传递给 varargs 方法 {3} 在 {1}",
            "Details": "\n该代码将原始数组传递给一个接收可变数量对象参数的函数。\n这创建了一个长度为 1 的数组来容纳原始数组，并将其传递给该函数。\n"
        },
        "BC_EQUALS_METHOD_SHOULD_WORK_FOR_ALL_OBJECTS": {
            "ShortDescription": "equals 方法不应假设其参数的类型",
            "LongDescription": "{0} 的 equals 方法假设参数类型为 {0.givenClass}",
            "Details": "\nequals(Object o) 方法不应对类型做任何假设。\n如果不是同一类型，则应简单地返回 false。"
        },
        "BC_BAD_CAST_TO_ABSTRACT_COLLECTION": {
            "ShortDescription": "对抽象集合的不当转换",
            "LongDescription": "在 {1} 中从 Collection 转换到抽象类 {3} 的不当转换",
            "Details": "\n该代码将 Collection 强制转换为一个抽象集合（例如，Collection、List 或 Set）。\n确保您确保对象是要转换的类型。\n如果您只需要能够遍历集合，则不需要将其转换为 Set 或 List。\n"
        },
        "BC_IMPOSSIBLE_CAST_PRIMITIVE_ARRAY": {
            "ShortDescription": "对原始数组的不可能强制转换",
            "LongDescription": "在 {1} 中涉及原始数组的不可能强制转换",
            "Details": "\n该强制转换将始终抛出 ClassCastException。\n"
        },
        "BC_IMPOSSIBLE_CAST": {
            "ShortDescription": "不可能的强制转换",
            "LongDescription": "在 {1} 中从 {2} 强制转换到 {3} 的不可能强制转换",
            "Details": "\n该强制转换将始终抛出 ClassCastException。\nSpotBugs 根据 instanceof 检查跟踪类型信息，并使用更精确的信息关于方法返回的值和从字段加载的值的类型。\n因此，它可能比仅声明的变量类型具有更准确的信息，并可以利用这一点来确定\n该强制转换将始终在运行时抛出异常。\n"
        },
        "BC_IMPOSSIBLE_DOWNCAST": {
            "ShortDescription": "不可能的降级转换",
            "LongDescription": "在 {1} 中从 {2} 降级到 {3} 的不可能降级转换",
            "Details": "\n该强制转换将始终抛出 ClassCastException。\n分析认为能够精确知道正在强制转换的值的类型，\n尝试下转为子类型将始终因抛出 ClassCastException 而失败。\n"
        },
        "BC_IMPOSSIBLE_DOWNCAST_OF_TOARRAY": {
            "ShortDescription": "toArray() 结果的不可能降级转换",
            "LongDescription": "在 {1} 中对 toArray() 结果的不可能降级转换到 {3}",
            "Details": "\n该代码将对集合的调用结果的返回类型强制转换为一种比 Collection 更具体的类型。\n例如：String[] getAsArray(Collection&lt;String&gt; c) { return (String[]) c.toArray();\n}\n这通常会因抛出 ClassCastException 而失败。\n几乎所有集合的 .toArray() 都返回一个 Object[]。\n它们实际上无法做任何其他事情，\n因为集合对象没有对集合声明的泛型类型的引用。\n从集合获取特定类型的数组的正确方式是使用 c.toArray(new String[0]); 或 c.toArray(new String[c.size()]);（前者在 <a href=\"https://shipilev.net/blog/2016/arrays-wisdom-ancients/#_historical_perspective\">自 Java 6 更新以来效率稍高</a>）。\n有一个常见/已知的例外。\n通过将 List 的 .toArray 方法返回的数组将返回一个协变类型的数组。\n例如，Arrays.asArray(new String[] { \"a\" }).toArray() 将返回一个 String[] 。 \nSpotBugs 尝试检测和抑制这种情况，但可能会漏掉一些。\n"
        },
        "NP_NULL_INSTANCEOF": {
            "ShortDescription": "已知的 null 值检查是否为某类型的实例",
            "LongDescription": "在 {1} 中检查已知的 null 值是否为 {2} 的实例",
            "Details": "\n这个 instanceof 测试将始终返回 false，因为被检查的值已保证为 null。\n尽管这很安全，但请确保这不是误解或其他逻辑错误的迹象。\n"
        },
        "BC_NULL_INSTANCEOF": {
            "deprecated": "true",
            "ShortDescription": "已知的 null 值检查是否为某类型的实例",
            "LongDescription": "在 {1} 中检查已知的 null 值是否为 {2} 的实例",
            "Details": "\n这个 instanceof 测试将始终返回 false，因为被检查的值已保证为 null。\n尽管这很安全，但请确保这不是误解或其他逻辑错误的迹象。\n"
        },
        "BC_IMPOSSIBLE_INSTANCEOF": {
            "ShortDescription": "instanceof 将始终返回 false",
            "LongDescription": "在 {1} 中，instanceof 将始终返回 false，因为 {2} 不能是 {3}",
            "Details": "\n这个 instanceof 测试将始终返回 false。尽管这很安全，但请确保这不是\n误解或其他逻辑错误的迹象。\n"
        },
        "BC_VACUOUS_INSTANCEOF": {
            "ShortDescription": "instanceof 将始终返回 true",
            "LongDescription": "在 {1} 中，instanceof 将始终对所有非空值返回 true，因为所有 {2} 都是 {3} 的实例",
            "Details": "\n这个 instanceof 测试将始终返回 true（除非被测试的值为 null）。\n尽管这很安全，但请确保这不是\n误解或其他逻辑错误的迹象。\n如果您真的想测试值是否为 null，可能直接测试 null 会更清晰。\n"
        },
        "BC_UNCONFIRMED_CAST": {
            "ShortDescription": "未经检查/确认的转换",
            "LongDescription": "在 {1} 中从 {2} 到 {3} 的未经检查/确认的转换",
            "Details": "\n该转换是未经检查的，并且并不是所有来自类型的实例都可以转换为被强制转换的类型。检查您的程序逻辑以确保此\n转换不会失败。\n"
        },
        "BC_UNCONFIRMED_CAST_OF_RETURN_VALUE": {
            "ShortDescription": "对方法返回值的未经检查/确认的转换",
            "LongDescription": "在 {1} 中从 {2} 到 {3} 的未经检查/确认的转换",
            "Details": "\n该代码对方法的返回值执行了未经检查的转换。\n代码可能以某种方式调用该方法，保证该转换是\n安全的，但 SpotBugs 无法验证该转换是否安全。检查您的程序逻辑以确保此\n转换不会失败。\n"
        },
        "BC_BAD_CAST_TO_CONCRETE_COLLECTION": {
            "ShortDescription": "对具体集合的不当转换",
            "LongDescription": "在 {1} 中从 {2} 转换到 {3} 的不当转换",
            "Details": "\n该代码将抽象集合（例如 Collection、List 或 Set）强制转换为特定的具体实现（例如 ArrayList 或 HashSet）。\n这可能不正确，并可能使您的代码脆弱，因为\n这使得将来切换到其他具体实现变得更困难。\n除非您有特别的理由这样做，否则只需使用抽象集合类。\n"
        },
        "RE_POSSIBLE_UNINTENDED_PATTERN": {
            "ShortDescription": "\".\" 或 \"|\" 用于正则表达式",
            "LongDescription": "在 {1} 中使用了\".\" 或 \"|\" 作为正则表达式",
            "Details": "\n一个字符串函数正在调用，而\".\" 或 \"|\" 被传递到一个需要正则表达式的参数中。这是您想要的效果吗？\n例如:\ns.replaceAll(\".\", \"/\") 将返回一个字符串，其中字符被替换为 '/' 字符。\"ab|cd\".replaceAll(\"|\", \"/\") 将返回 \"/a/b/|/c/d/\" \"ab|cd\".split(\"|\") 将返回一个带有六(!)个元素的数组: [, a, b, |, c, d]\n考虑使用 s.replace(\".\", \"/\") 或者 instead.\n"
        },
        "RE_BAD_SYNTAX_FOR_REGULAR_EXPRESSION": {
            "ShortDescription": "正则表达式的语法不正确",
            "LongDescription": "在 {1} 中的正则表达式语法不正确",
            "Details": "\n此代码使用了根据正则表达式语法无效的正则表达式。此语句将在执行时抛出 PatternSyntaxException。\n"
        },
        "RE_CANT_USE_FILE_SEPARATOR_AS_REGULAR_EXPRESSION": {
            "ShortDescription": "File.separator 用于正则表达式",
            "LongDescription": "在 {1} 中的正则表达式中使用 File.separator",
            "Details": "\n该代码使用\n其中需要正则表达式。这将在 Windows 平台上失败，\n因为 \ \ 是反斜杠，在正则表达式中被解释为转义字符。除了其他选择，您可以简单地使用\n File.separatorChar=='\\\\' ? \"\\\\\\\\\" : File.separator\n而不是 \n"
        },
        "DLS_OVERWRITTEN_INCREMENT": {
            "ShortDescription": "被覆盖的自增",
            "LongDescription": "在 {1} 中被覆盖的自增",
            "Details": "\n该代码执行自增/自减操作（如 x++），然后又立即覆盖它。例如：i = i++/i = i--\n会立即用原始值覆盖自增/自减值。\n"
        },
        "ICAST_QUESTIONABLE_UNSIGNED_RIGHT_SHIFT": {
            "ShortDescription": "无符号右移转换为 short/byte",
            "LongDescription": "在 {1} 中无符号右移转换为 short/byte",
            "Details": "\n该代码执行无符号右移，然后将结果强制转换为 short 或 byte，这将丢弃结果的高位。\n由于高位被丢弃，因此有符号和无符号右移之间可能没有区别（取决于移位的大小）。\n"
        },
        "BSHIFT_WRONG_ADD_PRIORITY": {
            "ShortDescription": "可能错误解析的移位操作",
            "LongDescription": "在 {1} 中可能错误解析的移位操作",
            "Details": "\n该代码执行某个操作，例如 (x &lt;&lt; 8 + y)。虽然这可能是正确的，但可能意图是执行 (x &lt;&lt; 8) + y，因为移位操作的优先级较低，因此实际上被解析为 x &lt;&lt; (8 + y)。\n"
        },
        "ICAST_BAD_SHIFT_AMOUNT": {
            "ShortDescription": "32 位 int 移位的位数不在 -31..31 范围内",
            "LongDescription": "在 {1} 中 32 位 int 移位了 {2} 位",
            "Details": "\n该代码对 32 位 int 进行移位，位移量超出了 -31..31 的范围。\n这将使用整数值的低 5 位来决定移位量（例如，移位 40 位与移位 8 位是相同的，而移位 32 位与移位 0 位是相同的）。这可能不是预期的，至少让人困惑。\n"
        },
        "IM_MULTIPLYING_RESULT_OF_IREM": {
            "ShortDescription": "整型乘法的结果为整型余数",
            "LongDescription": "在 {1} 中整型余数的整型乘法结果",
            "Details": "\n该代码将整型余数的结果乘以一个整型常量。确保您没有混淆操作符优先顺序。例如，i % 60 * 1000 是 (i % 60) * 1000，而不是 i % (60 * 1000)。\n"
        },
        "DMI_INVOKING_HASHCODE_ON_ARRAY": {
            "ShortDescription": "对数组调用 hashCode",
            "LongDescription": "在 {1} 中对数组调用 hashCode",
            "Details": "\n该代码在数组上调用 hashCode。对一个数组调用 hashCode 返回的值与 System.identityHashCode 相同，并忽略数组的内容和长度。如果您需要一个依赖于数组内容的 hashCode，请使用 ...\n"
        },
        "DMI_INVOKING_TOSTRING_ON_ARRAY": {
            "ShortDescription": "对数组调用 toString",
            "LongDescription": "在 {1} 中对 {2.givenClass} 调用 toString",
            "Details": "\n该代码在数组上调用 toString，这将产生相当无用的结果，例如 [C@16f0472。考虑使用 Arrays.toString 将数组转换为可读的字符串，显示数组的内容。参见《编程难题》第 3 章，第 12 个难题。\n"
        },
        "DMI_INVOKING_TOSTRING_ON_ANONYMOUS_ARRAY": {
            "ShortDescription": "对未命名数组调用 toString",
            "LongDescription": "在 {1} 中对未命名数组调用 toString",
            "Details": "\n该代码在一个（匿名）数组上调用 toString。调用 toString 在数组上生成一个相当无用的结果，例如 [C@16f0472。考虑使用 Arrays.toString 将数组转换为可读的字符串，显示数组的内容。参见《编程难题》第 3 章，第 12 个难题。\n"
        },
        "IM_AVERAGE_COMPUTATION_COULD_OVERFLOW": {
            "ShortDescription": "计算平均值可能会溢出",
            "LongDescription": "在 {1} 中计算平均值可能会溢出",
            "Details": "该代码使用除法或带符号右移计算两个整数的平均值，然后将结果用作数组的索引。\n如果被平均的值非常大，这可能会溢出（导致计算得出的负平均值）。假设结果应该为非负值，您可以使用\ 无符号右移替代。换句话说，与其使用，\n不如用 (low + high) &gt;&gt;&gt; 1。\n此错误存在于许多早期实现的二分查找和归并排序中。\n马丁·布赫霍尔茨 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6412541\">发现并修复了它\n在 JDK 库中，乔舒亚·布洛赫\n<a href=\"http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html\">广泛宣传了此错误模式。"
        },
        "IM_BAD_CHECK_FOR_ODD": {
            "ShortDescription": "用于负数的奇偶检查将无效",
            "LongDescription": "在 {1} 中用于负数的奇偶检查将无效",
            "Details": "\n该代码使用 x % 2 == 1 来检查值是否为奇数，但这对负数无效（例如，(-5) % 2 == -1）。如果此代码意图检查是否为奇数，考虑使用 (x &amp; 1) == 1 或 x % 2 != 0。\n"
        },
        "DMI_HARDCODED_ABSOLUTE_FILENAME": {
            "ShortDescription": "代码中包含对绝对路径的硬编码引用",
            "LongDescription": "在 {1} 中对绝对路径的硬编码引用",
            "Details": "该代码使用硬编码的绝对路径构建 File 对象（例如：new File(\"/home/dannyc/workspace/j2ee/src/share/com/sun/enterprise/deployment\");"
        },
        "DMI_BAD_MONTH": {
            "ShortDescription": "月份常量值错误",
            "LongDescription": "传递给 {3} 的月份值 {2} 错误，在 {1}",
            "Details": "\n该代码将超出预期范围 0..11 的常量月份值传递给方法。\n"
        },
        "DMI_USELESS_SUBSTRING": {
            "ShortDescription": "调用 substring(0)，返回原始值",
            "LongDescription": "{1} 调用 substring(0)，返回原始值",
            "Details": "\n该代码对字符串调用 substring(0)，返回原始值。\n"
        },
        "DMI_CALLING_NEXT_FROM_HASNEXT": {
            "ShortDescription": "hasNext 方法调用 next",
            "LongDescription": "{1} 调用 {2.givenClass}",
            "Details": "\nhasNext() 方法调用 next() 方法。这几乎肯定是错误的，\n因为 hasNext() 方法不应该改变迭代器的状态，而 next 方法应当改变迭代器的状态。\n"
        },
        "SWL_SLEEP_WITH_LOCK_HELD": {
            "ShortDescription": "方法在持有锁的情况下调用 Thread.sleep()",
            "LongDescription": "{1} 在持有锁的情况下调用 Thread.sleep()",
            "Details": "该方法在持有锁的情况下调用 Thread.sleep()。这可能导致性能和可扩展性非常差，或者死锁，因为其他线程可能在等待获取该锁。最好在锁上调用 wait()，这将释放锁并允许其他线程运行。"
        },
        "DB_DUPLICATE_BRANCHES": {
            "ShortDescription": "方法在两个分支中使用相同的代码",
            "LongDescription": "{1} 在两个分支中使用相同的代码",
            "Details": "该方法在实现条件分支的两个分支时使用了相同的代码。请检查以确保这不是编码错误。"
        },
        "DB_DUPLICATE_SWITCH_CLAUSES": {
            "ShortDescription": "方法在两个 switch 子句中使用相同的代码",
            "LongDescription": "{1} 在两个 switch 子句中使用相同的代码",
            "Details": "该方法在实现 switch 语句的两个子句时使用了相同的代码。这可能是重复代码的情况，但也可能表明存在编码错误。"
        },
        "IMA_INEFFICIENT_MEMBER_ACCESS": {
            "ShortDescription": "方法访问拥有类的私有成员变量",
            "LongDescription": "{1} 访问拥有类的私有成员变量",
            "Details": "该内部类的方法读取或写入拥有类的私有成员变量，或者调用拥有类的私有方法。编译器必须生成特殊的方法来访问此私有成员，从而导致效率下降。放宽成员变量或方法的保护将允许编译器将其视为正常访问。"
        },
        "XFB_XML_FACTORY_BYPASS": {
            "ShortDescription": "方法直接分配 xml 接口的特定实现",
            "LongDescription": "{1} 直接分配 xml 接口的特定实现",
            "Details": "该方法分配 xml 接口的特定实现。最好使用提供的工厂类来创建这些对象，以便在运行时可以更改实现。"
        },
        "USM_USELESS_SUBCLASS_METHOD": {
            "ShortDescription": "方法多余地委托给父类方法",
            "LongDescription": "{1} 多余地委托给父类方法",
            "Details": "该派生方法仅调用相同的超类方法，并传入接收到的确切参数。可以移除此方法，因为它没有提供额外的价值。"
        },
        "USM_USELESS_ABSTRACT_METHOD": {
            "ShortDescription": "抽象方法在实现的接口中已定义",
            "LongDescription": "抽象方法 {1} 在实现的接口中已定义",
            "Details": "该抽象方法在由该抽象类实现的接口中已经定义。可以移除此方法，因为它没有提供额外的价值。"
        },
        "CI_CONFUSED_INHERITANCE": {
            "ShortDescription": "类是最终的但声明了保护字段",
            "LongDescription": "类 {0} 是最终的但声明了保护字段 {1}",
            "Details": "该类被声明为最终类，但声明了保护字段。由于类是最终的，无法从其派生，并且使用保护访问是令人困惑的。应将字段的访问修饰符更改为私有或公共，以表示该字段的真实用途。"
        },
        "QBA_QUESTIONABLE_BOOLEAN_ASSIGNMENT": {
            "ShortDescription": "方法在布尔表达式中分配布尔文字",
            "LongDescription": "{1} 在布尔表达式中分配布尔文字",
            "Details": "该方法在 if 或 while 表达式中将文字布尔值（true 或 false）分配给布尔变量。最有可能这应该是一个布尔比较而不是使用 = 的赋值。"
        },
        "VR_UNRESOLVABLE_REFERENCE": {
            "ShortDescription": "类引用无法解析的类或方法",
            "LongDescription": "无法解析的引用 {1} 由 {0} 提供",
            "Details": "该类引用的类或方法无法通过正在分析的库解析。"
        },
        "GC_UNCHECKED_TYPE_IN_GENERIC_CALL": {
            "ShortDescription": "在泛型调用中未检查的类型",
            "LongDescription": "提供的类型 Object 的未检查参数在 {1} 中，预期为类型 {3.givenClass}",
            "Details": "该对泛型集合方法的调用传递了一个参数，同时编译时类型为 Object，而期望的是来自泛型类型参数的特定类型。因此，标准 Java 类型系统或静态分析无法提供传递的对象是否适合的有用信息。"
        },
        "GC_UNRELATED_TYPES": {
            "ShortDescription": "泛型参数与方法参数之间没有关系",
            "LongDescription": "{2.givenClass} 与 {1} 中预期的参数类型 {3.givenClass} 不兼容",
            "Details": "该对泛型集合方法的调用包含一个与集合参数类型不兼容的参数（即，参数类型既不是对应泛型类型参数的超类也不是子类）。因此，集合中不太可能包含与此处使用的方法参数相等的对象。最有可能的是，传递给方法的值是错误的。通常，两个不相关的类的实例是不相等的。例如，如果这些类之间没有通过子类型关系相关联，那么一个实例不应与另一个实例相等。在其他问题中，这将可能导致 equals 方法不对称。例如，如果你将一个类定义为可以等于另一个实例，那么你的 equals 方法不对称，因为一个实例只能等于那个实例。在少数情况下，人们确实定义了不对称的 equals 方法，并且仍然能够使代码正常工作。尽管没有 API 记录或保证，但通常情况下，如果你检查某个集合是否包含某个对象，传递给等于检查的参数的 equals 方法会使用该检查来执行相等性检查。"
        },
        "DMI_COLLECTIONS_SHOULD_NOT_CONTAIN_THEMSELVES": {
            "ShortDescription": "集合不应包含自身",
            "LongDescription": "在对 {2.givenClass} 的调用中，不应在集合中包含自身",
            "Details": "对泛型集合方法的调用仅在集合包含自身时有意义（例如，如果这是正确的）。这种情况不太可能成立，并且如果成立将会导致问题（例如，计算哈希码导致无限递归）。可能是传递的参数值是错误的。"
        },
        "DMI_VACUOUS_SELF_COLLECTION_CALL": {
            "ShortDescription": "空洞的集合调用",
            "LongDescription": "对于任意集合 c，调用 c.{2.name}(c) 没有意义",
            "Details": "此调用没有意义。对于任意集合，调用应该始终为真，并且应没有效果。"
        },
        "PZ_DONT_REUSE_ENTRY_OBJECTS_IN_ITERATORS": {
            "ShortDescription": "在迭代器中不要重用条目对象",
            "LongDescription": "{0} 是 Iterator 和 Map.Entry 的组合",
            "Details": "entrySet() 方法允许返回一个视图，其中 Iterator 和 Map.Entry。这个巧妙的想法在多个 Map 实现中被使用，但引入了糟糕的编码错误的可能性。如果 map 返回用于 entrySet 的迭代器，那么将会出错。OpenJDK 7 中的所有 Map 实现都已重写以避免这种情况，因此您也应该这样做。"
        },
        "DMI_ENTRY_SETS_MAY_REUSE_ENTRY_OBJECTS": {
            "ShortDescription": "由于重用条目对象，可能导致添加条目集中的元素失败",
            "LongDescription": "由于重用 {2.simpleClass}.Entry 对象，在 {1} 中添加条目集元素可能失败",
            "Details": "entrySet() 方法允许返回一个视图，其中在迭代过程中单个条目对象被重用并返回。自 Java 6 起，IdentityHashMap 和 EnumMap 便是如此。在遍历这样的 Map 时，Entry 值仅在您继续进行到下一次迭代之前有效。例如，如果您尝试将这样一个条目集传递给 addAll 方法，则可能会出现错误。"
        },
        "DMI_USING_REMOVEALL_TO_CLEAR_COLLECTION": {
            "ShortDescription": "不要使用 removeAll 清空集合",
            "LongDescription": "在 {1} 中使用 removeAll 来清空集合",
            "Details": "如果想从集合中移除所有元素，请使用。调用清空集合的更加明确，容易受到拼写错误的错误，不够高效，并且对于某些集合，可能抛出错误。"
        },
        "STCAL_STATIC_CALENDAR_INSTANCE": {
            "ShortDescription": "静态日历字段",
            "LongDescription": "{1} 是类型 java.util.Calendar 的静态字段，不安全多线程使用",
            "Details": "即使 JavaDoc 中不包含提示，日历对于多线程使用本质上是不安全的。在没有适当同步的情况下跨线程共享单个实例将导致应用程序的行为不稳定。在 1.4 中，此类问题的出现频率似乎低于 Java 5 ，在 Java 5 中，您可能会看到 sun.util.calendar.BaseCalendar.getCalendarDateFromFixedDate() 中随机出现的 ArrayIndexOutOfBoundsExceptions 或 IndexOutOfBoundsExceptions。您还可能会遇到序列化问题。建议使用实例字段。有关更多信息，请参见 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\n和 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "STCAL_INVOKE_ON_STATIC_CALENDAR_INSTANCE": {
            "ShortDescription": "对静态日历的调用",
            "LongDescription": "在 {1} 中调用静态 java.util.Calendar 的方法",
            "Details": "即使 JavaDoc 中不包含提示，日历对于多线程使用本质上是不安全的。探测器发现了对通过静态字段获得的 Calendar 实例的调用。这看起来可疑。有关更多信息，请参见 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\n和 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "STCAL_STATIC_SIMPLE_DATE_FORMAT_INSTANCE": {
            "ShortDescription": "静态日期格式",
            "LongDescription": "{1} 是类型 java.text.DateFormat 的静态字段，不安全多线程使用",
            "Details": "根据 JavaDoc，日期格式对于多线程使用本质上是不安全的。在没有适当同步的情况下跨线程共享单个实例将导致应用程序行为的不可预测。您还可能会遇到序列化问题。建议使用实例字段。有关更多信息，请参见 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\n和 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "STCAL_INVOKE_ON_STATIC_DATE_FORMAT_INSTANCE": {
            "ShortDescription": "对静态日期格式的调用",
            "LongDescription": "在 {1} 中调用静态 java.text.DateFormat 的方法",
            "Details": "根据 JavaDoc，日期格式对于多线程使用本质上是不安全的。探测器发现了对通过静态字段获得的 DateFormat 实例的调用。这看起来可疑。有关更多信息，请参见 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\n和 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "TQ_COMPARING_VALUES_WITH_INCOMPATIBLE_TYPE_QUALIFIERS": {
            "ShortDescription": "值与不兼容的类型限定符进行比较",
            "LongDescription": "值被标注为具有类型限定符 {2.simpleName}，与一个永不具有该限定符的值进行相等比较",
            "Details": "将一个指定为携带类型限定符注释的值与一个永远不携带该限定符的值进行比较。更确切地说，带有指定为 when=ALWAYS 的类型限定符的值与带有相同类型限定符指定为 when=NEVER 的值进行比较。例如，假设 @NonNegative 是 when=When.NEVER 的类型限定符注释 @Negative 的昵称。以下代码将生成此警告，因为返回语句需要 @NonNegative 值，但接收的是标记为 @Negative 的值。public boolean example(@Negative Integer value1, @NonNegative Integer value2) { return value1.equals(value2);\n}"
        },
        "TQ_ALWAYS_VALUE_USED_WHERE_NEVER_REQUIRED": {
            "ShortDescription": "标注为携带类型限定符的值在必须不携带该限定符的地方被使用",
            "LongDescription": "标注为携带类型限定符 {2.simpleName} 的值用于必须不携带该限定符的地方",
            "Details": "一个标注为携带类型限定符注释的值在一个或多个位置被消耗，在这些位置要求该值不携带该注释。更确切地说，带有指定为 when=ALWAYS 的类型限定符的值被确保达到一个或多个该类型限定符指定为 when=NEVER 的使用位置。例如，假设 @NonNegative 是 when=When.NEVER 的类型限定符 @Negative 的昵称。以下代码将生成此警告，因为返回语句要求 @NonNegative 值，但接收到的是标记为 @Negative 的值。public @NonNegative Integer example(@Negative Integer value) { return value;\n}"
        },
        "TQ_UNKNOWN_VALUE_USED_WHERE_ALWAYS_STRICTLY_REQUIRED": {
            "ShortDescription": "没有类型限定符的值在严格要求须具有该限定符的地方被使用",
            "LongDescription": "没有类型限定符的值在需要具有 {2.simpleName} 注释的地方被使用",
            "Details": "某个值以要求其带有类型限定符的方式被使用。该类型限定符是严格的，因此工具拒绝任何不具有适当注释的值。要强制某个值具有严格注释，必须定义一个返回值带有严格注释的身份函数。这是将非注释值转换为具有严格类型限定符注释的值的唯一方法。"
        },
        "TQ_NEVER_VALUE_USED_WHERE_ALWAYS_REQUIRED": {
            "ShortDescription": "标注为永不携带类型限定符的值在要求携带该限定符的地方被使用",
            "LongDescription": "标注为永不携带类型限定符 {2.simpleName} 的值在要求携带该限定符的地方被使用",
            "Details": "标注为不携带类型限定符注释的值确保会在一个或多个需要该值携带该注释的地方被消耗。更确切地说，带有指定为 when=NEVER 的类型限定符的值确保达到一个或多个该类型限定符指定为 when=ALWAYS 的使用位置。TODO: 示例"
        },
        "TQ_MAYBE_SOURCE_VALUE_REACHES_ALWAYS_SINK": {
            "ShortDescription": "可能不携带类型限定符的值始终以要求该类型限定符的方式被使用",
            "LongDescription": "可能不携带 {2.simpleName} 注释的值始终被以要求该类型限定符的方式使用",
            "Details": "一个被注释为可能不属于类型限定符所描述的值，并且该值被保证以要求此类型限定符的方式使用。"
        },
        "TQ_MAYBE_SOURCE_VALUE_REACHES_NEVER_SINK": {
            "ShortDescription": "可能携带类型限定符的值始终被以禁止其携带该类型限定符的方式使用",
            "LongDescription": "一个被注释为可能属于类型限定符所描述的值，并且该值被保证以禁止此类型限定符的方式使用",
            "Details": "一个被注释为可能属于类型限定符所描述的值，并且该值被确保以要求此类型限定符的方式使用。"
        },
        "TQ_EXPLICIT_UNKNOWN_SOURCE_VALUE_REACHES_NEVER_SINK": {
            "ShortDescription": "值被要求不具有类型限定符，但标记为未知",
            "LongDescription": "值被要求永远不为 {2.simpleName}，但明确标注为未知，涉及 {2.simpleName}",
            "Details": "一个以要求其永远不为类型限定符所描述的值，但有一个明确的注解表明不确定该值是否被禁止携带类型限定符。使用或注解中可能存在错误。"
        },
        "TQ_EXPLICIT_UNKNOWN_SOURCE_VALUE_REACHES_ALWAYS_SINK": {
            "ShortDescription": "值被要求具有类型限定符，但标记为未知",
            "LongDescription": "值被要求始终为 {2.simpleName}，但明确标注为未知，涉及 {2.simpleName}",
            "Details": "一个以要求值始终为类型限定符所描述的值，但有一个明确的注解表明不确定该值是否要求具有类型限定符。使用或注解中可能存在错误。"
        },
        "IO_APPENDING_TO_OBJECT_OUTPUT_STREAM": {
            "ShortDescription": "试图向对象输出流追加内容的失败尝试",
            "LongDescription": "在 {1} 中试图向对象输出流追加内容的失败尝试",
            "Details": "此代码以追加模式打开文件，然后将结果包装在对象输出流中，如下所示：OutputStream out = new FileOutputStream(anyFile, true); new ObjectOutputStream(out);这不会允许您向存储在文件中的现有对象输出流追加内容。如果您希望能够向对象输出流追加内容，您需要保持该对象输出流打开。唯一可能的情况是，在读取文件时，您计划以随机访问模式打开文件，并寻求追加开始的字节偏移量。"
        },
        "WL_USING_GETCLASS_RATHER_THAN_CLASS_LITERAL": {
            "ShortDescription": "在 getClass 上同步而不是类字面量",
            "LongDescription": "在 {1} 中对 getClass 而不是类字面量进行同步",
            "Details": "此实例方法在同步。如果该类被子类化，子类将对子类的类对象进行同步，这不太可能是预期的。例如，考虑以下来自 java.awt.Label 的代码：private static final String base = \"label\";\nprivate static int nameCounter = 0;\n\nString constructComponentName() { synchronized (getClass()) { return base + nameCounter++; }\n}\n子类不会对相同的子类进行同步，从而引起数据竞争。相反，此代码应在以下内容上进行同步：private static final String base = \"label\";\nprivate static int nameCounter = 0;\n\nString constructComponentName() { synchronized (Label.class) { return base + nameCounter++; }\n}\n这个缺陷模式由 Jason Mehrens 贡献。"
        },
        "OBL_UNSATISFIED_OBLIGATION": {
            "ShortDescription": "方法可能未能清理流或资源",
            "LongDescription": "{1} 可能未能清理 {2}",
            "Details": "该方法可能未能清理（关闭、释放）流、数据库对象或其他需要显式清理操作的资源。一般来说，如果方法打开了流或其他资源，则该方法应该使用 try/finally 块来确保流或资源在方法返回之前被清理。此缺陷模式本质上与 OS_OPEN_STREAM 和 ODR_OPEN_DATABASE_RESOURCE 缺陷模式相同，但基于不同（希望更好）的静态分析技术。我们对这个缺陷模式的有用性感兴趣。有关发送反馈的信息，请查看：<a href=\"https://github.com/spotbugs/spotbugs/blob/master/.github/CONTRIBUTING.md\">贡献指南<a href=\"https://github.com/spotbugs/discuss/issues?q=\">邮件列表。\n特别是，此缺陷模式的假阳性抑制启发式尚未经过广泛调整，因此关于假阳性的报告对我们帮助很大。\n参见 Weimer 和 Necula，《寻找和防止运行时错误处理错误》(<a href=\"https://people.eecs.berkeley.edu/~necula/Papers/rte_oopsla04.pdf\">PDF)，以获取分析技术的描述。"
        },
        "OBL_UNSATISFIED_OBLIGATION_EXCEPTION_EDGE": {
            "ShortDescription": "方法可能在检查异常时未能清理流或资源",
            "LongDescription": "{1} 可能在检查异常时未能清理 {2}",
            "Details": "该方法可能未能清理（关闭、释放）流、数据库对象或其他需要显式清理操作的资源。一般来说，如果方法打开了流或其他资源，则该方法应该使用 try/finally 块来确保流或资源在方法返回之前被清理。此缺陷模式本质上与 OS_OPEN_STREAM 和 ODR_OPEN_DATABASE_RESOURCE 缺陷模式相同，但基于不同（希望更好）的静态分析技术。我们对这个缺陷模式的有用性感兴趣。有关发送反馈的信息，请查看：<a href=\"https://github.com/spotbugs/spotbugs/blob/master/.github/CONTRIBUTING.md\">贡献指南<a href=\"https://github.com/spotbugs/discuss/issues?q=\">邮件列表。\n特别是，此缺陷模式的假阳性抑制启发式尚未经过广泛调整，因此关于假阳性的报告对我们帮助很大。\n参见 Weimer 和 Necula，《寻找和防止运行时错误处理错误》(<a href=\"https://people.eecs.berkeley.edu/~necula/Papers/rte_oopsla04.pdf\">PDF)，以获取分析技术的描述。"
        },
        "FB_UNEXPECTED_WARNING": {
            "ShortDescription": "SpotBugs 发出的意外/不希望的警告",
            "LongDescription": "在 {1} 中发现意外/不希望的 {2} SpotBugs 警告",
            "Details": "SpotBugs 生成了一个警告，根据某些注释，这个警告是意外或不希望的。"
        },
        "FB_MISSING_EXPECTED_WARNING": {
            "ShortDescription": "缺少预期或想要的 SpotBugs 警告",
            "LongDescription": "在 {1} 中缺少预期或想要的 {2} SpotBugs 警告",
            "Details": "SpotBugs 没有生成一个警告，而根据某些注释，这是预期或想要的。"
        },
        "RV_RETURN_VALUE_OF_PUTIFABSENT_IGNORED": {
            "ShortDescription": "忽略了 putIfAbsent 的返回值，传递给 putIfAbsent 的值被重用",
            "LongDescription": "putIfAbsent 的返回值被忽略，但在 {1} 中重用了 {4}",
            "Details": "该方法通常用于确保与给定键有关联一个唯一值（第一个 put if absent 成功的值）。如果您忽略返回值并保留传入的值的引用，则有可能保留的值不是关联到映射中键的值。如果您使用的值很重要，并且使用的是未存储在映射中的值，则程序将无法正常工作。"
        },
        "LG_LOST_LOGGER_DUE_TO_WEAK_REFERENCE": {
            "ShortDescription": "由于 OpenJDK 中的弱引用，可能丢失日志记录器的更改",
            "LongDescription": "在 {1} 中可能丢失对日志记录器的更改",
            "Details": "OpenJDK 引入了潜在的不兼容性。特别地，java.util.logging.Logger 的行为已经改变。它不再使用强引用，而是使用弱引用。这是一个合理的变化，但不幸的是，一些代码依靠旧的行为 - 改变日志记录器配置时，它简单地放弃对日志记录器的引用。这意味着垃圾收集器可以自由回收该内存，从而导致日志记录器配置丢失。例如，考虑：public static void initLogging() throws Exception { Logger logger = Logger.getLogger(\"edu.umd.cs\"); logger.addHandler(new FileHandler()); // 调用以更改日志记录器配置 logger.setUseParentHandlers(false); // 另一个调用以更改日志记录器配置\n}\n日志记录器引用在方法结束时丢失（它不会\n逃脱该方法），因此如果在调用 initLogging 之后刚好进行了垃圾收集周期，则日志记录器配置将丢失\n（因为 Logger 只保留弱引用）。public static void main(String[] args) throws Exception { initLogging(); // 向日志记录器添加文件处理程序 System.gc(); // 日志记录配置丢失 Logger.getLogger(\"edu.umd.cs\").info(\"一些消息\"); // 预期不会被记录到文件中\n}\nUlf Ochsenfahrt 和 Eric Fellheimer"
        },
        "AT_OPERATION_SEQUENCE_ON_CONCURRENT_ABSTRACTION": {
            "ShortDescription": "对并发抽象的调用序列可能不是原子的",
            "LongDescription": "对 {2} 的调用序列在 {1} 中可能不是原子的",
            "Details": "此代码包含对并发抽象（例如并发哈希图）的调用序列。这些调用将不会原子地执行。"
        },
        "AT_UNSAFE_RESOURCE_ACCESS_IN_THREAD": {
            "ShortDescription": "在多线程上下文中对资源的操作不安全",
            "LongDescription": "在 {1} 中，对资源 {3} 的操作在多线程上下文中不安全",
            "Details": "此代码中对一个资源的操作在多线程上下文中并不安全。该资源可能会被多个线程并发访问而没有适当的同步。这可能导致数据损坏。请使用同步或其他并发控制机制以确保安全访问该资源。见相关的 SEI CERT 规则，但探测器不局限于链式方法：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/VNA04-J.+Ensure+that+calls+to+chained+methods+are+atomic\"> VNA04-J. 确保对链式方法的调用是原子的。"
        },
        "DM_DEFAULT_ENCODING": {
            "ShortDescription": "依赖默认编码",
            "LongDescription": "在 {1} 中发现依赖默认编码: {2}",
            "Details": "发现调用某个方法，该方法将字节转换为字符串（或字符串转换为字节），并假定默认平台编码是合适的。这将导致应用程序在不同平台上的行为不一致。请使用其他 API，并明确指定字符集名称或字符集对象。"
        },
        "NP_METHOD_PARAMETER_RELAXING_ANNOTATION": {
            "ShortDescription": "方法收紧了参数的 nullness 注释",
            "LongDescription": "方法 {1} 重写了 nullness 注释，放宽了祖先方法对参数的要求。",
            "Details": "一个方法应该始终实现它重写的方法的合同。因此，如果一个方法接受标记为 @Nullable 的参数，则不应在子类中重写该方法，以使该参数为 @Nonnull。这样做违反了该方法应处理空参数的合同。"
        },
        "NP_METHOD_PARAMETER_TIGHTENS_ANNOTATION": {
            "ShortDescription": "方法收紧了参数的 nullness 注释",
            "LongDescription": "方法 {1} 以不兼容的方式重写了参数 {2} 的 nullness 注释",
            "Details": "一个方法应该始终实现它重写的方法的合同。因此，如果一个方法接受标记为 @Nullable 的参数，那么在子类中不应将该方法重写为参数为 @Nonnull 的方法。这样做违反了该方法应处理空参数的合同。"
        },
        "NP_METHOD_RETURN_RELAXING_ANNOTATION": {
            "ShortDescription": "方法放宽了返回值的 nullness 注释",
            "LongDescription": "方法 {1} 以不兼容的方式重写了返回值的 nullness 注释。",
            "Details": "一个方法应该始终实现它重写的方法的合同。因此，如果一个方法标注为返回 @Nonnull 值，则不应在子类中重写该方法为标注返回 @Nullable 或 @CheckForNull 值的方法。这样做违反了该方法不应返回 null 的合同。"
        },
        "EOS_BAD_END_OF_STREAM_CHECK": {
            "ShortDescription": "读取的数据在与 -1 比较之前被转换",
            "LongDescription": "方法 {1} 中 {2} 的返回值在与 {4} 比较之前被转换为 {3}。",
            "Details": "方法 java.io.FileInputStream.read() 返回一个 int。如果该 int 被转换为一个字节，那么 -1 （表示 EOF）和字节 0xFF 变得不可区分，这样在比较（转换后的）结果与 -1 时，如果遇到字符 0xFF，读取（可能在一个循环中）就会提前结束。类似地，方法 java.io.FileReader.read() 也返回一个 int。如果它被转换为一个 char，那么 -1 变成 0xFFFF，即 Character.MAX_VALUE。将结果与 -1 比较是毫无意义的，因为 Java 中的字符是无符号的。如果检查 EOF 是循环的条件，那么这个循环就是无限的。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/FIO08-J.+Distinguish+between+characters+or+bytes+read+from+a+stream+and+-1\">FIO08-J. 区分从流中读取的字符或字节与 -1。"
        },
        "REFLC_REFLECTION_MAY_INCREASE_ACCESSIBILITY_OF_CLASS": {
            "ShortDescription": "公共方法使用反射创建其参数中获取的类，这可能增加任何类的可访问性",
            "LongDescription": "公共方法 {1} 使用反射创建其参数中获取的类，这可能增加任何类的可访问性",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC05-J.+Do+not+use+reflection+to+increase+accessibility+of+classes%2C+methods%2C+or+fields\">SEI CERT SEC05-J 规则禁止使用反射来增加类、方法或字段的可访问性。如果包中的一个类提供了一个公共方法，该方法将一个 java.lang.Class 的实例作为参数，并调用其 newInstance() 方法，则它增加了同一包中没有公共构造函数的类的可访问性。攻击者代码可能调用该方法并传递这样的类以创建其实例。应通过使该方法为非公共或在包上检查包访问权限来避免这种情况。第三种可能性是使用 java.beans.Beans.instantiate() 方法，而不是 java.lang.Class.newInstance() 方法，该方法检查接收到的 Class 对象是否具有任何公共构造函数。"
        },
        "REFLF_REFLECTION_MAY_INCREASE_ACCESSIBILITY_OF_FIELD": {
            "ShortDescription": "公共方法使用反射修改其参数中获取的字段，这可能增加任何类的可访问性",
            "LongDescription": "公共方法 {1} 使用反射修改其参数中获取的字段，这可能增加任何类的可访问性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC05-J.+Do+not+use+reflection+to+increase+accessibility+of+classes%2C+methods%2C+or+fields\">SEI CERT SEC05-J 规则禁止使用反射来增加类、方法或字段的可访问性。如果包中的一个类提供了一个公共方法，该方法将一个 java.lang.reflect.Field 的实例作为参数，并调用 setter 方法（或 setAccessible() 方法），那么它可能会增加同一包中私有的、保护的或包私有字段的可访问性。攻击者代码可能调用该方法并传递这样的字段以改变它。应通过使该方法为非公共或在包上检查包访问权限来避免这种情况。"
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_CONSTRUCTOR": {
            "ShortDescription": "构造函数中调用了可重写的方法",
            "LongDescription": "可重写的方法 {2} 在构造函数 {1} 中被调用。",
            "Details": "在构造函数中调用可重写的方法可能导致使用未初始化的数据。它也可能泄漏部分构造对象的 this 引用。仅应从构造函数中调用静态、最终或私有方法。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET05-J.+Ensure+that+constructors+do+not+call+overridable+methods\">MET05-J. 确保构造函数不调用可重写的方法。"
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_CLONE": {
            "ShortDescription": "在 clone() 方法中调用了可重写的方法。",
            "LongDescription": "可重写的方法 {2} 在类 {0} 的 clone() 方法中被调用。",
            "Details": "从 clone() 方法调用可重写的方法是不安全的，因为子类可以重写该方法，影响 clone() 的行为。它还可以在部分初始化状态下观察或修改克隆对象。仅应从 clone() 方法中调用静态、最终或私有方法。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88487921\">MET06-J. 不要在 clone() 中调用可重写的方法。"
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_READ_OBJECT": {
            "ShortDescription": "在 readObject 方法中调用了可重写的方法。",
            "LongDescription": "可重写的方法 {2} 在 readObject 方法中被调用。",
            "Details": "readObject() 方法不得调用任何可重写的方法。从 readObject() 方法调用可重写的方法可能会使重写方法在对象完全初始化之前访问对象的状态。这种过早的访问是可能的，因为在反序列化中，readObject 扮演对象构造函数的角色，因此在 readObject 退出之前对象初始化并未完成。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SER09-J.+Do+not+invoke+overridable+methods+from+the+readObject%28%29+method\"> SER09-J. 不要从 readObject() 方法中调用可重写的方法。"
        },
        "SING_SINGLETON_IMPLEMENTS_CLONEABLE": {
            "ShortDescription": "使用单例设计模式的类直接实现了 Cloneable 接口。",
            "LongDescription": "使用单例设计模式的类 ({0}) 直接实现了 Cloneable 接口。",
            "Details": "如果使用单例设计模式的类直接实现了 Cloneable 接口，则可能创建该对象的副本，从而违反单例模式。因此，应避免实现 Cloneable 接口。有关更多信息，参见：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_INDIRECTLY_IMPLEMENTS_CLONEABLE": {
            "ShortDescription": "使用单例设计模式的类间接实现了 Cloneable 接口。",
            "LongDescription": "使用单例设计模式的类 ({0}) 间接实现了 Cloneable 接口。",
            "Details": "如果使用单例设计模式的类间接实现了 Cloneable 接口，则可能创建该对象的副本，从而违反单例模式。因此，应避免实现 Cloneable 接口。如果因扩展超类而无法做到这一点，解决方案是重写 clone 方法以无条件抛出 CloneNotSupportedException。有关更多信息，参见：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_IMPLEMENTS_CLONE_METHOD": {
            "ShortDescription": "使用单例设计模式的类实现了 clone() 方法而没有无条件抛出 CloneNotSupportedException。",
            "LongDescription": "使用单例设计模式的类 ({0}) 实现了 clone() 方法而没有无条件抛出 CloneNotSupportedException。",
            "Details": "该类使用单例设计模式，并未实现 Cloneable 接口，但实现了 clone() 方法而没有无条件抛出 CloneNotSupportedException。这样就可能创建该对象的副本，从而违反单例模式。因此，应该避免实现 clone 方法，否则解决方案就是重写 clone 方法以无条件抛出 CloneNotSupportedException。有关更多信息，参见：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_HAS_NONPRIVATE_CONSTRUCTOR": {
            "ShortDescription": "使用单例设计模式的类具有非私有构造函数。",
            "LongDescription": "使用单例设计模式的类 ({0}) 具有非私有构造函数。",
            "Details": "该类使用单例设计模式，并具有非私有构造函数（请注意，可能存在默认构造函数而不是私有的）。因此，可以创建该对象的副本，从而违反单例模式。更简单的解决方案是将构造函数设为私有。<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J 规则"
        },
        "SING_SINGLETON_IMPLEMENTS_SERIALIZABLE": {
            "ShortDescription": "使用单例设计模式的类直接或间接实现了 Serializable 接口。",
            "LongDescription": "使用单例设计模式的类 ({0}) 直接或间接实现了 Serializable 接口。",
            "Details": "该类（使用单例设计模式）直接或间接实现了 Serializable 接口，这允许该类被序列化。反序列化使单例类的多重实例化成为可能，因此应避免这类行为。<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J 规则"
        },
        "SING_SINGLETON_GETTER_NOT_SYNCHRONIZED": {
            "ShortDescription": "使用单例设计模式的类的实例获取方法未同步。",
            "LongDescription": "使用单例设计模式的类的实例获取方法 ({0}) 未同步。",
            "Details": "使用单例设计模式的类的实例获取方法未同步。当此方法被两个或更多线程同时调用时，单例类的多重实例化变得可能。<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J 规则"
        },
        "SSD_DO_NOT_USE_INSTANCE_LOCK_ON_SHARED_STATIC_DATA": {
            "ShortDescription": "在共享静态数据上使用了实例级锁",
            "LongDescription": "静态字段 \"{2}\" 被实例级 {3} 修改。",
            "Details": "如果锁或 synchronized 方法不是静态的，修改静态字段，则可能使共享静态数据在并发访问时未被保护。可能的情况有两种，如果一个同步方法使用非静态锁对象，或者一个 synchronized 方法被声明为非静态。这两种方式都是无效的。最佳解决方案是使用私有的静态最终锁对象来保护共享的静态数据。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK06-J.+Do+not+use+an+instance+lock+to+protect+shared+static+data\"> LCK06-J. 不要使用实例锁来保护共享的静态数据。"
        },
        "FL_FLOATS_AS_LOOP_COUNTERS": {
            "ShortDescription": "不要使用浮点变量作为循环计数器",
            "LongDescription": "使用浮点循环计数器可能导致意外行为。",
            "Details": "应避免将浮点变量用作循环计数器，因为它们不精确，可能导致循环不正确。循环计数器是一个在每次迭代时更改的变量，控制循环何时终止。它在每次迭代时增加或减少固定量。参见规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/NUM09-J.+Do+not+use+floating-point+variables+as+loop+counters\">NUM09-J。"
        },
        "THROWS_METHOD_THROWS_RUNTIMEEXCEPTION": {
            "ShortDescription": "方法故意抛出 RuntimeException。",
            "LongDescription": "方法故意抛出 RuntimeException。",
            "Details": "方法故意抛出 RuntimeException。根据 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J 规则，抛出 RuntimeException 可能导致错误，例如调用者无法检查异常，从而无法正确恢复。同时，抛出 RuntimeException 将强迫调用者捕获 RuntimeException，因此违反了 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR08-J.+Do+not+catch+NullPointerException+or+any+of+its+ancestors\">SEI CERT ERR08-J 规则。请注意，您可以从 Exception 或 RuntimeException 派生，并可以抛出该异常的新实例。"
        },
        "THROWS_METHOD_THROWS_CLAUSE_BASIC_EXCEPTION": {
            "ShortDescription": "方法在其 throws 子句中列出了 Exception。",
            "LongDescription": "方法在其 throws 子句中列出了 Exception。",
            "Details": "方法在其 throws 子句中列出了 Exception。\n\n 在声明方法时，throws 子句中的异常类型应尽可能具体。因此，使用 Exception 作为 throws 子句将迫使调用者在其自己的 throws 子句中使用它，或在 try-catch 块中使用它（当它未必包含任何有关抛出异常的有意义信息时）。有关更多信息，参见 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J 规则。"
        },
        "THROWS_METHOD_THROWS_CLAUSE_THROWABLE": {
            "ShortDescription": "方法在其 throws 子句中列出了 Throwable。",
            "LongDescription": "方法在其 throws 子句中列出了 Throwable。",
            "Details": "方法在其 throws 子句中列出了 Throwable。\n 在声明方法时，throws 子句中的异常类型应尽可能具体。因此，使用 Throwable 作为 throws 子句将迫使调用者在其自己的 throws 子句中使用它，或在 try-catch 块中使用它（当它未必包含任何有关抛出异常的有意义信息时）。此外，以这种方式使用 Throwable 是一种语义上的不良实践，因为 Throwable 包括错误，而根据定义，它们发生在无法恢复的场景中。有关更多信息，参见 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J 规则。"
        },
        "PERM_SUPER_NOT_CALLED_IN_GETPERMISSIONS": {
            "ShortDescription": "自定义类加载器未调用其超类的 getPermissions()",
            "LongDescription": "自定义类加载器 {1} 未调用其超类的 getPermissions()",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC07-J.+Call+the+superclass%27s+getPermissions%28%29+method+when+writing+a+custom+class+loader\">SEI CERT 规则 SEC07-J 要求自定义类加载器必须始终在其自己的 getPermissions() 方法中调用其超类的 getPermissions() 方法，以初始化其返回的对象。省略它意味着使用此自定义类加载器定义的类具有与系统范围的策略文件中指定的权限完全独立的权限。实际上，该类的权限覆盖了它们。"
        },
        "USC_POTENTIAL_SECURITY_CHECK_BASED_ON_UNTRUSTED_SOURCE": {
            "ShortDescription": "基于不信任来源的潜在安全检查。",
            "LongDescription": "在进入 doPrivileged 块之前，非最终方法 {4} 在 {5} 调用，并且在公共方法 {1} 中还在 {6} 调用了该方法，在非最终的类实例 {3} 中。如果此调用是在进入 doPrivileged() 块之前进行的检查，则可能不可靠，因为该方法可能接收到不可信的子类实例，该实例重写了此方法，使其行为与预期不同。",
            "Details": "公共类的公共方法可能从包外调用，这意味着可能会传递不可信的数据。如果在 doPrivileged 之前调用此方法以检查其返回值，然后在类内部调用同一方法，如果该方法或其封闭类不是最终的，则这是危险的。攻击者可能传递一个恶意子类的实例，而不是期望中的实例，该实例以不同的方式重写该方法，使其在不同的调用中返回不同的值。例如，一个返回文件路径的方法可能在进入 doPrivileged 块之前返回一个无害的路径，而在 doPrivileged 块内的调用中返回一个敏感文件。为了避免这种情况，防御性地复制参数中接收到的对象，例如使用作为形式参数类型的类的拷贝构造函数。这确保了方法按预期完全执行。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC02-J.+Do+not+base+security+checks+on+untrusted+sources\">SEC02-J. 不要基于不可信来源执行安全检查。"
        },
        "ASE_ASSERTION_WITH_SIDE_EFFECT": {
            "ShortDescription": "断言中的表达式可能产生副作用",
            "LongDescription": "在 {1} 的断言中使用的表达式可能会产生副作用。如果断言被禁用，则表达式不会执行，方法的结果可能会改变。",
            "Details": "在断言中使用的表达式不得产生副作用。\n参见 SEI CERT 规则 EXP06 以获取更多信息。"
        },
        "ASE_ASSERTION_WITH_SIDE_EFFECT_METHOD": {
            "ShortDescription": "在断言中调用的方法可能产生副作用",
            "LongDescription": "在 {1} 的断言中调用的方法可能会产生副作用。如果断言被禁用，则方法调用不会执行，方法的结果可能会改变。",
            "Details": "在断言中使用的表达式不得产生副作用。\n参见 SEI CERT 规则 EXP06 以获取更多信息。"
        },
        "PA_PUBLIC_PRIMITIVE_ATTRIBUTE": {
            "ShortDescription": "原始字段是公共的",
            "LongDescription": "原始字段 {1} 是公共的，并从类内部设置，这使其暴露过多。考虑将其设为私有，以限制外部可访问性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT 规则 OBJ01-J 要求限制字段的可访问性。否则，字段的值可能会被外部修改，这可能是意外或不希望的行为。一般来说，要求没有字段允许 public 是过于严苛且不切实际的。即使规则提到最终字段可以是公共的。此外，公共字段可能还有其他用途：某些公共字段可以作为“标志”，影响类的行为。这些标志字段预期由当前实例（或在静态字段的情况下由当前类）读取，但由其他人写入。如果字段由当前实例的 method（或当前类，在静态字段的情况下）和外部方法都写入，那么代码是可疑的。考虑将这些字段设为私有，并在必要时提供适当的 setter。请注意，如果构造函数、初始化器和终结器仅在类内部写入字段，则这些是例外，字段不会被视为由类本身写入。"
        },
        "PA_PUBLIC_ARRAY_ATTRIBUTE": {
            "ShortDescription": "数组类型字段是公共的",
            "LongDescription": "数组类型字段 {1} 是公共的，这使其暴露过多。考虑将其设为私有，以限制外部可访问性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT 规则 OBJ01-J 要求限制字段的可访问性。将数组类型字段设为最终并不能防止其他类修改数组的内容。然而，通常限制不允许公共字段是过于严苛且不切实际的。公共字段可能有用途：某些公共字段可能作为影响类行为的“标志”。这些标志字段预期由当前实例（或在静态字段的情况下由当前类）读取，但由其他人写入。如果字段由当前实例的 method（或当前类，在静态字段的情况下）和外部方法都写入，那么代码是可疑的。考虑将这些字段设为私有，并在必要时提供适当的 setter。请注意，如果构造函数、初始化器和终结器仅在类内部写入字段，字段不会被视为由类本身写入。"
        },
        "PA_PUBLIC_MUTABLE_OBJECT_ATTRIBUTE": {
            "ShortDescription": "可变对象类型字段是公共的",
            "LongDescription": "可变对象类型字段 {1} 是公共的，这使其暴露过多。考虑将其设为私有，以限制外部可访问性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT 规则 OBJ01-J 要求限制字段的可访问性。将可变对象类型字段设为最终并不能防止其他类修改对象的内容。然而，通常限制不允许公共字段是过于严苛且不切实际的。公共字段可能有用途：某些公共字段可能作为影响类行为的“标志”。这些标志字段预期由当前实例（或在静态字段的情况下由当前类）读取，但由其他人写入。如果字段由当前实例的 method（或当前类，在静态字段的情况下）和外部方法都写入，那么代码是可疑的。考虑将这些字段设为私有，并在必要时提供适当的 setter。请注意，如果构造函数、初始化器和终结器仅在类内部写入字段，字段不会被视为由类本身写入。在对象类型字段的情况下，“写入”意指调用其名称暗示修改的方法。"
        },
        "VSC_VULNERABLE_SECURITY_CHECK_METHODS": {
            "ShortDescription": "非私有且非最终的安全检查方法易受攻击",
            "LongDescription": "方法 '{1}' 通过使用 Security Manager 类的 '{2}' 方法执行安全检查，但它是可重写的。请将该方法声明为最终或私有，以解决此问题。",
            "Details": "执行安全检查的方法应防止被重写，因此必须声明为私有或最终。否则，这些方法在恶意子类重写并省略检查时可能会被破坏。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET03-J.+Methods+that+perform+a+security+check+must+be+declared+private+or+final\">MET03-J. 执行安全检查的方法必须声明为私有或最终。"
        },
        "AA_ASSERTION_OF_ARGUMENTS": {
            "ShortDescription": "断言用于验证公共方法的参数",
            "LongDescription": "在 {1} 处的断言验证方法参数。如果断言被禁用，则不会有任何参数验证。",
            "Details": "断言不得用于验证公共方法的参数，因为如果断言被禁用，则不会执行验证。\n参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET01-J.+Never+use+assertions+to+validate+method+arguments\">MET01-J. 从不使用断言验证方法参数以获取更多信息。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_CLASS_NAMES": {
            "ShortDescription": "请勿将 JSL 中的公共标识符用作类名",
            "LongDescription": "类 {0} 的名称遮蔽了 Java 标准库中的公共可用标识符。",
            "Details": "避免将 Java 标准库中的公共标识符重用为类名是良好实践。因为 Java 标准库是 Java 平台的一部分，预期将在所有 Java 环境中可用。这样做可能导致命名冲突和混淆，使代码的理解和维护变得更加困难。最佳实践是选择唯一且描述性的类名，准确表示您自己代码的目的和功能。举个例子，假设您想为应用程序处理日期创建一个类。您可以选择一个更具体、唯一的名称，比如 “AppDate” 或 “DisplayDate”，而不是使用像 “Date” 这样的常见名称，这样会与现有的 java.util.Date 类发生冲突。\n 选择标识符名称时请牢记几个关键点：使用有意义的前缀或命名空间：为您的类名加上特定于项目的前缀或命名空间，使其与众不同。例如，如果您的项目名称为 “MyApp”，您可以使用 “MyAppDate” 作为您的类名。使用描述性名称：选择清晰表明其目的和功能的类名。这有助于避免遮蔽现有 Java 标准库标识符。例如，不要使用 “List”，可以考虑使用 “CustomAppList”。遵循命名约定：遵循 Java 的命名约定，例如使用驼峰命名法（例如 MyClass）作为类名。这会促进代码的可读性，并减少冲突的可能性。\n参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 请勿重用 Java 标准库的公共标识符。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_FIELD_NAMES": {
            "ShortDescription": "请勿将 JSL 中的公共标识符用作字段名",
            "LongDescription": "类 {0} 中的字段 {1.name} 遮蔽了 Java 标准库中的公共可用标识符。",
            "Details": "避免在代码中将 Java 标准库中的公共标识符重用为字段名是良好实践。这样做可能导致混淆和潜在冲突，使理解和维护您的代码变得更加困难。因此，建议选择唯一和描述性的字段名称，准确表示它们的目的，并将其与标准库标识符区分开。\n 例如，假设您想为应用程序创建一个处理日期的类。您可以选择一个更具体和唯一的名称，例如 “AppDate” 或 “DisplayDate”，而不是使用像 “Date” 这样的常见名称，这样会与现有的 java.util.Date 类发生冲突。\n 例如，假设您正在为应用程序创建一个表示汽车的类。您应该选择一个更具体和独特的名称，例如 “VehiclePart” 或 “CarComponent”，而不是使用像 “Component” 这样的常见名称，这样会与现有的 java.awt.Component 类发生冲突。\n 选择标识符名称时请牢记几个关键点：使用描述性名称：选择清晰表明其目的和功能的字段名称。这有助于避免遮蔽现有的 Java 标准库标识符。例如，不要使用 \"list\"，可以考虑使用 \"myFancyList\"。遵循命名约定：遵循 Java 的命名约定，例如在字段名称中使用混合大小写。以小写字母开头，内部单词应以大写字母开头（例如，myFieldUsesMixedCase）。这促进了代码的可读性，并减少了冲突的可能性。\n参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 请勿重用 Java 标准库中的公共标识符。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_METHOD_NAMES": {
            "ShortDescription": "请勿将 JSL 中的公共标识符用作方法名",
            "LongDescription": "方法 {1} 的名称遮蔽了 Java 标准库中的公共可用标识符。",
            "Details": "避免将 Java 标准库中的公共标识符重用为方法名是良好实践。这样做可能会导致混淆、潜在冲突和意外行为。为了保持代码的清晰性并确保适当的功能，建议为您的方法选择独特且描述性的名称，准确表示其目的并将其与标准库标识符区分开。\n 例如，假设您想为应用程序创建一个处理创建自定义文件的方法。您可以选择一个更具体和唯一的名称，例如 “generateFile” 或 “createOutPutFile”，而不是使用像 “File” 这样的常见名称，因为这会与现有的 java.io.File 类发生冲突。\n 选择标识符名称时请牢记几个关键点：使用描述性名称：选择清晰表明其目的和功能的方法名称。这有助于避免遮蔽现有的 Java 标准库标识符。例如，不要使用 “abs()”，可以考虑使用 “calculateAbsoluteValue()”。遵循命名约定：遵循 Java 的命名约定，如对于方法名称使用混合大小写。方法名应为动词，第一个字母小写，每个内部单词的第一个字母大写（例如 runFast()）。这促进了代码的可读性，减少了冲突的机会。\n参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 请勿重用 Java 标准库中的公共标识符。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_LOCAL_VARIABLE_NAMES": {
            "ShortDescription": "请勿将 JSL 中的公共标识符用作方法名",
            "LongDescription": "方法 {1} 中的变量名 {2} 遮蔽了 Java 标准库中的公共可用标识符。",
            "Details": "在 Java 中声明局部变量时，建议避免重用 Java 标准库中的公共标识符。将这些标识符作为局部变量名重用可能导致混淆，妨碍代码理解，并可能导致与现有公共可用标识符名称的冲突。为了维护代码的清晰性并避免此类问题，最佳实践是为局部变量选择唯一和描述性的名称。\n 例如，假设您想在变量中存储自定义字体值。您可以选择一个更具体和唯一的名称，例如 “customFont” 或 “loadedFontName”，而不是使用像 “Font” 这样的常见名称，这样会与现有的 java.awt.Font 类发生冲突。\n 选择标识符名称时请牢记几个关键点：使用描述性名称：选择清晰表明其目的和功能的变量名称。这有助于避免遮蔽现有的 Java 标准库标识符。例如，不要使用 \"variable\"，可以考虑使用 \"myVariableName\"。遵循命名约定：遵循 Java 的命名约定，例如对变量名称使用混合大小写。以小写字母开头，内部单词应该以大写字母开头（例如，myVariableName）。这促进了代码的可读性，并减少了冲突的可能性。\n参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 请勿重用 Java 标准库中的公共标识符。"
        },
        "ENV_USE_PROPERTY_INSTEAD_OF_ENV": {
            "ShortDescription": "更可取的是使用可移植的 Java 属性，而不是环境变量。",
            "LongDescription": "在方法 {1} 中，更可取的是使用可移植的 Java 属性 '{3}'，而不是环境变量 '{2}'。",
            "Details": "环境变量并不是可移植的，变量名本身（不仅仅是值）在不同运行操作系统时可能不同。特定环境变量的名称不仅可以不同（例如，Windows 中的 `USERNAME` 和 Unix 系统中的 `USER`），甚至语义也可能不同，例如区分大小写（Windows 不区分大小写而 Unix 区分大小写）。此外，返回的环境变量 Map 和其集合视图可能不遵循和的方法的一般合同。因此，使用环境变量可能会产生意外的副作用。此外，环境变量的可见性与 Java 属性相比限制较少：它们对定义进程的所有后代可见，而不仅仅是直接的 Java 子进程。出于这些原因，即使是 Java API 也建议在可能的情况下使用 Java 属性 （System.getProperty()）而不是环境变量 （System.getenv()）。如果一个值可以通过 System.getProperty() 和 System.getenv() 两者访问，则应使用前者。相应的 Java 系统属性的映射：环境变量。参见 SEI CERT 规则 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables\">ENV02-J. 不要信任环境变量的值。"
        }
    },

    "bugCodes": {
        "FS": {
            "text": "格式字符串问题"
        },
        "SKIPPED": {
            "text": "分析被跳过"
        },
        "IL": {
            "text": "无限循环"
        },
        "VO": {
            "text": "使用 volatile"
        },
        "UI": {
            "text": "不安全的继承"
        },
        "FL": {
            "text": "浮点精度的使用"
        },
        "TEST": {
            "text": "测试原型和不完整的错误模式"
        },
        "IMSE": {
            "text": "有疑问的 IllegalMonitorStateException 捕获"
        },
        "CN": {
            "text": "克隆模式的糟糕实现"
        },
        "CAA": {
            "text": "协变数组赋值"
        },
        "AT": {
            "text": "可能的原子性违反"
        },
        "FI": {
            "text": "不正确的终结器使用"
        },
        "ES": {
            "text": "使用 == 或 != 检查字符串相等性"
        },
        "ML": {
            "text": "在更新字段上进行同步（可变锁）"
        },
        "UG": {
            "text": "未同步的获取方法，已同步的设置方法"
        },
        "IO": {
            "text": "输入/输出问题"
        },
        "IC": {
            "text": "初始化循环性"
        },
        "SI": {
            "text": "可疑的静态初始化器"
        },
        "MSF": {
            "text": "可变的servlet字段"
        },
        "IS": {
            "text": "不一致的同步"
        },
        "Eq": {
            "text": "equals() 实现的问题"
        },
        "Co": {
            "text": "compareTo() 实现的问题"
        },
        "HE": {
            "text": "相等的对象必须具有相等的哈希码"
        },
        "AM": {
            "text": "API 误用"
        },
        "Dm": {
            "text": "使用了可疑的方法"
        },
        "Bx": {
            "text": "原始值的可疑装箱"
        },
        "UR": {
            "text": "构造函数中字段的未初始化读取"
        },
        "RR": {
            "text": "方法忽略 InputStream.read() 的结果"
        },
        "NN": {
            "text": "裸通知"
        },
        "UW": {
            "text": "无条件等待"
        },
        "SP": {
            "text": "方法在字段上自旋"
        },
        "DC": {
            "text": "双重检查模式"
        },
        "Wa": {
            "text": "不在循环中等待"
        },
        "No": {
            "text": "使用 notify() 而不是 notifyAll()"
        },
        "DE": {
            "text": "丢弃或忽略的异常"
        },
        "Ru": {
            "text": "方法调用 run()"
        },
        "It": {
            "text": "Iterator 的不正确定义"
        },
        "SnVI": {
            "text": "没有版本 ID 的可序列化类"
        },
        "Se": {
            "text": "可序列化类的不正确定义"
        },
        "WS": {
            "text": "类的 writeObject() 方法是同步的，但其他方法不是"
        },
        "RS": {
            "text": "类的 readObject() 方法是同步的"
        },
        "SC": {
            "text": "构造函数调用 Thread.start()"
        },
        "MS": {
            "text": "可变的静态字段"
        },
        "ME": {
            "text": "可变的枚举字段"
        },
        "EI": {
            "text": "返回数组的方法可能暴露内部表示"
        },
        "Nm": {
            "text": "混淆的方法名"
        },
        "SS": {
            "text": "未读字段应为静态"
        },
        "UuF": {
            "text": "未使用的字段"
        },
        "UrF": {
            "text": "未读字段"
        },
        "UwF": {
            "text": "未写入字段"
        },
        "SIC": {
            "text": "内部类可以被声明为静态"
        },
        "TLW": {
            "text": "持有两个锁时等待"
        },
        "RANGE": {
            "text": "范围检查"
        },
        "RV": {
            "text": "错误使用方法的返回值"
        },
        "LG": {
            "text": "日志记录器问题"
        },
        "IA": {
            "text": "模糊的调用"
        },
        "HSC": {
            "text": "巨大的字符串常量"
        },
        "HRS": {
            "text": "HTTP 响应拆分漏洞"
        },
        "PT": {
            "text": "路径遍历"
        },
        "XSS": {
            "text": "跨站脚本漏洞"
        },
        "NP": {
            "text": "空指针解引用"
        },
        "NOISE": {
            "text": "虚假随机警告"
        },
        "RpC": {
            "text": "重复的条件测试"
        },
        "OS": {
            "text": "所有路径上未关闭的流"
        },
        "PZLA": {
            "text": "优先使用零长度数组而不是 null 来表示没有结果"
        },
        "UCF": {
            "text": "无用的控制流"
        },
        "RCN": {
            "text": "冗余的 null 比较"
        },
        "UL": {
            "text": "未在所有路径上释放锁"
        },
        "RC": {
            "text": "可疑的引用相等性使用，而不是调用 equals"
        },
        "EC": {
            "text": "比较不兼容的类型以进行相等性检查"
        },
        "MWN": {
            "text": "不匹配的 wait() 或 notify()"
        },
        "SA": {
            "text": "无用的自操作"
        },
        "INT": {
            "text": "可疑的整数表达式"
        },
        "BIT": {
            "text": "可疑的位逻辑表达式"
        },
        "LI": {
            "text": "未同步的延迟初始化"
        },
        "JLM": {
            "text": "在 java.util.concurrent 对象上同步"
        },
        "UPM": {
            "text": "私有方法从未被调用"
        },
        "UMAC": {
            "text": "匿名类的不可调用方法"
        },
        "EI2": {
            "text": "存储对可变对象的引用"
        },
        "NS": {
            "text": "可疑的非短路布尔操作符使用"
        },
        "ODR": {
            "text": "数据库资源在所有路径上未关闭"
        },
        "SBSC": {
            "text": "循环中使用 + 运算符的字符串连接"
        },
        "IIL": {
            "text": "可以移出循环的低效代码"
        },
        "IIO": {
            "text": "对 String.indexOf(String) 或 String.lastIndexOf(String) 的低效使用"
        },
        "ITA": {
            "text": "对 collection.toArray(new Foo[0]) 的低效使用"
        },
        "SW": {
            "text": "Swing 编码规则"
        },
        "IJU": {
            "text": "JUnit TestCase 实现不当"
        },
        "BOA": {
            "text": "错误重写的适配器"
        },
        "SF": {
            "text": "switch case 贯穿"
        },
        "SIO": {
            "text": "多余的 instanceof"
        },
        "BAC": {
            "text": "错误的 Applet 构造函数"
        },
        "UOE": {
            "text": "使用对象的 equals"
        },
        "STI": {
            "text": "可疑的线程中断"
        },
        "DLS": {
            "text": "死局局部存储"
        },
        "IP": {
            "text": "被忽略的参数"
        },
        "MF": {
            "text": "屏蔽字段"
        },
        "WMI": {
            "text": "低效映射迭代器"
        },
        "ISC": {
            "text": "实例化静态类"
        },
        "DCN": {
            "text": "不要捕获 NullPointerException"
        },
        "REC": {
            "text": "RuntimeException 捕获"
        },
        "FE": {
            "text": "测试浮点相等"
        },
        "UM": {
            "text": "对常量的不必要数学运算"
        },
        "UC": {
            "text": "无用的代码"
        },
        "CNT": {
            "text": "已知常量的粗略值"
        },
        "CD": {
            "text": "循环依赖"
        },
        "RI": {
            "text": "冗余接口"
        },
        "MTIA": {
            "text": "多线程实例访问"
        },
        "PS": {
            "text": "公共信号量"
        },
        "BSHIFT": {
            "text": "错误的位移"
        },
        "ICAST": {
            "text": "从整数值转换"
        },
        "RE": {
            "text": "正则表达式"
        },
        "SQL": {
            "text": "潜在的 SQL 问题"
        },
        "WL": {
            "text": "可能在错误对象上锁定"
        },
        "ESync": {
            "text": "空的同步块"
        },
        "QF": {
            "text": "可疑的 for 循环"
        },
        "VA": {
            "text": "可变参数问题"
        },
        "BC": {
            "text": "对象引用的错误转换"
        },
        "IM": {
            "text": "可疑的整数数学"
        },
        "ST": {
            "text": "静态字段的误用"
        },
        "JCIP": {
            "text": "违反 net.jcip 注释"
        },
        "USELESS_STRING": {
            "text": "生成的无用/无信息字符串"
        },
        "DMI": {
            "text": "可疑的方法调用"
        },
        "PZ": {
            "text": "受 Joshua Bloch 和 Neal Gafter 的编程难题启发的警告"
        },
        "SWL": {
            "text": "持锁睡眠"
        },
        "J2EE": {
            "text": "J2EE 错误"
        },
        "DB": {
            "text": "重复分支"
        },
        "IMA": {
            "text": "低效成员访问"
        },
        "XFB": {
            "text": "XML 工厂绕过"
        },
        "USM": {
            "text": "无用的子类方法"
        },
        "CI": {
            "text": "混淆的继承"
        },
        "QBA": {
            "text": "可疑的布尔赋值"
        },
        "VR": {
            "text": "版本兼容性问题"
        },
        "DP": {
            "text": "使用 doPrivileged"
        },
        "GC": {
            "text": "可疑调用泛型集合方法"
        },
        "STCAL": {
            "text": "对类型 Calendar 或 DateFormat 的静态使用"
        },
        "TQ": {
            "text": "类型限定符注释的不一致使用"
        },
        "OBL": {
            "text": "未满足的清理流或资源的义务"
        },
        "FB": {
            "text": "SpotBugs 未在方法上生成预期的警告"
        },
        "DL": {
            "text": "因在共享对象上锁而导致的意外竞争或可能的死锁"
        },
        "JUA": {
            "text": "JUnit 断言中的问题"
        },
        "EOS": {
            "text": "错误的流结束检查"
        },
        "REFLC": {
            "text": "反射增加类的可访问性"
        },
        "REFLF": {
            "text": "反射增加字段的可访问性"
        },
        "MC": {
            "text": "危险的可重写方法调用"
        },
        "CT": {
            "text": "构造函数抛出"
        },
        "SSD": {
            "text": "不要使用实例锁来保护共享静态数据"
        },
        "SING": {
            "text": "单例问题"
        },
        "THROWS": {
            "text": "与异常抛出相关的问题"
        },
        "PERM": {
            "text": "自定义类加载器未调用其超类的 getPermissions()"
        },
        "USC": {
            "text": "基于不可信来源的潜在安全检查"
        },
        "ASE": {
            "text": "具有副作用的断言"
        },
        "PA": {
            "text": "公共属性"
        },
        "VSC": {
            "text": "执行方法的易受攻击的安全检查"
        },
        "AA": {
            "text": "对公共方法的参数使用断言的不当"
        },
        "PI": {
            "text": "请勿重用 Java 标准库中的公共标识符"
        },
        "ENV": {
            "text": "使用环境变量而不是相应的 Java 属性"
        }
    }
};    
