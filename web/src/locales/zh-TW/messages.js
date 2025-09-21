export const sscanMessages = {
    "bugCategories": {
        "CORRECTNESS": {
            "Description": "正確性",
            "Abbreviation": "C",
            "Details": "可能存在的錯誤 - 顯而易見的編碼錯誤導致代碼可能不是開發人員所期望的。我們努力保持低假陽性率。"
        },
        "NOISE": {
            "Description": "無意義的隨機噪聲",
            "Abbreviation": "N",
            "Details": "無意義的隨機噪聲：旨在作為數據挖掘實驗中的對照，而不是用於發現軟體中的實際錯誤。"
        },
        "SECURITY": {
            "Description": "安全性",
            "Abbreviation": "S",
            "Details": "以一種可能導致遠程可利用的安全漏洞的方式使用不受信任的輸入。"
        },
        "BAD_PRACTICE": {
            "Description": "不良實踐",
            "Abbreviation": "B",
            "Details": "違反推薦和基本編碼實踐。範例包括 hashCode 和 equals 問題、可克隆習慣、未處理異常、可序列化問題和誤用 finalize。我們努力使此類分析準確，儘管某些群體可能不關心某些不良實踐。"
        },
        "STYLE": {
            "Description": "可疑程式碼",
            "Abbreviation": "D",
            "Details": "程式碼令人困惑、異常或以容易出錯的方式編寫。範例包括死局部存儲、switch 穿透、未確認的強制轉換和冗餘空檢查。"
        },
        "PERFORMANCE": {
            "Description": "性能",
            "Abbreviation": "P",
            "Details": "程式碼不一定不正確，但可能效率低下。"
        },
        "MALICIOUS_CODE": {
            "Description": "惡意程式碼漏洞",
            "Abbreviation": "V",
            "Details": "程式碼可能受到不受信任程式碼的攻擊。"
        },
        "MT_CORRECTNESS": {
            "Description": "多線程正確性",
            "Abbreviation": "M",
            "Details": "與線程、鎖和 volatile 相關的程式碼缺陷。"
        },
        "I18N": {
            "Description": "國際化",
            "Abbreviation": "I",
            "Details": "與國際化和區域設定相關的程式碼缺陷。"
        },
        "EXPERIMENTAL": {
            "Description": "實驗性",
            "Abbreviation": "X",
            "Details": "實驗性且未完全驗證的錯誤模式。"
        }
    },

    "bugPatterns": {
        "CT_CONSTRUCTOR_THROW": {
            "ShortDescription": "注意構造函數拋出異常的問題。",
            "LongDescription": "類 {0} 在 {1} 中拋出的異常會導致構造函數退出。正在構造的對象保持部分初始化狀態，可能會容易受到終結器攻擊。",
            "Details": "在構造函數中拋出異常的類容易受到終結器攻擊。可以通過將類聲明為 final、使用聲明為 final 的空終結器，或者巧妙地使用私有構造函數來防止終結器攻擊。有關更多信息，請參見 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ11-J.+Be+wary+of+letting+constructors+throw+exceptions\">SEI CERT Rule OBJ-11</a>。"
        },
        "JUA_DONT_ASSERT_INSTANCEOF_IN_TESTS": {
            "ShortDescription": "在測試中斷言 instanceof 的值不推薦。",
            "LongDescription": "在 {2} 的 {3} 中對類型 {0} 的斷言可能隱藏有關為什麼強制轉換可能失敗的有用信息。",
            "Details": "在測試中進行類型檢查的斷言是不推薦的，因為類型轉換異常的消息可能比 instanceof 斷言更好地表明錯誤原因。當調試因錯誤強制轉換而失敗的測試時，觀察 ClassCastException 的輸出可能更有用，它可以提供關於實際遇到的類型的信息。在強制轉換之前斷言類型將導致減少信息的“false is not true”的消息。如果 JUnit 與 hamcrest 一起使用，可以使用 <a href=\"https://junit.org/junit4/javadoc/latest/index.html?org/hamcrest/core/IsInstanceOf.html\">hamcrest 類</a>。"
        },
        "OVERRIDING_METHODS_MUST_INVOKE_SUPER": {
            "ShortDescription": "父方法被註解為 @OverridingMethodsMustInvokeSuper，但重寫方法未調用父方法。",
            "LongDescription": "父方法被註解為 @OverridingMethodsMustInvokeSuper，但 {1} 沒有調用父方法。",
            "Details": "父方法被註解為 @OverridingMethodsMustInvokeSuper，但重寫方法沒有調用父方法。"
        },
        "CNT_ROUGH_CONSTANT_VALUE": {
            "ShortDescription": "發現已知常量的粗略值",
            "LongDescription": "發現粗略值 {3}: {2}",
            "Details": "建議使用預定義的庫常量以提高代碼清晰度和更好的精確度。"
        },
        "SKIPPED_CLASS_TOO_BIG": {
            "ShortDescription": "類太大無法分析",
            "LongDescription": "{0} 太大無法分析",
            "Details": "該類的大小超過了可以有效處理的範圍，未完全分析可能的錯誤。"
        },
        "NOISE_NULL_DEREFERENCE": {
            "ShortDescription": "關於 null 指針解引用的無用警告",
            "LongDescription": "在 {1} 中關於 null 指針解引用的虛假警告",
            "Details": "虛假警告，未能準確表述情況。"
        },
        "NOISE_METHOD_CALL": {
            "ShortDescription": "關於方法調用的虛假警告",
            "LongDescription": "在 {1} 中關於方法調用 {2} 的虛假警告",
            "Details": "虛假警告，未能準確表述情況。"
        },
        "NOISE_FIELD_REFERENCE": {
            "ShortDescription": "關於字段引用的虛假警告",
            "LongDescription": "在 {1} 中關於對 {2} 的引用的虛假警告",
            "Details": "虛假警告，未能準確表述情況。"
        },
        "NOISE_OPERATION": {
            "ShortDescription": "關於操作的虛假警告",
            "LongDescription": "在 {1} 中關於操作的虛假警告",
            "Details": "虛假警告，未能準確表述情況。"
        },
        "DMI_BIGDECIMAL_CONSTRUCTED_FROM_DOUBLE": {
            "ShortDescription": "從雙精度浮點數創建的 BigDecimal 精度不足",
            "LongDescription": "在 {1} 中從 {4} 創建的 BigDecimal",
            "Details": "此代碼從雙精度浮點值創建 BigDecimal，但該值在轉換為十進制數字時不夠精確。例如，人們可能會假設在 Java 中寫入 new BigDecimal(0.1) 創建出正好等於 0.1 的 BigDecimal（未縮放的值為 1，比例為 1），但它實際上等於 0.1000000000000000055511151231257827021181583404541015625。您可能想使用 BigDecimal.valueOf(double d) 方法，它使用雙精度浮點數的字符串表示來創建 BigDecimal。"
        },
        "DMI_DOH": {
            "ShortDescription": "糟糕！一個無意義的方法調用",
            "LongDescription": "在 {1} 中對 {2.nameAndSignature} 的無意義調用",
            "Details": "此方法調用毫無意義，原因應從檢查中明顯。"
        },
        "DMI_VACUOUS_CALL_TO_EASYMOCK_METHOD": {
            "ShortDescription": "無用/空調用 EasyMock 方法",
            "LongDescription": "在 {1} 中對 {2} 的無用/空調用",
            "Details": "此調用沒有傳遞任何對象給 EasyMock 方法，因此該調用不執行任何操作。"
        },
        "DMI_SCHEDULED_THREAD_POOL_EXECUTOR_WITH_ZERO_CORE_THREADS": {
            "ShortDescription": "以零個核心線程創建 ScheduledThreadPoolExecutor",
            "LongDescription": "在 {1} 中以零個核心線程創建 ScheduledThreadPoolExecutor",
            "Details": "(<a href=\"https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html#ScheduledThreadPoolExecutor-int-\">Javadoc)\n一個具有零個核心線程的 ScheduledThreadPoolExecutor 將不會執行任何操作，對最大池大小的更改將被忽略。"
        },
        "DMI_FUTILE_ATTEMPT_TO_CHANGE_MAXPOOL_SIZE_OF_SCHEDULED_THREAD_POOL_EXECUTOR": {
            "ShortDescription": "嘗試更改 ScheduledThreadPoolExecutor 的最大池大小無效",
            "LongDescription": "在 {1} 中嘗試更改 ScheduledThreadPoolExecutor 的最大池大小無效",
            "Details": "(<a href=\"https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html\">Javadoc)\n雖然 ScheduledThreadPoolExecutor 繼承自 ThreadPoolExecutor，但一些繼承的方法對其並不實用。尤其是，因為它作為使用 corePoolSize 線程的固定大小池以及一個無界隊列運行，對 maximumPoolSize 的調整沒有任何有用的效果。"
        },
        "DMI_UNSUPPORTED_METHOD": {
            "ShortDescription": "調用不支持的方法",
            "LongDescription": "在 {1} 中調用不支持的方法 {2}",
            "Details": "此方法調用的所有目標都拋出 UnsupportedOperationException。\n"
        },
        "DMI_EMPTY_DB_PASSWORD": {
            "ShortDescription": "空數據庫密碼",
            "LongDescription": "在 {1} 中指定的空數據庫密碼",
            "Details": "該代碼使用空白或空密碼創建數據庫連接。這表明數據庫沒有受到密碼的保護。\n"
        },
        "DMI_CONSTANT_DB_PASSWORD": {
            "ShortDescription": "硬編碼的常量數據庫密碼",
            "LongDescription": "在 {1} 中指定的硬編碼常量數據庫密碼",
            "Details": "該代碼使用硬編碼的常量密碼創建數據庫連接。任何可以訪問源代碼或已編譯代碼的人都可以輕易知道該密碼。\n"
        },
        "HRS_REQUEST_PARAMETER_TO_COOKIE": {
            "ShortDescription": "基於不受信任的輸入生成的 HTTP cookie",
            "LongDescription": "在 {1} 中基於不受信任的輸入生成的 HTTP cookie",
            "Details": "該代碼使用不受信任的 HTTP 參數構造 HTTP Cookie。如果此 cookie 被添加到 HTTP 響應中，將允許 HTTP 響應拆分的漏洞。有關更多信息，請參閱 <a href=\"http://en.wikipedia.org/wiki/HTTP_response_splitting\">http://en.wikipedia.org/wiki/HTTP_response_splitting</a>。\nSpotBugs 僅尋找最明顯的 HTTP 響應拆分情況。如果 SpotBugs 發現，您幾乎肯定還有更多漏洞沒有被報告。如果您擔心 HTTP 響應拆分，應該認真考慮使用商業靜態分析或滲透測試工具。\n"
        },
        "HRS_REQUEST_PARAMETER_TO_HTTP_HEADER": {
            "ShortDescription": "HTTP 響應拆分漏洞",
            "LongDescription": "在 {1} 中直接寫入 HTTP 頭的 HTTP 參數",
            "Details": "該代碼直接將 HTTP 參數寫入 HTTP 頭，這允許 HTTP 響應拆分的漏洞。有關更多信息，請參閱 <a href=\"http://en.wikipedia.org/wiki/HTTP_response_splitting\">http://en.wikipedia.org/wiki/HTTP_response_splitting</a>。\nSpotBugs 僅尋找最明顯的 HTTP 響應拆分情況。如果 SpotBugs 發現，您幾乎肯定還有其他漏洞沒有被報告。如果您擔心 HTTP 響應拆分，應該認真考慮使用商業靜態分析或滲透測試工具。\n"
        },
        "PT_RELATIVE_PATH_TRAVERSAL": {
            "ShortDescription": "Servlet 中的相對路徑遍歷",
            "LongDescription": "在 {1} 中的相對路徑遍歷",
            "Details": "該軟體使用 HTTP 請求參數構造應在受限目錄內的路徑名，但未妥善處理如 \"..\" 這樣的序列，因此能夠解析到該目錄外的位置。\n\n有關更多信息，請參見 <a href=\"http://cwe.mitre.org/data/definitions/23.html\">http://cwe.mitre.org/data/definitions/23.html</a>。\nSpotBugs 僅尋找最明顯的相對路徑遍歷情況。如果 SpotBugs 發現，您幾乎肯定還有其他未報告的漏洞。如果您擔心相對路徑遍歷，應該認真考慮使用商業靜態分析或滲透測試工具。\n"
        },
        "PT_ABSOLUTE_PATH_TRAVERSAL": {
            "ShortDescription": "Servlet 中的絕對路徑遍歷",
            "LongDescription": "在 {1} 中的絕對路徑遍歷",
            "Details": "該軟體使用 HTTP 請求參數構造應在受限目錄內的路徑名，但未妥善處理絕對路徑序列（例如 \" /abs/path \"），因此能夠解析到該目錄外的位置。\n\n有關更多信息，請參見 <a href=\"http://cwe.mitre.org/data/definitions/36.html\">http://cwe.mitre.org/data/definitions/36.html</a>。\nSpotBugs 僅尋找最明顯的絕對路徑遍歷情況。如果 SpotBugs 發現，您幾乎肯定還有其他未報告的漏洞。如果您擔心絕對路徑遍歷，應該認真考慮使用商業靜態分析或滲透測試工具。\n"
        },
        "XSS_REQUEST_PARAMETER_TO_SERVLET_WRITER": {
            "ShortDescription": "Servlet 反射的跨站腳本（XSS）漏洞",
            "LongDescription": "在 {1} 中寫入 Servlet 輸出的 HTTP 參數",
            "Details": "該代碼直接將 HTTP 參數寫入 Servlet 輸出，從而允許反射的跨站腳本（XSS）漏洞。有關更多信息，請參見 <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting</a>。\nSpotBugs 僅尋找最明顯的跨站腳本漏洞。如果 SpotBugs 發現，您幾乎肯定還有其他未報告的跨站腳本漏洞。如果您擔心跨站腳本漏洞，應該認真考慮使用商業靜態分析或滲透測試工具。\n"
        },
        "XSS_REQUEST_PARAMETER_TO_SEND_ERROR": {
            "ShortDescription": "Servlet 錯誤頁中的反射 XSS 漏洞",
            "LongDescription": "在 {1} 中寫入 Servlet 錯誤頁的 HTTP 參數",
            "Details": "該代碼直接將 HTTP 參數寫入伺服器錯誤頁面（使用 HttpServletResponse.sendError）。回顯此不受信任的輸入會導致反射的跨站腳本（XSS）漏洞。 有關更多信息，請參見 <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting</a>。\nSpotBugs 僅尋找最明顯的跨站腳本漏洞。如果 SpotBugs 發現，您幾乎肯定還有其他未報告的跨站腳本漏洞。如果您擔心跨站腳本漏洞，應該認真考慮使用商業靜態分析或滲透測試工具。\n"
        },
        "XSS_REQUEST_PARAMETER_TO_JSP_WRITER": {
            "ShortDescription": "JSP 反射的跨站腳本（XSS）漏洞",
            "LongDescription": "HTTP 參數直接寫入 JSP 輸出，在 {1.class} 中出現反射 XSS 漏洞",
            "Details": "該代碼直接將 HTTP 參數寫入 JSP 輸出，從而允許跨站腳本（XSS）漏洞。 有關更多信息，請參見 <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting</a>。\nSpotBugs 僅尋找最明顯的跨站腳本漏洞。如果 SpotBugs 發現，您幾乎肯定還有其他未報告的跨站腳本漏洞。如果您擔心跨站腳本漏洞，應該認真考慮使用商業靜態分析或滲透測試工具。\n"
        },
        "SW_SWING_METHODS_INVOKED_IN_SWING_THREAD": {
            "ShortDescription": "某些 Swing 方法需要在 Swing 線程中調用",
            "LongDescription": "在 {1} 中調用 Swing 方法需要在 Swing 事件線程中執行",
            "Details": "(<a href=\"http://web.archive.org/web/20090526170426/http://java.sun.com/developer/JDCTechTips/2003/tt1208.html\">來自 JDC 技術提示): Swing 方法\nshow()、setVisible() 和 pack() 將為框架創建相關對等體。\n創建對等體時，系統創建事件調度線程。\n這會使事情變得複雜，因為事件調度線程可能在 pack 和 validate 仍在處理時通知監聽器。此情況可能導致\n兩個線程同時處理 Swing 組件 GUI 是一個嚴重缺陷，可能導致死鎖或其他相關的線程問題。pack 調用會導致\n組件被實現。當它們被實現時（即，不一定可見），可能會在事件調度線程上觸發監聽器的通知。"
        },
        "IL_INFINITE_LOOP": {
            "ShortDescription": "表面上看是無限循環",
            "LongDescription": "在 {1} 中存在表示無限循環的情況",
            "Details": "此循環似乎沒有終止的方法（除非通過拋出異常）。"
        },
        "IL_INFINITE_RECURSIVE_LOOP": {
            "ShortDescription": "表面上看是無限遞歸循環",
            "LongDescription": "在 {1} 中存在表示無限遞歸循環的情況",
            "Details": "此方法無條件調用自身，表明可能存在無限遞歸循環，最終會導致堆棧溢出。"
        },
        "IL_CONTAINER_ADDED_TO_ITSELF": {
            "ShortDescription": "集合被添加到自身",
            "LongDescription": "在 {1} 中集合被添加到自身",
            "Details": "一個集合被添加到自身，這將導致計算 hashCode 時拋出 StackOverflowException。"
        },
        "VO_VOLATILE_REFERENCE_TO_ARRAY": {
            "ShortDescription": "對數組的 volatile 引用不將數組元素視為 volatile",
            "LongDescription": "{1} 是對數組的 volatile 引用；數組元素是非 volatile 的",
            "Details": "這聲明了對數組的 volatile 引用，讀取和寫入數組的引用被視為 volatile，但數組元素是非 volatile 的。要獲取 volatile 數組元素，您需要使用 java.util.concurrent 中的原子數組類（在 Java 5.0 中提供）。"
        },
        "VO_VOLATILE_INCREMENT": {
            "ShortDescription": "對易變字段的增量不是原子的",
            "LongDescription": "在 {1} 中對易變字段 {2} 的增量",
            "Details": "該代碼對易變字段進行增量/減量操作。易變字段的增量/減量操作不是原子的。如果多個線程同時對該字段進行增量/減量操作，可能會導致增量/減量丟失。\n"
        },
        "UI_INHERITANCE_UNSAFE_GETRESOURCE": {
            "ShortDescription": "如果類被擴展，使用 GetResource 可能不安全",
            "LongDescription": "在 {1} 中使用 GetResource 可能不安全，如果類被擴展",
            "Details": "調用可能會得到與預期結果不同的結果，如果此類被其他包中的類擴展。"
        },
        "NP_BOOLEAN_RETURN_NULL": {
            "ShortDescription": "返回類型為 Boolean 的方法返回顯式的 null",
            "LongDescription": "{1} 的返回類型為 Boolean，並返回顯式的 null",
            "Details": "返回 Boolean.TRUE、Boolean.FALSE 或 null 的方法是一個等待發生意外的隱患。此方法可以被調用，仿佛它返回一個布爾值類型，編譯器會插入自動拆箱操作。如果返回了 null 值，將導致 NullPointerException。"
        },
        "NP_OPTIONAL_RETURN_NULL": {
            "ShortDescription": "返回類型為 Optional 的方法返回顯式的 null",
            "LongDescription": "{1} 的返回類型為 Optional，並返回顯式的 null",
            "Details": "使用 Optional 返回類型（java.util.Optional 或 com.google.common.base.Optional）始終意味著設計時不希望返回顯式的 null。在這種情況下返回 null 是違反契約的，可能會破壞客戶端代碼。"
        },
        "NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR": {
            "ShortDescription": "非空字段未初始化",
            "LongDescription": "{1} 未通過構造函數初始化非空字段 {2.name}",
            "Details": "該字段標記為非空，但在構造函數中並未寫入。該字段可能在構造函數中其他位置進行初始化，或者在使用前始終能夠初始化。"
        },
        "NP_SYNC_AND_NULL_CHECK_FIELD": {
            "ShortDescription": "在同一字段上進行同步和 null 檢查。",
            "LongDescription": "在 {1} 中，字段 {2.givenClass} 被同步後檢查是否為 null。",
            "Details": "由於該字段被同步，因此它似乎不太可能為 null。如果它為 null 並且被同步，將拋出 NullPointerException，檢查將毫無意義。最好在另一個字段上進行同步。"
        },
        "RpC_REPEATED_CONDITIONAL_TEST": {
            "ShortDescription": "重複的條件測試",
            "LongDescription": "在 {1} 中重複的條件測試",
            "Details": "代碼包含一個條件測試被執行了兩次，緊接著另一條（例如，x == 0 || x == 0）。也許第二次出現的意圖應該是其他條件（例如，x == 0 || y == 0）。"
        },
        "TESTING": {
            "ShortDescription": "測試",
            "LongDescription": "在 {1} 中生成檢測警告",
            "Details": "此錯誤模式僅由新的、未完全實現的錯誤檢測器生成。"
        },
        "TESTING1": {
            "ShortDescription": "測試 1",
            "LongDescription": "在 {1} 中生成檢測警告 1",
            "Details": "此錯誤模式僅由新的、未完全實現的錯誤檢測器生成。"
        },
        "TESTING2": {
            "ShortDescription": "測試 2",
            "LongDescription": "在 {1} 中生成檢測警告 2",
            "Details": "此錯誤模式僅由新的、未完全實現的錯誤檢測器生成。"
        },
        "TESTING3": {
            "ShortDescription": "測試 3",
            "LongDescription": "在 {1} 中生成檢測警告 3",
            "Details": "此錯誤模式僅由新的、未完全實現的錯誤檢測器生成。"
        },
        "UNKNOWN": {
            "ShortDescription": "未知的錯誤模式",
            "LongDescription": "未知 bug 模式 BUG_PATTERN 在 {1} 中",
            "Details": "記錄了一個警告，但 SpotBugs 找不到此錯誤模式的描述，因此無法描述它。這種情況應該僅發生在 SpotBugs 或其配置中的錯誤，或者如果生成的分析使用了某個插件，但該插件當前未加載。"
        },
        "AM_CREATES_EMPTY_ZIP_FILE_ENTRY": {
            "ShortDescription": "創建一個空的 zip 文件條目",
            "LongDescription": "在 {1} 中創建一個空的 zip 文件條目",
            "Details": "該代碼調用後接著另一個調用。這會導致創建一個空的 ZipFile 條目。條目的內容應該在對 ZipFile 的調用之間寫入。"
        },
        "AM_CREATES_EMPTY_JAR_FILE_ENTRY": {
            "ShortDescription": "創建一個空的 jar 文件條目",
            "LongDescription": "在 {1} 中創建一個空的 jar 文件條目",
            "Details": "該代碼調用後接著另一個調用。這會導致創建一個空的 JarFile 條目。條目的內容應該在對 JarFile 的調用之間寫入。"
        },
        "IMSE_DONT_CATCH_IMSE": {
            "ShortDescription": "可疑地捕獲 IllegalMonitorStateException",
            "LongDescription": "在 {1} 中可疑地捕獲 IllegalMonitorStateException",
            "Details": "IllegalMonitorStateException 通常只有在你的代碼存在設計缺陷（在未持有鎖的對象上調用 wait 或 notify）時才會拋出。"
        },
        "FL_MATH_USING_FLOAT_PRECISION": {
            "ShortDescription": "方法使用浮點精度進行數學計算",
            "LongDescription": "{1} 使用浮點精度進行數學計算",
            "Details": "該方法使用浮點精度進行數學運算。浮點精度非常不準確。例如，16777216.0f + 1.0f = 16777216.0f。考慮使用雙精度浮點計算。"
        },
        "CAA_COVARIANT_ARRAY_FIELD": {
            "ShortDescription": "協變數組分配給字段",
            "LongDescription": "類型為 {2} 的數組被分配給類型為 {3} 的字段",
            "Details": "協變類型的數組被分配給一個字段。這會造成困惑，並可能在運行時導致 ArrayStoreException，如果稍後該數組中存儲其他類型的引用，例如以下代碼：\nNumber[] arr = new Integer[10];\narr[0] = 1.0;\n考慮更改創建數組的類型或字段類型。"
        },
        "CAA_COVARIANT_ARRAY_LOCAL": {
            "ShortDescription": "協變數組分配給局部變量",
            "LongDescription": "類型為 {2} 的數組被分配給類型為 {3} 的變量",
            "Details": "協變類型的數組被分配給一個局部變量。這會造成困惑，並可能在運行時導致 ArrayStoreException，如果稍後該數組中存儲其他類型的引用，例如以下代碼：\nNumber[] arr = new Integer[10];\narr[0] = 1.0;\n考慮更改創建數組的類型或局部變量類型。"
        },
        "CAA_COVARIANT_ARRAY_RETURN": {
            "ShortDescription": "協變數組從方法返回",
            "LongDescription": "類型為 {2} 的數組從返回類型為 {3} 的方法返回",
            "Details": "協變類型的數組從方法返回。這會造成困惑，並可能在運行時導致 ArrayStoreException，如果調用代碼嘗試在返回的數組中存儲其他類型的引用。考慮更改創建數組的類型或方法的返回類型。"
        },
        "CAA_COVARIANT_ARRAY_ELEMENT_STORE": {
            "ShortDescription": "可能不兼容的元素存儲在協變數組中",
            "LongDescription": "類型為 {2} 的值存儲進元素類型為 {3} 的數組中",
            "Details": "值被存儲進數組中，而值的類型與數組的類型不匹配。通過分析知道實際數組類型比聲明的變量或字段類型更窄，此賦值不符合原始數組類型。此賦值可能在運行時引發 ArrayStoreException。"
        },
        "CN_IDIOM": {
            "ShortDescription": "類實現了 Cloneable 但未定義或使用 clone 方法",
            "LongDescription": "類 {0} 實現了 Cloneable 但未定義或使用 clone 方法",
            "Details": "類實現了 Cloneable 但未定義或使用 clone 方法。"
        },
        "CN_IMPLEMENTS_CLONE_BUT_NOT_CLONEABLE": {
            "ShortDescription": "類定義 clone() 但未實現 Cloneable",
            "LongDescription": "{0} 定義了 clone() 但未實現 Cloneable",
            "Details": "該類定義了一個 clone() 方法，但該類未實現 Cloneable。某些情況下這沒問題（例如，你想控制子類如何克隆自身），但確保這就是你所期望的。"
        },
        "CN_IDIOM_NO_SUPER_CALL": {
            "ShortDescription": "clone 方法未調用 super.clone()",
            "LongDescription": "{1} 未調用 super.clone()",
            "Details": "這個非最終類定義了一個 clone() 方法，但沒有調用 super.clone()。\n如果該類（“”）被一個子類（“”）擴展，該子類調用 super.clone()，那麼很可能的\n'clone() 方法將返回一個類型的對象，這違反了 clone() 的標準契約。如果所有的 clone() 方法都調用 super.clone()，那麼它們就能保證使用 Object.clone()，該方法總是返回正確類型的對象。"
        },
        "NM_FUTURE_KEYWORD_USED_AS_IDENTIFIER": {
            "ShortDescription": "使用的標識符是 Java 後續版本中的關鍵字",
            "LongDescription": "{1} 使用 {2} 作為變量名，這在 Java 後續版本中是個關鍵字",
            "Details": "該標識符是 Java 後續版本中保留的關鍵字，您的代碼將需要在以後的版本中進行更改以編譯。"
        },
        "NM_FUTURE_KEYWORD_USED_AS_MEMBER_IDENTIFIER": {
            "ShortDescription": "使用的標識符是 Java 後續版本中的關鍵字",
            "LongDescription": "{1} 與在更高版本 Java 中的關鍵字衝突",
            "Details": "該標識符在後續版本的 Java 中被用作關鍵字。此代碼，以及引用此 API 的任何代碼，\n在後續版本中編譯時都需進行更改。"
        },
        "DE_MIGHT_DROP": {
            "ShortDescription": "方法可能丟掉異常",
            "LongDescription": "{1} 可能丟掉 {2}",
            "Details": "該方法可能丟掉一個異常。一般來說，異常應以某種方式處理或報告，或者應從方法中拋出。"
        },
        "DE_MIGHT_IGNORE": {
            "ShortDescription": "方法可能忽略異常",
            "LongDescription": "{1} 可能忽略 {2}",
            "Details": "該方法可能忽略一個異常。一般來說，異常應以某種方式處理或報告，或者應從方法中拋出。"
        },
        "DP_DO_INSIDE_DO_PRIVILEGED": {
            "ShortDescription": "調用的方法應該僅在 doPrivileged 塊內調用",
            "LongDescription": "{2} 的調用應該在 doPrivileged 塊內進行，在 {1} 中",
            "Details": "該代碼調用一個需要安全權限檢查的方法。如果此代碼將被授予安全權限，但可能會被沒有安全權限的代碼調用，則該調用需要在 doPrivileged 塊內進行。"
        },
        "DP_DO_INSIDE_DO_PRIVILEDGED": {
            "ShortDescription": "調用的方法應該僅在 doPrivileged 塊內調用",
            "LongDescription": "{2} 的調用應該在 doPrivileged 塊內進行，在 {1} 中",
            "Details": "該代碼調用一個需要安全權限檢查的方法。如果此代碼將被授予安全權限，但可能會被沒有安全權限的代碼調用，則該調用需要在 doPrivileged 塊內進行。"
        },
        "DP_CREATE_CLASSLOADER_INSIDE_DO_PRIVILEGED": {
            "ShortDescription": "類加載器應該僅在 doPrivileged 塊內創建",
            "LongDescription": "{1} 創建一個 {2} 類加載器，這應該在 doPrivileged 塊內執行",
            "Details": "該代碼創建一個類加載器，如果安裝了安全管理器，需要權限。如果此代碼可能被沒有安全權限的代碼調用，則類加載器的創建需要在 doPrivileged 塊內進行。"
        },
        "JCIP_FIELD_ISNT_FINAL_IN_IMMUTABLE_CLASS": {
            "ShortDescription": "不可變類的字段應該是 final",
            "LongDescription": "{1.givenClass} 應該是 final，因為 {0} 被標記為 Immutable。",
            "Details": "該類使用 net.jcip.annotations.Immutable 或 javax.annotation.concurrent.Immutable 注解，且這些注解的規則要求所有字段都是 final。"
        },
        "DMI_THREAD_PASSED_WHERE_RUNNABLE_EXPECTED": {
            "ShortDescription": "傳遞了線程而期望 Runnable",
            "LongDescription": "在 {1} 中傳遞了線程而期望 Runnable",
            "Details": "Thread 對象作為參數傳遞給一個期望 Runnable 的方法。這是相當不尋常的，可能表示邏輯錯誤或導致意外行為。"
        },
        "DMI_COLLECTION_OF_URLS": {
            "ShortDescription": "URL 的映射和集合可能會佔用性能",
            "LongDescription": "{1} 是或使用了一個 URL 的映射或集合，這可能佔用性能",
            "Details": "該方法或字段是或使用了一個 URL 的 Map 或 Set。由於 URL 的 equals 和 hashCode 方法執行域名解析，這可能導致顯著的性能損失。\n請參見 <a href=\"http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html\">http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html</a> 獲取更多信息。\n考慮使用其他方式。"
        },
        "DMI_BLOCKING_METHODS_ON_URL": {
            "ShortDescription": "URL 的 equals 和 hashCode 方法是阻塞的",
            "LongDescription": "{2} 的調用，阻塞以進行域名解析，在 {1} 中",
            "Details": "該代碼將常量字符串（長度為 1）傳遞給 String.indexOf()。\n使用 String.indexOf() 的整數實現更為高效。\n例如，調用而不是"
        },
        "DMI_ANNOTATION_IS_NOT_VISIBLE_TO_REFLECTION": {
            "ShortDescription": "沒有運行時保留，不可用反射檢查註解的存在",
            "LongDescription": "使用反射檢查該註解 {3} 的存在，然而它沒有運行時保留，在 {1} 中",
            "Details": "除非註解本身被 @Retention(RetentionPolicy.RUNTIME) 註解，否則無法使用反射觀察該註解（例如，使用 isAnnotationPresent 方法）。"
        },
        "DM_EXIT": {
            "ShortDescription": "方法調用 System.exit(...)",
            "LongDescription": "{1} 調用 System.exit(...)，這將關閉整個虛擬機",
            "Details": "調用 System.exit 將關閉整個 Java 虛擬機。只有在適當的時候才應這樣做。這種調用使得其他代碼無法或很難調用你的代碼。考慮改為拋出 RuntimeException。"
        },
        "DM_RUN_FINALIZERS_ON_EXIT": {
            "ShortDescription": "方法調用危險的方法 runFinalizersOnExit",
            "LongDescription": "{1} 調用危險的方法 runFinalizersOnExit",
            "Details": "出於任何原因，不要調用 System.runFinalizersOnExit 或 Runtime.runFinalizersOnExit：它們是 Java 庫中最危險的方法之一。—— Joshua Bloch"
        },
        "DM_STRING_CTOR": {
            "ShortDescription": "方法調用了低效的 new String(String) 構造函數",
            "LongDescription": "{1} 調用了低效的 new String(String) 構造函數",
            "Details": "使用該構造函數浪費內存，因為構造的對象在功能上與作為參數傳遞的對象 indistinguishable。\n直接使用該參數。"
        },
        "DM_STRING_VOID_CTOR": {
            "ShortDescription": "方法調用了低效的 new String() 構造函數",
            "LongDescription": "{1} 調用了低效的 new String() 構造函數",
            "Details": "使用無參數構造創建新對象浪費內存，因為創建的對象在功能上與空字符串常量 indistinguishable。\nJava 保證相同的字符串常量將由同一對象表示。\n因此，應直接使用空字符串常量。"
        },
        "DM_STRING_TOSTRING": {
            "ShortDescription": "方法在字符串上調用 toString() 方法",
            "LongDescription": "{1} 在字符串上調用 toString() 方法",
            "Details": "調用是冗餘操作。只需使用字符串。"
        },
        "DM_GC": {
            "ShortDescription": "顯式垃圾回收；除了基準測試代碼外極具懷疑",
            "LongDescription": "{1} 強制進行垃圾回收；除了基準測試代碼外極具懷疑",
            "Details": "代碼顯式調用垃圾回收。除特定的基準測試外，這非常可疑。過去，人們在 close 或 finalize 方法等例程中顯式調用垃圾收集器的情況導致了巨大的性能問題。垃圾收集可能是昂貴的。強迫數百或數千次垃圾收集將使機器變得緩慢。"
        },
        "DM_BOOLEAN_CTOR": {
            "ShortDescription": "方法調用了低效的布爾構造函數；請使用 Boolean.valueOf(...)",
            "LongDescription": "{1} 調用了低效的布爾構造函數；请使用 Boolean.valueOf(...)",
            "Details": "創建新的實例會浪費內存，因為對象是不可變的，並且此類型只有兩個有效值。&nbsp; 請使用該方法（或 Java 5 自動裝箱）來創建對象。"
        },
        "DM_NUMBER_CTOR": {
            "ShortDescription": "方法調用了低效的數字構造函數；請使用靜態 valueOf",
            "LongDescription": "{1} 調用了低效的 {2} 構造函數；請使用 {3} 來替代",
            "Details": "使用 new Integer(int) 總是會生成一個新的對象，而允許編譯器、類庫或 JVM 進行值的緩存。使用緩存的值可以避免對象分配，代碼會更快。-128 到 127 之間的值被保證有對應的緩存實例，使用這種方式比使用構造函數快大約 3.5 倍。對於超出該常量範圍的值，兩種方式的性能是相同的。除非該類必須與早於 Java 5 的 JVM 兼容，否則在創建實例時，請使用自動裝箱或該方法。"
        },
        "DM_FP_NUMBER_CTOR": {
            "ShortDescription": "方法調用了低效的浮點數構造函數；請使用靜態 valueOf",
            "LongDescription": "{1} 調用了低效的 {2} 構造函數；請使用 {3} 來替代",
            "Details": "使用 new Double(double) 總是會生成一個新的對象，而允許編譯器、類庫或 JVM 進行值的緩存。使用緩存的值可以避免對象分配，代碼會更快。除非該類必須與早於 Java 5 的 JVM 兼容，否則在創建實例時，請使用自動裝箱或該方法。"
        },
        "DM_CONVERT_CASE": {
            "ShortDescription": "考慮使用帶區域參數的方法版本",
            "LongDescription": "在 {1} 中使用非本地化的 String.toUpperCase() 或 String.toLowerCase()",
            "Details": "正在將字符串轉換為大寫或小寫，使用的是平台的默認編碼。當用於國際字符時，這可能會導致不正確的轉換。請使用 String.toUpperCase(Locale l) 或 String.toLowerCase(Locale l) 的版本。"
        },
        "BX_UNBOXED_AND_COERCED_FOR_TERNARY_OPERATOR": {
            "ShortDescription": "原始值被解箱並強制轉換為三元運算符",
            "LongDescription": "原始值在 {1} 中被解箱並強制轉換為三元運算符",
            "Details": "一個包裝的原始值在條件三元運算符（即 b ? e1 : e2 運算符）的評估過程中被解箱並轉換為另一個原始類型。Java 的語義要求，如果 a 和 b 是包裝的數值類型，那麼這些值會被解箱和值轉換/強制為它們的公共類型（例如，若 a 的類型是 A，b 的類型是 B，則 a 被解箱並轉換為浮點值，然後重新包裝。請參閱 JLS 第 15.25 節）。"
        },
        "BX_BOXING_IMMEDIATELY_UNBOXED": {
            "ShortDescription": "原始值被包裝後立即解箱",
            "LongDescription": "原始值在 {1} 中被包裝後立即解箱",
            "Details": "一個原始值被包裝後立即解箱。這可能是由於在需要解箱值的地方手動進行了包裝，導致編譯器不得不立即撤銷包裝的工作。"
        },
        "BX_UNBOXING_IMMEDIATELY_REBOXED": {
            "ShortDescription": "包裝值被解箱後立即重新包裝",
            "LongDescription": "包裝值在 {1} 中被解箱後立即重新包裝",
            "Details": "一個包裝值被解箱後立即重新包裝。"
        },
        "BX_BOXING_IMMEDIATELY_UNBOXED_TO_PERFORM_COERCION": {
            "ShortDescription": "原始值被包裝後解箱以執行原始強制轉換",
            "LongDescription": "原始值在 {1} 中被包裝後解箱以執行原始強制轉換",
            "Details": "一個包裝的原始值被構造後立即轉換為另一種原始類型（例如，new Double(d).intValue()）。直接執行原始強制轉換（例如，(int) d）會更好。"
        },
        "DM_BOXED_PRIMITIVE_TOSTRING": {
            "ShortDescription": "方法創建了一個包裝的原始值只是為了調用 toString",
            "LongDescription": "{1} 中包裝的原始值僅為調用 toString 而創建",
            "Details": "一個包裝的原始值被創建只是為了調用 toString()。使用接收原始值的靜態形式的 toString 更為有效。即，使用...new Integer(1).toString()、new Long(1).toString()、new Float(1.0).toString()、new Double(1.0).toString()、new Byte(1).toString()、new Short(1).toString()、new Boolean(true).toString()。"
        },
        "DM_BOXED_PRIMITIVE_FOR_PARSING": {
            "ShortDescription": "通過裝箱/拆箱來解析一個原始值",
            "LongDescription": "通過裝箱/拆箱來解析原始值 {1}",
            "Details": "一個包裝的原始值從字符串中創建，僅為提取未拆箱的原始值。直接調用靜態的 parseXXX 方法會更高效。"
        },
        "DM_BOXED_PRIMITIVE_FOR_COMPARE": {
            "ShortDescription": "裝箱一個原始值以進行比較",
            "LongDescription": "原始值被裝箱以調用 {2}：請使用 {3} 來替代",
            "Details": "一個包裝的原始值被創建只是為了調用方法。使用靜態比較方法（對於雙精度和浮點，自 Java 1.4 以來適用，對於其他原始類型，自 Java 7 起適用），直接對原始值進行比較會更高效。"
        },
        "DM_NEW_FOR_GETCLASS": {
            "ShortDescription": "方法分配了一個對象，只是為了獲取類對象",
            "LongDescription": "{1} 分配了一個對象，只是為了獲取類對象",
            "Details": "該方法分配了一個對象，僅為在其上調用 getClass()，以檢索其 Class 對象。更簡單的方法是直接訪問類的 .class 屬性。"
        },
        "DM_MONITOR_WAIT_ON_CONDITION": {
            "ShortDescription": "在條件上調用了 monitor wait()",
            "LongDescription": "在 {1} 中對 Condition 調用了 monitor wait()",
            "Details": "該方法在對象上調用了 wait()。等待應該使用由接口定義的某個方法來進行。"
        },
        "RV_01_TO_INT": {
            "ShortDescription": "從 0 到 1 的隨機值被強制轉換為整數 0",
            "LongDescription": "{1} 使用生成了從 0 到 1 的隨機值，然後強制將該值轉換為整數 0",
            "Details": "一個從 0 到 1 的隨機值被強制轉換為整數 0。您可能想在強制轉換為整數之前將隨機值乘以其他東西，或者使用該方法。"
        },
        "DM_INVALID_MIN_MAX": {
            "ShortDescription": "Math.max 和 Math.min 的組合不正確",
            "LongDescription": "Math.max 和 Math.min 的組合不正確：該代碼始終返回 {2}",
            "Details": "該代碼嘗試使用 Math.min(0, Math.max(100, value)) 這樣的構造來限制值的範圍。然而常量的順序不正確：應該是 Math.min(100, Math.max(0, value))。因此，結果是該代碼始終產生相同的結果（或如果值為 NaN 則為 NaN）。"
        },
        "DM_NEXTINT_VIA_NEXTDOUBLE": {
            "ShortDescription": "使用 Random 的 nextInt 方法生成隨機整數，而不是 nextDouble",
            "LongDescription": "{1} 使用 Random 的 nextDouble 方法來生成隨機整數；使用 nextInt 更高效",
            "Details": "如果 x 為 random object，您可以通過使用 x.nextInt(n) 來生成從 0 到 n 的隨機數，而不是使用 (int)(r.nextDouble() * n)。nextInt 的參數必須為正。如果您想生成從 -99 到 0 的隨機值，則使用該方法。"
        },
        "SQL_NONCONSTANT_STRING_PASSED_TO_EXECUTE": {
            "ShortDescription": "非恆定字符串傳遞給執行或 addBatch 方法的 SQL 語句",
            "LongDescription": "{1} 將非恆定字符串傳遞給 SQL 語句的 execute 或 addBatch 方法",
            "Details": "該方法使用看起來是動態生成的字符串調用了 SQL 語句的 execute 或 addBatch 方法。考慮使用預處理語句。這樣更高效，且在抵禦 SQL 注入攻擊方面風險更小。"
        },
        "SQL_PREPARED_STATEMENT_GENERATED_FROM_NONCONSTANT_STRING": {
            "ShortDescription": "從非恆定字符串生成預處理語句",
            "LongDescription": "在 {1} 中生成的預處理語句來自非恆定字符串",
            "Details": "該代碼從非恆定字符串生成一個 SQL 預處理語句。如果未經過檢驗，用戶提供的受污染數據用於構建該字符串，可能會發生 SQL 注入，使得預處理語句執行意外和不期望的操作。"
        },
        "DM_USELESS_THREAD": {
            "ShortDescription": "使用默認空運行方法創建了線程",
            "LongDescription": "{1} 使用默認空運行方法創建了線程",
            "Details": "該方法創建了一個線程，而沒有通過從 Thread 類派生或傳遞 Runnable 對象來指定運行方法。這個線程因此無所作為，僅浪費時間。"
        },
        "DC_DOUBLECHECK": {
            "ShortDescription": "字段可能存在雙重檢查",
            "LongDescription": "{1} 中可能對 {2} 進行雙重檢查",
            "Details": "該方法可能包含雙重檢查鎖定的實例。根據 Java 內存模型的語義，該模式並不正確。有關更多信息，請查看網頁 <a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html\">http://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html</a>"
        },
        "DC_PARTIALLY_CONSTRUCTED": {
            "ShortDescription": "可能暴露部分初始化的對象",
            "LongDescription": "在 {1} 中可能暴露部分初始化的對象",
            "Details": "該方法似乎使用了帶雙重檢查鎖定的延遲字段初始化。儘管該字段被正確聲明為 volatile，但在字段賦值後的內部結構可能發生變化，因此另一個線程可能看到部分初始化的對象。要解決此問題，請考慮先將對象存儲到局部變數中，並在對象完全構造後再保存到 volatile 字段。"
        },
        "FI_FINALIZER_NULLS_FIELDS": {
            "ShortDescription": "終結器將字段設為 null",
            "LongDescription": "{3} 在 {1.class} 的 finalize 方法中被設置為 null",
            "Details": "該終結器將字段設為 null。通常這是一個錯誤，因為這不會幫助垃圾回收，並且對象將會被垃圾回收。"
        },
        "FI_FINALIZER_ONLY_NULLS_FIELDS": {
            "ShortDescription": "終結器只將字段設為 null",
            "LongDescription": "{1} 僅將字段設為 null",
            "Details": "該終結器什麼都不做，只是將字段設為 null。這完全沒有意義，會導致對象被垃圾收集、終結，然後被再次垃圾收集。您應該刪除終結器方法。"
        },
        "FI_PUBLIC_SHOULD_BE_PROTECTED": {
            "ShortDescription": "終結器應該是受保護的，而不是公共的",
            "LongDescription": "{1} 是公共的；應該是受保護的",
            "Details": "一個類的終結器方法應該具有受保護的訪問權限，而不是公共權限。"
        },
        "FI_EMPTY": {
            "ShortDescription": "空終結器應該被刪除",
            "LongDescription": "{1} 为空且应该被删除",
            "Details": "空方法是無用的，因此應該被刪除。"
        },
        "FI_NULLIFY_SUPER": {
            "ShortDescription": "終結器使父類終結器失效",
            "LongDescription": "{1} 使 {2}.finalize(); 的調用失效。這是有意嗎？",
            "Details": "這個空方法顯式地否定了任何父類定義的終結器的效果。&nbsp; 任何在父類中定義的終結器操作都將不會被執行。除非這是有意的，否則請刪除此方法。"
        },
        "FI_USELESS": {
            "ShortDescription": "終結器什麼都不做，只是調用父類終結器",
            "LongDescription": "{1} 僅調用 super.finalize(); 請刪除它",
            "Details": "該方法唯一做的事情是調用父類的 finalize() 方法，使其變得多餘。&nbsp; 請刪除它。"
        },
        "FI_MISSING_SUPER_CALL": {
            "ShortDescription": "終結器未調用父類終結器",
            "LongDescription": "{1} 缺少對 super.finalize() 的調用，因此 {2}.finalize() 不會被調用",
            "Details": "該方法未調用其父類的 finalize() 方法。&nbsp; 因此，任何在父類中定義的終結器操作將不會被執行。&nbsp; 請添加對 super.finalize() 的調用。"
        },
        "FI_EXPLICIT_INVOCATION": {
            "ShortDescription": "顯式調用終結器",
            "LongDescription": "在 {1} 中顯式調用 {2} 方法",
            "Details": "該方法包含對對象的終結器方法的顯式調用。&nbsp; 因為終結器方法應該只由 VM 執行一次，顯式調用是一種壞主意。如果一組互連的對象被終結，那麼 VM 會在所有可終結對象上調用 finalize 方法，可能會在不同線程中同時進行。因此，在 X 類的終結器方法中調用 X 引用的對象的 finalize 方法尤其不明智，因為它們可能已經在另一個線程中被終結。"
        },
        "EQ_CHECK_FOR_OPERAND_NOT_COMPATIBLE_WITH_THIS": {
            "ShortDescription": "equals 方法檢查不兼容的操作數",
            "LongDescription": "{1} 檢查操作數的類型為 {2.givenClass}",
            "Details": "該 equals 方法檢查參數是否為某種不兼容的類型（即，一個既不是定義 equals 方法的類的超類，也不是其子類的類）。例如，Foo 類可能具有如下 equals 方法：\npublic boolean equals(Object o) { if (o instanceof Foo) return name.equals(((Foo)o).name); else if (o instanceof String) return name.equals(o); else return false; }\n這被認為是不好的實踐，因為這使得實現一個對稱和傳遞的 equals 方法變得非常困難。沒有這些屬性，可能會發生非常意外的行為。"
        },
        "EQ_DONT_DEFINE_EQUALS_FOR_ENUM": {
            "ShortDescription": "為枚舉定義了協變的 equals() 方法",
            "LongDescription": "枚舉 {0} 定義了 equals({0.givenClass})",
            "Details": "該類定義了一個枚舉，而枚舉上的相等是基於對象的標識進行定義的。為枚舉值定義一個協變的 equals 方法是極度不好的實踐，因為這可能會導致有兩個不同的枚舉值使用協變枚舉方法比較時相等，而在正常比較時不相等。請不要這樣做。"
        },
        "EQ_SELF_USE_OBJECT": {
            "ShortDescription": "定義了協變的 equals() 方法，繼承了 Object.equals(Object)",
            "LongDescription": "{0} 定義了 equals({0.givenClass}) 方法並使用 Object.equals(Object)",
            "Details": "該類定義了一個協變版本的方法，但繼承了基類中定義的正常方法。&nbsp; 該類應該可能定義一個 boolean equals(Object) 方法。"
        },
        "EQ_OTHER_USE_OBJECT": {
            "ShortDescription": "定義了 equals() 方法，但未重寫 Object.equals(Object)",
            "LongDescription": "{0} 定義了 {1.givenClass} 方法並使用 Object.equals(Object)",
            "Details": "該類定義了一個方法，但沒有重寫基類中定義的正常方法。&nbsp; 該類應該可能定義一個 boolean equals(Object) 方法。"
        },
        "EQ_OTHER_NO_OBJECT": {
            "ShortDescription": "定義了 equals() 方法，但未重寫 equals(Object)",
            "LongDescription": "{0} 定義了 {1.givenClass} 方法，但未重寫 equals(Object)",
            "Details": "該類定義了一個方法，但沒有重寫基類中定義的正常方法。&nbsp; 而是從超類繼承了一個方法。該類應該可能定義一個 boolean equals(Object) 方法。"
        },
        "EQ_DOESNT_OVERRIDE_EQUALS": {
            "ShortDescription": "類未重寫超類中的 equals",
            "LongDescription": "{0} 未重寫 {2.givenClass}",
            "Details": "該類擴展了一個定義了 equals 方法的類，並添加了字段，但沒有自己定義一個 equals 方法。因此，該類實例的相等性將忽略子類的身份和添加的字段。請確保這是預期的，並且您不需要重寫 equals 方法。即使您不需要重寫 equals 方法，也應考慮重寫它，以記錄該子類的 equals 方法只返回調用 super.equals(o) 的結果。"
        },
        "EQ_SELF_NO_OBJECT": {
            "ShortDescription": "定義了協變的 equals() 方法",
            "LongDescription": "{0} 定義了 equals({0.givenClass}) 方法，但未定義 equals(Object)",
            "Details": "該類定義了一個協變版本的。&nbsp; 要正確重寫該方法，參數的類型必須為 Object。"
        },
        "EQ_OVERRIDING_EQUALS_NOT_SYMMETRIC": {
            "ShortDescription": "equals 方法重寫了超類中的 equals，可能不對稱",
            "LongDescription": "{1.class} 在 {2.class.givenClass} 中重寫了 equals，可能不對稱",
            "Details": "該類定義了一個 equals 方法，重寫了超類中的 equals 方法。兩個 equals 方法都在判斷兩個對象是否相等時使用了 instanceof。這樣可能會導致問題，因為很重要的是 equals 方法是對稱的（換句話說，a.equals(b) == b.equals(a)）。如果 B 是 A 的子類，而 A 的 equals 方法檢查參數是否是 A 的實例，B 的 equals 方法檢查參數是否是 B 的實例，那麼很可能這兩個方法定義的等價關係不是對稱的。"
        },
        "EQ_GETCLASS_AND_CLASS_CONSTANT": {
            "ShortDescription": "equals 方法对子類失效",
            "LongDescription": "{1} 對子類失效",
            "Details": "該類有一個 equals 方法，如果被子類繼承將會失效。它將類文字與參數的類進行比較（例如，在類中，它可能會檢查 Foo.class == o.getClass()）。最好檢查 this.getClass() == o.getClass()。"
        },
        "EQ_UNUSUAL": {
            "ShortDescription": "不尋常的 equals 方法",
            "LongDescription": "{1} 是不尋常的",
            "Details": "該類沒有遵循我們識別的任何模式來檢查參數的類型是否與該對象的類型兼容。此代碼可能沒有任何問題，但值得復審。"
        },
        "EQ_COMPARING_CLASS_NAMES": {
            "ShortDescription": "equals 方法比較類名而不是類物件",
            "LongDescription": "{1} 比較類名而不是類物件",
            "Details": "該類定義了一個 equals 方法，通過檢查兩個物件的類名是否相等來判斷它們是否是同一類。您可以有不同的類擁有相同的名稱，只要它們是由不同的類加載器加載的。只需檢查類物件是否相同。"
        },
        "EQ_ALWAYS_TRUE": {
            "ShortDescription": "equals 方法總是返回 true",
            "LongDescription": "{1} 總是返回 true",
            "Details": "該類定義了一個 equals 方法，總是返回 true。這很有想像力，但並不聰明。再者，這意味著該 equals 方法不是對稱的。"
        },
        "EQ_ALWAYS_FALSE": {
            "ShortDescription": "equals 方法總是返回 false",
            "LongDescription": "{1} 總是返回 false",
            "Details": "該類定義了一個 equals 方法，總是返回 false。這意味著物件不等於其自身，並且無法創建該類的有用 Map 或 Set。從根本上講，這意味著 equals 不是自反的，這是 equals 方法的一項要求。可能的意圖語義是物件身份：一個物件應該等於它自身。這是從 Object 類繼承的行為。如果您需要重寫從不同超類繼承的 equals，可以使用：public boolean equals(Object o) { return this == o; }"
        },
        "HSC_HUGE_SHARED_STRING_CONSTANT": {
            "ShortDescription": "巨大的字串常數在多個類檔案中重複",
            "LongDescription": "{1} 被初始化為一個 {2} 字符長的字串常數，該常數在 {3} 個其他類檔案中重複",
            "Details": "一個大的字串常數在多個類檔案中重複。這可能是因為一個 final 欄位被初始化為一個字串常數，而 Java 語言要求來自其他類對 final 欄位的所有引用都必須內聯到該類檔案中。請參見 <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6447475\">JDK bug 6447475</a>，其中描述了在 JDK 中發生此 bug 的情況及如何解決它以減少 JDK 的大小 1 MB。"
        },
        "NP_ARGUMENT_MIGHT_BE_NULL": {
            "ShortDescription": "方法未檢查 null 參數",
            "LongDescription": "{1} 未檢查 null 參數",
            "Details": "這個方法的一個參數已被識別為一個應該始終檢查是否為 null 的值，但它在解引用之前沒有進行 null 檢查。"
        },
        "NP_EQUALS_SHOULD_HANDLE_NULL_ARGUMENT": {
            "ShortDescription": "equals() 方法未檢查 null 參數",
            "LongDescription": "{1} 未檢查 null 參數",
            "Details": "這個 equals(Object) 的實現違反了 java.lang.Object.equals() 定義的合同，因為它沒有檢查是否傳入了一個 null 作為參數。所有的 equals() 方法在接收到 null 值時都應返回 false。"
        },
        "RV_NEGATING_RESULT_OF_COMPARETO": {
            "ShortDescription": "對 compareTo()/compare() 返回值進行取反",
            "LongDescription": "{1} 取反了 {2} 的返回值",
            "Details": "這段代碼對 compareTo 或 compare 方法的返回值進行了取反。這是一種可疑或不好的編程實踐，因為如果返回值是 Integer.MIN_VALUE，取反返回值不會改變結果的符號。您可以通過反轉操作數的順序而不是取反結果來實現相同的意圖。"
        },
        "CO_COMPARETO_RESULTS_MIN_VALUE": {
            "ShortDescription": "compareTo()/compare() 返回 Integer.MIN_VALUE",
            "LongDescription": "{1} 返回 Integer.MIN_VALUE，不能被取反",
            "Details": "在某些情況下，這個 compareTo 或 compare 方法返回常量 Integer.MIN_VALUE，這是一種非常糟糕的實踐。compareTo 的返回值唯一重要的是結果的符號。但是人們有時會取反 compareTo 的返回值，希望這會反轉結果的符號。並且，除了當返回的值是 Integer.MIN_VALUE 時，它會這樣做。因此，返回 -1 而不是 Integer.MIN_VALUE。"
        },
        "CO_COMPARETO_INCORRECT_FLOATING": {
            "ShortDescription": "compareTo()/compare() 錯誤處理浮點值",
            "LongDescription": "{1} 錯誤處理 {2} 值",
            "Details": "這個方法使用這樣的模式比較 double 或 float 值：val1 > val2 ? 1 : val1 < val2 ? -1 : 0。這種模式在處理 -0.0 和 NaN 值時可能會出現錯誤的排序結果或損壞的集合（如果比較的值被用作鍵）。考慮使用 Double.compare 或 Float.compare 靜態方法，這些方法能夠正確處理所有特殊情況。"
        },
        "CO_SELF_NO_OBJECT": {
            "ShortDescription": "定義了協變的 compareTo() 方法",
            "LongDescription": "{0} 定義了 compareTo({0.givenClass}) 方法，但未定義 compareTo(Object)",
            "Details": "該類定義了一個協變版本的。&nbsp; 要正確地重寫接口中的方法，參數必須具有類型 Object。"
        },
        "HE_SIGNATURE_DECLARES_HASHING_OF_UNHASHABLE_CLASS": {
            "ShortDescription": "簽名聲明在哈希構造中使用不可哈希類",
            "LongDescription": "{2} 未定義 hashCode() 方法，但在 {1} 的哈希上下文中使用",
            "Details": "一個方法、欄位或類聲明了一個通用簽名，其中一個不可哈希類用於需要哈希類的上下文中。聲明了 equals 方法但繼承了來自 Object 的 hashCode() 方法的類是不可哈希的，因為它不能滿足相等物件具有相等哈希碼的要求。"
        },
        "HE_USE_OF_UNHASHABLE_CLASS": {
            "ShortDescription": "在哈希資料結構中使用沒有 hashCode() 方法的類",
            "LongDescription": "{2} 未定義 hashCode() 方法，但在 {1} 的哈希資料結構中使用",
            "Details": "一個類定義了 equals(Object) 方法，但未定義 hashCode() 方法，因此不能滿足相等物件具有相等哈希碼的要求。該類的一個實例被用在哈希資料結構中，因此解決這個問題的必要性非常重要。"
        },
        "HE_HASHCODE_USE_OBJECT_EQUALS": {
            "ShortDescription": "類定義 hashCode() 並使用 Object.equals()",
            "LongDescription": "{0} 定義 hashCode 並使用 Object.equals()",
            "Details": "該類定義了一個 hashCode 方法，但從 Object 繼承了 equals 方法（該方法通過比較物件引用定義相等性）。&nbsp; 雖然這可能滿足相等物件必須具有相等哈希碼的合同，但很可能這並不是覆寫 hashCode 方法時的意圖。&nbsp; （重寫 hashCode 意味著物件的身份基於比簡單引用相等更複雜的標準。）如果您認為該類的實例不會被插入到 HashMap/HashTable 中，建議的實現是：public int hashCode() { assert false : \"hashCode not designed\"; return 42; // 任何任意常量都可以。 }"
        },
        "EQ_COMPARETO_USE_OBJECT_EQUALS": {
            "ShortDescription": "類定義 compareTo(...) 並使用 Object.equals()",
            "LongDescription": "{0} 定義 {1.givenClass} 並使用 Object.equals()",
            "Details": "該類定義了一個 compareTo 方法，但從 Object 繼承了 equals 方法。通常，compareTo 的值應當在且僅在 equals 返回 true 時返回零。如果違反了這一點，則在 PriorityQueue 等類中將會發生奇怪和不可預知的故障。在 Java 5 中，PriorityQueue.remove 方法使用 compareTo 方法，而在 Java 6 中使用 equals 方法。從 Comparable 接口中的 compareTo 方法的 JavaDoc：\n\n強烈建議，但不是嚴格要求的是 (x.compareTo(y)==0) == (x.equals(y))。\n一般來說，任何實現 Comparable 接口並違反此條件的類應明確指出此事實。推薦的表述是“注意：此類的自然排序與 equals 不一致。”"
        },
        "HE_HASHCODE_NO_EQUALS": {
            "ShortDescription": "類定義 hashCode() 但未定義 equals()",
            "LongDescription": "{0} 定義 hashCode 但未定義 equals",
            "Details": "該類定義了一個 hashCode 方法，但未定義 equals 方法。&nbsp; 因此，該類可能違反相等物件必須具有相等哈希碼的恆等性。"
        },
        "HE_EQUALS_USE_HASHCODE": {
            "ShortDescription": "類定義 equals() 並使用 Object.hashCode()",
            "LongDescription": "{0} 定義 equals 並使用 Object.hashCode()",
            "Details": "該類重寫了 equals，但未重寫 hashCode，並且從 Object 繼承了 hashCode 的實現（它返回身份哈希碼，這是由 VM 分配給物件的任意值）。&nbsp; 因此，該類很可能違反相等物件必須具有相等哈希碼的恆等性。如果您認為該類的實例不會被插入到 HashMap/HashTable 中，建議的實現是：public int hashCode() { assert false : \"hashCode not designed\"; return 42; // 任何任意常量都可以。 }"
        },
        "HE_INHERITS_EQUALS_USE_HASHCODE": {
            "ShortDescription": "類繼承 equals() 並使用 Object.hashCode()",
            "LongDescription": "{0} 繼承 equals 並使用 Object.hashCode()",
            "Details": "該類繼承自一個抽象超類，並從 Object 繼承 hashCode（它返回身份哈希碼，這是由 VM 分配給物件的任意值）。&nbsp; 因此，該類很可能違反相等物件必須具有相等哈希碼的恆等性。如果您不想定義 hashCode 方法，或者不相信該物件將來會放入 HashMap/Hashtable，定義 hashCode 方法時拋出異常。"
        },
        "HE_EQUALS_NO_HASHCODE": {
            "ShortDescription": "類定義 equals() 但未定義 hashCode()",
            "LongDescription": "{0} 定義 equals 但未定義 hashCode",
            "Details": "該類重寫了 equals，但未重寫 hashCode。&nbsp; 因此，該類可能違反相等物件必須具有相等哈希碼的恆等性。"
        },
        "EQ_ABSTRACT_SELF": {
            "ShortDescription": "抽象類定義協變的 equals() 方法",
            "LongDescription": "抽象類 {0} 定義 equals({0.givenClass}) 方法",
            "Details": "該類定義了一個協變版本的。&nbsp; 要正確重寫接口中的方法，參數必須具有類型 Object。"
        },
        "ES_COMPARING_STRINGS_WITH_EQ": {
            "ShortDescription": "使用 == 或 != 比較字串物件",
            "LongDescription": "在 {1} 中使用 == 或 != 比較字串物件",
            "Details": "這段代碼使用 == 或 != 操作符比較物件引用的相等性。除非兩個字串都是源檔案中的常量，或者已經通過 intern() 方法進行過處理，否則相同字串值可能由兩個不同的 String 物件表示。考慮換用 equals() 方法。"
        },
        "ES_COMPARING_PARAMETER_STRING_WITH_EQ": {
            "ShortDescription": "使用 == 或 != 比較字串參數",
            "LongDescription": "在 {1} 中使用 == 或 != 比較字串參數",
            "Details": "這段代碼使用 == 或 != 操作符比較參數的引用相等性。要求調用者僅將字串常量或已處理的字串傳遞給方法是不必要的脆弱，並且很少帶來可衡量的性能提升。考慮換用 equals() 方法。"
        },
        "CO_ABSTRACT_SELF": {
            "ShortDescription": "抽象類定義協變的 compareTo() 方法",
            "LongDescription": "抽象類 {0} 定義 compareTo({0.givenClass}) 方法",
            "Details": "該類定義了一個協變版本的。&nbsp; 要正確重寫接口中的方法，參數必須具有類型 Object。"
        },
        "IS_FIELD_NOT_GUARDED": {
            "ShortDescription": "欄位未保護以防止並發訪問",
            "LongDescription": "{1.givenClass} 未保護以防止並發訪問；鎖定了 {2}% 的時間",
            "Details": "該欄位已被註釋為 net.jcip.annotations.GuardedBy 或 javax.annotation.concurrent.GuardedBy，但可以以看起來違反這些註釋的方式進行訪問。"
        },
        "MSF_MUTABLE_SERVLET_FIELD": {
            "ShortDescription": "可變的 servlet 欄位",
            "LongDescription": "{1} 是一個可變的 servlet 欄位",
            "Details": "Web 伺服器通常只創建 servlet 或 JSP 類的一個實例（即將該類視為單例），並會讓多個線程在該實例上調用方法以處理多個同時請求。因此，擁有一個可變實例欄位通常會導致競態條件。"
        },
        "IS2_INCONSISTENT_SYNC": {
            "ShortDescription": "不一致的同步",
            "LongDescription": "{1} 的不一致同步；鎖定了 {2}% 的時間",
            "Details": "該類的欄位似乎在同步方面的訪問不一致。&nbsp; 這個 bug 報告表明 bug 模式探測器判斷該類包含混合的鎖定與未鎖定的訪問，且該類被註釋為 javax.annotation.concurrent.NotThreadSafe，至少一個鎖定訪問由該類自己的方法執行，並且未同步的欄位訪問（讀取和寫入）數量不超過所有訪問的三分之一，且寫入的權重是讀取的兩倍。匹配這個 bug 模式的典型 bug 是忘記同步在一個被設計為線程安全的類中的一個方法。您可以選擇標記為“未同步訪問”的節點，以顯示檢測器認為欄位在沒有同步的情況下被訪問的代碼位置。請注意，該檢測器存在各種不準確來源；例如，它無法靜態檢測持有鎖的所有情況。&nbsp; 此外，即使檢測器在區分鎖定與未鎖定訪問時準確，該代碼依然可能是正確的。"
        },
        "NN_NAKED_NOTIFY": {
            "ShortDescription": "裸通知",
            "LongDescription": "在 {1} 中裸通知",
            "Details": "對 notify() 或 notifyAll() 的調用在沒有任何（明顯的）伴隨可變物件狀態的修改下進行。&nbsp; 通常，在監視器上調用通知方法是因為某個條件已變為真，另一個線程正在等待。不過，為了使該條件有意義，它必須涉及一個顯而易見的物件，且該物件在兩個線程之間是可見的。此錯誤不一定表示出錯，因為對可變物件狀態的更改可能發生在一個方法中，隨後調用了包含通知的方法。"
        },
        "MS_EXPOSE_REP": {
            "ShortDescription": "公共靜態方法可能通過返回可變物件或數組暴露內部表示",
            "LongDescription": "公共靜態 {1} 可能通過返回 {2.givenClass} 來暴露內部表示",
            "Details": "一個公共靜態方法返回對一個可變物件或一個數組的引用，而這個物件或數組是類靜態狀態的一部分。任何調用此方法的代碼可以自由修改底層數組。解決方案之一是返回數組的副本。"
        },
        "EI_EXPOSE_REP": {
            "ShortDescription": "可能通過返回對可變物件的引用暴露內部表示",
            "LongDescription": "{1} 可能通過返回 {2.givenClass} 來暴露內部表示",
            "Details": "返回存儲在物件欄位中的可變物件值的引用會暴露物件的內部表示。&nbsp; 如果實例被不信任的代碼訪問，並且對可變物件的未檢查更改可能會危及安全或其他重要屬性，則需要更改處理。返回物件的新副本在許多情況下是更好的方法。"
        },
        "EI_EXPOSE_REP2": {
            "ShortDescription": "可能通過存儲外部可變物件的引用暴露內部表示",
            "LongDescription": "{1} 可能通過將外部可變物件存儲到 {2.givenClass} 中暴露內部表示",
            "Details": "這段代碼將對外部可變物件的引用存儲到物件的內部表示中。&nbsp; 如果實例被不信任的代碼訪問，並且對可變物件的未檢查更改可能會危及安全或其他重要屬性，則需要更改處理。在許多情況下，存儲物件的副本是更好的方法。"
        },
        "EI_EXPOSE_STATIC_REP2": {
            "ShortDescription": "可能通過將可變物件存儲到靜態欄位中暴露內部靜態狀態",
            "LongDescription": "{1} 可能通過將可變物件存儲到靜態欄位 {2} 中暴露內部靜態狀態",
            "Details": "這段代碼將對外部可變物件的引用存儲到靜態欄位中。如果對可變物件的未檢查更改可能會危及安全或其他重要屬性，則需要更改處理。在許多情況下，存儲物件的副本是更好的方法。"
        },
        "MS_EXPOSE_BUF": {
            "ShortDescription": "可能通過返回一個共享非公共資料的緩衝區暴露內部表示",
            "LongDescription": "{1} 可能通過返回 {2.givenClass} 來暴露內部表示",
            "Details": "一個公共靜態方法返回一個緩衝區（java.nio.*Buffer），該緩衝區包裝一個作為類靜態狀態的一部分的數組，或者返回一個淺拷貝的緩衝區，該緩衝區是類的靜態狀態的一部分，並與原始緩衝區共享引用。任何調用此方法的代碼可以自由修改底層數組。解決方案之一是返回一個只讀緩衝區或一個包含數組副本的新緩衝區。"
        },
        "EI_EXPOSE_BUF": {
            "ShortDescription": "可能通過返回共享非公共資料的緩衝區暴露內部表示",
            "LongDescription": "{1} 可能通過返回 {2.givenClass} 來暴露內部表示",
            "Details": "返回一個緩衝區（java.nio.*Buffer）的引用，該緩衝區包裝一個存儲在物件欄位之一中的數組，這會暴露數組元素的內部表示，因為緩衝區僅存儲對數組的引用，而不是複製其內容。同樣，返回這樣的緩衝區的淺拷貝（使用其 duplicate() 方法）存儲在物件欄位之一中也會暴露緩衝區的內部表示。如果實例被不信任的代碼訪問，並且對數組的未檢查更改可能會危及安全或其他重要屬性，則需要更改處理。在許多情況下，返回只讀緩衝區（使用其 asReadOnly() 方法）或將數組複製到新緩衝區（使用其 put() 方法）是更好的方法。"
        },
        "EI_EXPOSE_BUF2": {
            "ShortDescription": "可能通過創建包含對數組的引用的緩衝區暴露內部表示",
            "LongDescription": "{1} 可能通過創建一個包含外部數組 {2.givenClass} 的緩衝區暴露內部表示",
            "Details": "這段代碼創建了一個緩衝區，該緩衝區存儲對外部數組或外部緩衝區的數組的引用到物件的內部表示中。&nbsp; 如果實例被不信任的代碼訪問，並且對數組的未檢查更改可能會危及安全或其他重要屬性，則需要更改處理。在許多情況下，存儲數組的副本是一個較好的方法。"
        },
        "EI_EXPOSE_STATIC_BUF2": {
            "ShortDescription": "可能通過創建一個將外部數組存儲到靜態欄位中的緩衝區暴露內部靜態狀態",
            "LongDescription": "{1} 可能通過創建一個將外部數組存儲到靜態欄位 {2} 中的緩衝區暴露內部靜態狀態",
            "Details": "這段代碼創建了一個緩衝區，該緩衝區存儲對外部數組或外部緩衝區的數組的引用到靜態欄位中。如果對數組的未檢查更改可能會危及安全或其他重要屬性，則需要更改處理。在許多情況下，存儲數組的副本是一個較好的方法。"
        },
        "RU_INVOKE_RUN": {
            "ShortDescription": "在一個線程上調用 run（您是想啟動它而不是調用它嗎？）",
            "LongDescription": "{1} 顯式調用一個線程的 run 方法（您是想啟動它而不是調用它嗎？）",
            "Details": "該方法顯式調用了一个物件的 run 方法。&nbsp; 通常，類實現 Runnable 接口是因為它們將會在一個新線程中調用其 run 方法，在這種情況下，應該調用 start 方法。"
        },
        "SP_SPIN_ON_FIELD": {
            "ShortDescription": "方法在欄位上自旋",
            "LongDescription": "在 {1} 中自旋 {2.givenClass}",
            "Details": "該方法在一個讀取欄位的循環中自旋。&nbsp; 編譯器可以合法地將讀取提升到循環之外，從而將代碼轉變為無限循環。&nbsp; 類應該更改為使用正確的同步（包括 wait 和 notify 調用）。"
        },
        "NS_DANGEROUS_NON_SHORT_CIRCUIT": {
            "ShortDescription": "潛在危險使用非短路邏輯",
            "LongDescription": "在 {1} 中潛在危險使用非短路邏輯",
            "Details": "這段代碼似乎在使用非短路邏輯（例如，&amp;\n或 |）而不是短路邏輯（&& 或 ||）。此外，取決於左邊的值，您可能並不希望評估右邊的表達式（因為它會產生副作用、可能引發異常或可能開銷較大）。\n非短路邏輯會使得即使結果可以從已知左側得到，也會評估表達式的兩側。這可能效率低下，如果左側控制了在評估右側時可能產生的錯誤，可能導致錯誤。\n請參見 <a href=\"https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.22.2\">Java 語言規範</a> 獲取詳細信息。"
        },
        "NS_NON_SHORT_CIRCUIT": {
            "ShortDescription": "可疑的非短路邏輯使用",
            "LongDescription": "在 {1} 中可疑的非短路邏輯使用",
            "Details": "這段代碼似乎在使用非短路邏輯（例如，&amp;\n或 |）而不是短路邏輯（&& 或 ||）。\n非短路邏輯導致即使結果可以從已知左側推斷出來，表達式的兩側也會被評估。這可能效率低下，並且如果左邊的表達式導致評估右邊時可能發生錯誤，則可能導致錯誤。\n\n請參見 <a href=\"https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.22.2\">Java 語言規範</a> 獲取詳細信息。"
        },
        "TLW_TWO_LOCK_WAIT": {
            "ShortDescription": "持有兩個鎖時等待",
            "LongDescription": "在 {1} 中持有兩個鎖時調用 wait()",
            "Details": "在持有兩個鎖的情況下等待一個監視器可能導致死鎖。執行 wait 僅會釋放正在等待的物件上的鎖，而不會釋放任何其他鎖。這不一定是一個 bug，但值得仔細檢查。"
        },
        "TLW_TWO_LOCK_NOTIFY": {
            "deprecated": "true",
            "ShortDescription": "持有兩個鎖時通知",
            "LongDescription": "在 {1} 中持有兩個鎖時調用 notify() 或 notifyAll()",
            "Details": "代碼在持有兩個鎖的情況下調用 notify() 或 notifyAll()。如果此通知意圖喚醒一個持有相同鎖的 wait()，則可能發生死鎖，因為 wait 僅會放弃一個鎖，而 notify 將無法獲得兩個鎖，因此 notify 將無法成功。如果還有一個關於兩個鎖等待的警告，bug 的可能性就很高。"
        },
        "UW_UNCOND_WAIT": {
            "ShortDescription": "無條件等待",
            "LongDescription": "在 {1} 中進行無條件等待",
            "Details": "該方法包含對 wait() 的調用，但沒有受條件控制流保護。代碼應該在調用 wait 之前驗證它 intended 等待的條件是否已經滿足；任何先前的通知將被忽略。"
        },
        "UR_UNINIT_READ": {
            "ShortDescription": "構造函數中的未初始化欄位讀取",
            "LongDescription": "在 {1} 中未初始化的 {2.name} 讀取",
            "Details": "該構造函數讀取一個尚未分配值的欄位。&nbsp; 這通常是因為程式設計師錯誤地使用了該欄位，而不是構造函數的參數之一。"
        },
        "UR_UNINIT_READ_CALLED_FROM_SUPER_CONSTRUCTOR": {
            "ShortDescription": "從超類構造函數調用未初始化欄位方法",
            "LongDescription": "{1} 中的 {2.name} 在從超類構造函數調用時未被初始化",
            "Details": "該方法在超類的構造函數中被調用。在這一點上，類的欄位尚未初始化。為使之更為具體，考慮以下類：abstract class A { int hashCode; abstract Object getValue(); A() { hashCode = getValue().hashCode(); } } class B extends A { Object value; B(Object v) { this.value = v; } Object getValue() { return value; } } 當 A 被構造時，父類的構造函數被調用，子類的構造函數也被調用。因此，當子類的構造函數調用時，會讀取一個未初始化的值為 hashCode。"
        },
        "UG_SYNC_SET_UNSYNC_GET": {
            "ShortDescription": "未同步的獲取方法，已同步的設置方法",
            "LongDescription": "{1} 是未同步的，{2} 是同步的",
            "Details": "該類包含命名相似的獲取和設置方法，其中設置方法是同步的，而獲取方法不是。&nbsp; 這可能導致運行時的不正確行為，因為獲取方法的調用者不一定會看到物件的一致狀態。&nbsp; 獲取方法應該是同步的。"
        },
        "IC_INIT_CIRCULARITY": {
            "ShortDescription": "初始化循環性",
            "LongDescription": "在 {0} 和 {1} 之間存在初始化循環性",
            "Details": "檢測到兩個類的靜態初始化器之間存在循環性。&nbsp; 這種循環性可能導致許多意想不到的行為。"
        },
        "IC_SUPERCLASS_USES_SUBCLASS_DURING_INITIALIZATION": {
            "ShortDescription": "超類在初始化期間使用子類",
            "LongDescription": "{0} 的初始化訪問了尚未初始化的類 {2}",
            "Details": "在一個類的初始化過程中，該類主動使用一個子類。該子類在此使用時尚未被初始化。例如，在以下代碼中，InnerClassSingleton 將為 null。public class CircularClassInitialization { static class InnerClassSingleton extends CircularClassInitialization { static InnerClassSingleton singleton = new InnerClassSingleton(); } static CircularClassInitialization foo = InnerClassSingleton.singleton; }"
        },
        "IT_NO_SUCH_ELEMENT": {
            "ShortDescription": "Iterator next() 方法不能拋出 NoSuchElementException",
            "LongDescription": "{1} 不能拋出 NoSuchElementException",
            "Details": "該類實現了 Iterable 接口。&nbsp; 然而，其 next() 方法無法拋出 NoSuchElementException。&nbsp; 該方法應該更改為在沒有更多元素返回時拋出該異常。"
        },
        "DL_SYNCHRONIZATION_ON_SHARED_CONSTANT": {
            "ShortDescription": "在字串字面量上進行同步",
            "LongDescription": "在 {1} 中對字串字面量進行同步",
            "Details": "該代碼在字串字面量上進行同步。private static String LOCK = \"LOCK\";\n...\nsynchronized (LOCK) { ... }\n...\n常量字串是被內聯的，並在 JVM 加載的所有其他類中共享。因此，這段代碼鎖定了其他代碼可能也在鎖定的內容。這可能導致非常奇怪和難以診斷的阻塞和死鎖行為。請參見 <a href=\"http://www.javalobby.org/java/forums/t96352.html\">http://www.javalobby.org/java/forums/t96352.html</a> 和 <a href=\"http://jira.codehaus.org/browse/JETTY-352\">http://jira.codehaus.org/browse/JETTY-352</a>。有關更多信息，請參見 CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reused</a>。"
        },
        "DL_SYNCHRONIZATION_ON_INTERNED_STRING": {
            "ShortDescription": "在已內聯字串上進行同步",
            "LongDescription": "在 {1} 中對已內聯字串進行同步",
            "Details": "該代碼在已內聯字串上進行同步。private static String LOCK = new String(\"LOCK\").intern();\n...\nsynchronized (LOCK) { ... }\n...\n常量字串是被內聯的，並在 JVM 加載的所有其他類中共享。因此，這段代碼鎖定了其他代碼可能也在鎖定的內容。這可能導致非常奇怪和難以診斷的阻塞和死鎖行為。請參見 <a href=\"http://www.javalobby.org/java/forums/t96352.html\">http://www.javalobby.org/java/forums/t96352.html</a> 和 <a href=\"http://jira.codehaus.org/browse/JETTY-352\">http://jira.codehaus.org/browse/JETTY-352</a>。有關更多信息，請參見 CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reused</a>。"
        },
        "DL_SYNCHRONIZATION_ON_BOOLEAN": {
            "ShortDescription": "在布林值上進行同步",
            "LongDescription": "在 {1} 中對布林值進行同步",
            "Details": "該代碼在一個裝箱的原始欄位常量上進行同步，例如布林值。private static Boolean inited = Boolean.FALSE;\n...\nsynchronized (inited) { if (!inited) { init(); inited = Boolean.TRUE; } }\n...\n因為通常只有兩個布林物件，所以這段代碼可能會與其他無關代碼在同一物件上同步，從而導致無響應和潛在的死鎖。"
        },
        "DL_SYNCHRONIZATION_ON_UNSHARED_BOXED_PRIMITIVE": {
            "ShortDescription": "在裝箱的原始值上進行同步",
            "LongDescription": "在 {1} 中對裝箱的原始值進行同步",
            "Details": "該代碼在一個看似未共享的裝箱原始值上進行同步，例如整數。private static final Integer fileLock = new Integer(1);\n...\nsynchronized (fileLock) { .. do something .. }\n...\n在這段代碼中，fileLock 被重新聲明為：private static final Object fileLock = new Object();\n\n現有的代碼可能是沒問題的，但這會引起混淆，未來的重構（如 IntelliJ 的“移除裝箱”重構）可能會將其替換為通過 JVM 共享的內聯整數物件，從而導致非常混亂的行為和潛在的死鎖。"
        },
        "DL_SYNCHRONIZATION_ON_BOXED_PRIMITIVE": {
            "ShortDescription": "在裝箱原始值上進行同步",
            "LongDescription": "在 {1} 中對 {2} 進行同步",
            "Details": "該代碼在裝箱的原始常量上進行同步，例如整數。private static Integer count = 0;\n...\nsynchronized (count) { count++; }\n...\n因為整數物件可能被緩存並共享，這段代碼可能和其他無關代碼在同一物件上同步，從而導致無響應和潛在的死鎖。"
        },
        "ESync_EMPTY_SYNC": {
            "ShortDescription": "空同步區塊",
            "LongDescription": "在 {1} 中存在空同步區塊",
            "Details": "該代碼包含一個空的同步區塊：synchronized() {\n}\n空同步區塊比大多數人認識到的更加微妙且難以正確使用，並且空同步區塊幾乎從未比其他較少人為的解決方案好。"
        },
        "IS_INCONSISTENT_SYNC": {
            "ShortDescription": "不一致的同步",
            "LongDescription": "不一致的同步 {1}；鎖定時間的 {2}%",
            "Details": "該類的欄位在同步方面似乎被不一致地訪問。&nbsp; 該 bug 報告表明，bug 模式探測器判斷該類包含混合的鎖定和未鎖定訪問，至少一個鎖定訪問由該類自己的方法執行，並且未同步的欄位訪問（讀取和寫入）的數量不超過所有訪問的三分之一，寫入權重是讀取的兩倍。匹配這個 bug 模式的典型 bug 是忘記在設計為線程安全的類中的一個方法上進行同步。請注意，該探測器存在各種不準確來源；例如，探測器無法靜態地檢測持有鎖的所有情況。&nbsp; 此外，即使探測器能準確地區分鎖定與未鎖定訪問，相關代碼仍然可能是正確的。"
        },
        "ML_SYNC_ON_FIELD_TO_GUARD_CHANGING_THAT_FIELD": {
            "ShortDescription": "在欄位上進行同步來無效地嘗試保護該欄位",
            "LongDescription": "在 {2.givenClass} 上進行同步以無效地保護它",
            "Details": "該方法對一個欄位進行同步，似乎試圖保護該欄位免受並發更新。但是，保護欄位會在引用物件上獲取鎖，而不是在欄位上。這可能無法提供所需的互斥訪問，其他線程可能在引用物件上獲取鎖（出於其他目的）。這種模式的示例是：private Long myNtfSeqNbrCounter = new Long(0);\nprivate Long getNotificationSequenceNumber() { Long result = null; synchronized(myNtfSeqNbrCounter) { result = new Long(myNtfSeqNbrCounter.longValue() + 1); myNtfSeqNbrCounter = new Long(result.longValue()); } return result;\n}"
        },
        "ML_SYNC_ON_UPDATED_FIELD": {
            "ShortDescription": "方法在已更新的欄位上進行同步",
            "LongDescription": "{1} 在已更新欄位 {2.givenClass} 上進行同步",
            "Details": "該方法在從可變欄位引用的物件上進行同步。這不太可能具有有用的語義，因為不同線程可能在不同物件上同步。"
        },
        "MS_OOI_PKGPROTECT": {
            "ShortDescription": "欄位應移出接口並設置為包保護",
            "LongDescription": "{1} 應移出接口並設置為包保護",
            "Details": "一個在接口中定義的最終靜態欄位引用了一個可變物件，例如數組或哈希表。這個可變物件可能會被惡意代碼或意外地從其他包中更改。為了解決這個問題，該欄位需要移動到一個類中並設置為包保護，以避免這種漏洞。"
        },
        "MS_FINAL_PKGPROTECT": {
            "ShortDescription": "欄位應該是最終的並且包保護",
            "LongDescription": "{1} 應該同時是最終的並且包保護",
            "Details": "一個可變靜態欄位可能會被惡意代碼或意外地從其他包中更改。該欄位可以被設置為包保護和/或最終，以避免這種漏洞。"
        },
        "MS_SHOULD_BE_REFACTORED_TO_BE_FINAL": {
            "ShortDescription": "欄位不是最終的，但應該重構為最終的",
            "LongDescription": "{1} 不是最終的，但應該重構為最終的",
            "Details": "\n這個 public static 或 protected static 欄位不是最終的，可能會被惡意代碼或\n意外地從其他包中更改。\n該欄位可以被設置為最終以避免\n這種漏洞。然而，靜態初始化器包含多個寫操作，因此需要一些重構來實現這一點。\n"
        },
        "MS_SHOULD_BE_FINAL": {
            "ShortDescription": "欄位不是最終的，但應該是最終的",
            "LongDescription": "{1} 不是最終的，但應該是最終的",
            "Details": "\n這個 public static 或 protected static 欄位不是最終的，可能會被惡意代碼或從其他包中意外更改。該欄位可以被設置為最終以避免這種漏洞。"
        },
        "MS_PKGPROTECT": {
            "ShortDescription": "欄位應該是包保護的",
            "LongDescription": "{1} 應該是包保護的",
            "Details": "一個可變靜態欄位可能會被惡意代碼或意外地更改。該欄位可以被設置為包保護以避免這種漏洞。"
        },
        "MS_MUTABLE_HASHTABLE": {
            "ShortDescription": "欄位是一個可變的 Hashtable",
            "LongDescription": "{1} 是一個可變的 Hashtable",
            "Details": "一個最終靜態欄位引用一個 Hashtable，可以被惡意代碼或意外地從其他包中訪問。這段代碼可以自由修改 Hashtable 的內容。"
        },
        "MS_MUTABLE_COLLECTION": {
            "ShortDescription": "欄位是一個可變的集合",
            "LongDescription": "{1} 是一個可變的集合",
            "Details": "一個可變的集合實例被賦值給一個最終靜態欄位，因此可以被惡意代碼或意外地從其他包中更改。考慮將該欄位封裝在 Collections.unmodifiableSet/List/Map 等中，以避免這種漏洞。"
        },
        "MS_MUTABLE_COLLECTION_PKGPROTECT": {
            "ShortDescription": "欄位是一個可變的集合，應該是包保護的",
            "LongDescription": "{1} 是一個可變的集合，應該是包保護的",
            "Details": "一個可變的集合實例被賦值給一個最終靜態欄位，因此可以被惡意代碼或意外地從其他包中更改。該欄位可以被設置為包保護以避免此漏洞。或者您可以將該欄位封裝在 Collections.unmodifiableSet/List/Map 等中，以避免這種漏洞。"
        },
        "MS_MUTABLE_ARRAY": {
            "ShortDescription": "欄位是一個可變數組",
            "LongDescription": "{1} 是一個可變數組",
            "Details": "一個最終靜態欄位引用一個數組，可以被惡意代碼或意外地從其他包中訪問。這段代碼可以自由修改數組的內容。"
        },
        "MS_CANNOT_BE_FINAL": {
            "ShortDescription": "欄位不是最終的，無法保護免受惡意代碼的影響",
            "LongDescription": "{1} 不是最終的，無法保護免受惡意代碼的影響",
            "Details": "一個可變的靜態欄位可能被惡意代碼或意外地從另一個包中更改。不幸的是，該欄位的使用方式不允許對這個問題進行任何簡單的修復。"
        },
        "ME_MUTABLE_ENUM_FIELD": {
            "ShortDescription": "枚舉欄位是公共且可變的",
            "LongDescription": "{1} 欄位是公共且可變的",
            "Details": "一個可變的公共欄位在公共枚舉內部定義，因此可以被惡意代碼或意外地從其他包中更改。儘管可變的枚舉欄位可用於惰性初始化，但將它們暴露給外部世界是個壞習慣。考慮將該欄位聲明為 final 和 / 或包私有。"
        },
        "ME_ENUM_FIELD_SETTER": {
            "ShortDescription": "公共枚舉方法無條件設置其欄位",
            "LongDescription": "{1} 無條件設置欄位 {2.name}",
            "Details": "該公共方法在公共枚舉中無條件設置枚舉欄位，因此該欄位可能會被惡意代碼或意外地從其他包中更改。儘管可變的枚舉欄位可用於惰性初始化，但將它們暴露給外部世界是個壞習慣。考慮刪除此方法或將其聲明為包私有。"
        },
        "IA_AMBIGUOUS_INVOCATION_OF_INHERITED_OR_OUTER_METHOD": {
            "ShortDescription": "潛在模糊調用繼承或外部方法",
            "LongDescription": "在 {1} 中可能模糊調用繼承或外部方法 {2}",
            "Details": "\n內部類正在調用一個可以解析為繼承方法或外部類中定義的方法。\n例如，你調用一個在超類和外部方法中都定義的方法。\n根據 Java 語義，\n它將被解析為調用繼承的方法，但這可能不是你所期望的。\n如果你真的打算調用繼承的方法，\n可以通過在 super 上調用該方法來做到這一點（例如，invoke super.foo(17)），這樣會對您的代碼的其他讀者和 SpotBugs 明確表示您想調用繼承的方法，而不是外部類中的方法。\n如果調用了承外部方法，則將調用繼承的方法。但是，由於 SpotBugs 僅查看類文件，\n它無法區分對超類和外部方法的調用，它仍然會抱怨潛在的模糊調用。\n"
        },
        "NM_SAME_SIMPLE_NAME_AS_SUPERCLASS": {
            "ShortDescription": "類名不應掩蓋超類的簡單名稱",
            "LongDescription": "類名 {0} 遮蔽了超類 {1} 的簡單名稱",
            "Details": "該類具有一個簡單名稱，與其超類的名稱相同，除了其超類位於不同的包中（例如 extends）。\n這可能會導致極大的困惑，產生大量必須查看 import 語句以解析引用的情況，並可能在錯誤地定義不覆蓋其超類中的方法的機會。"
        },
        "NM_SAME_SIMPLE_NAME_AS_INTERFACE": {
            "ShortDescription": "類名不應掩蓋實現接口的簡單名稱",
            "LongDescription": "類名 {0} 遮蔽了實現接口 {1} 的簡單名稱",
            "Details": "該類/接口的簡單名稱與實現/擴展接口的名稱相同，除了該接口位於不同的包中（例如 extends）。\n這可能會導致極大的困惑，產生大量必須查看 import 語句以解析引用的情況，並可能在錯誤地定義不覆蓋其超類中的方法的機會。"
        },
        "NM_CLASS_NAMING_CONVENTION": {
            "ShortDescription": "類名應以大寫字母開頭",
            "LongDescription": "類名 {0} 未以大寫字母開頭",
            "Details": "類名應為名詞，採用混合大小寫，每個內部詞的首字母應大寫。儘量保持類名簡潔且富有描述性。使用完整單詞，避免首字母縮略詞和縮寫（除非縮寫遠比長版常用，例如 URL 或 HTML）。"
        },
        "NM_METHOD_NAMING_CONVENTION": {
            "ShortDescription": "方法名應以小寫字母開頭",
            "LongDescription": "方法名 {1} 未以小寫字母開頭",
            "Details": "\n方法應為動詞，採用混合大小寫，第一个字母小寫，后續內部詞的首字母大寫。\n"
        },
        "NM_FIELD_NAMING_CONVENTION": {
            "ShortDescription": "非最終欄位名應以小寫字母開頭，最終欄位應為全大寫字母並用下劃線分隔",
            "LongDescription": "欄位名 {1} 不符合命名約定。如果是最終的，應為全大寫字母；否則應為駝峰命名。",
            "Details": "\n非最終欄位的名稱應為混合大小寫，首字母小寫，後續詞的首字母大寫。\n最終欄位的名稱應為全大寫字母，單詞之間用下劃線（'_'）分隔。\n"
        },
        "NM_VERY_CONFUSING": {
            "ShortDescription": "非常混淆的方法名",
            "LongDescription": "方法 {1} 和 {3} 非常混淆",
            "Details": "引用的方法名稱僅在大小寫上不同。\n這非常易混淆，因為如果大小寫一致，其中一個方法將覆蓋另一個方法。\n"
        },
        "NM_VERY_CONFUSING_INTENTIONAL": {
            "ShortDescription": "非常混淆的方法名（但可能是有意的）",
            "LongDescription": "方法 {1} 和 {3} 非常混淆（但可能是有意的）",
            "Details": "引用的方法名稱僅在大小寫上不同。\n這非常易混淆，因為如果大小寫一致，其中一個方法將覆蓋另一個方法。根據其他方法的存在，這似乎兩個方法同時存在是 intentional，但確實會導致混淆。\n您應該努力消除其中一個方法，除非您因 API 冷凍而不得不保留兩個。"
        },
        "NM_WRONG_PACKAGE": {
            "ShortDescription": "由於參數錯誤包，方法未能重寫超類中的方法",
            "LongDescription": "{1} 未能重寫超類中的方法，因為參數類型 {4} 不匹配超類參數類型 {5}",
            "Details": "子類中的方法未重寫超類中的類似方法，因為參數類型與超類中相應參數的類型不完全匹配。例如，如果您有：import alpha.Foo;\n\npublic class A { public int f(Foo x) { return 17; }\n}\n----\nimport beta.Foo;\n\npublic class B extends A { public int f(Foo x) { return 42; }\n}\n方法在類 B 中定義，但沒有重寫 A 中定義的方法，因為參數類型來自不同包。"
        },
        "NM_WRONG_PACKAGE_INTENTIONAL": {
            "ShortDescription": "由於參數錯誤包，方法未能重寫超類中的方法",
            "LongDescription": "{1} 未能重寫超類中的方法，因為參數類型 {4} 不匹配超類參數類型 {5}",
            "Details": "子類中的方法未重寫超類中的類似方法，因為參數類型與超類中相應參數的類型不完全匹配。例如，如果您有：import alpha.Foo;\n\npublic class A { public int f(Foo x) { return 17; }\n}\n----\nimport beta.Foo;\n\npublic class B extends A { public int f(Foo x) { return 42; } public int f(alpha.Foo x) { return 27; }\n}\n方法在類 B 中定義，但沒有重寫 A 中定義的方法，因為參數類型來自不同包。在這種情況下，子類確實定義了一個與超類中方法簽名相同的方法，因此這通常是有意的。然而，這樣的方法會導致極大的混淆。您應該強烈考慮刪除或棄用與超類中類似但不相同簽名的方法。"
        },
        "NM_CONFUSING": {
            "ShortDescription": "混淆的方法名",
            "LongDescription": "方法 {1} 和 {3} 混淆",
            "Details": "引用的方法名稱僅在大小寫上不同。"
        },
        "NM_METHOD_CONSTRUCTOR_CONFUSION": {
            "ShortDescription": "明顯的方法/構造函數混淆",
            "LongDescription": "{1} 可能被認為是構造函數",
            "Details": "這個常規方法與其所在類同名。它很可能被認為是構造函數。如果它打算是構造函數，請刪除 void 返回值的聲明。如果您不小心定義了此方法，意識到錯誤，在構造函數中定義了正確的方法，但由於向後兼容性無法刪除此方法，請將此方法棄用。\n"
        },
        "NM_LCASE_HASHCODE": {
            "ShortDescription": "類定義 hashcode(); 應該是 hashCode() 嗎？",
            "LongDescription": "類 {0} 定義了 hashcode(); 應該是 hashCode() 嗎？",
            "Details": "該類定義了一個名為 hashcode() 的方法。&nbsp; 此方法沒有覆寫父類中的方法，可能是期望的行為。"
        },
        "NM_LCASE_TOSTRING": {
            "ShortDescription": "類定義 tostring(); 應該是 toString() 嗎？",
            "LongDescription": "類 {0} 定義了 tostring(); 應該是 toString() 嗎？",
            "Details": "該類定義了一個名為 tostring() 的方法。&nbsp; 此方法沒有覆寫父類中的方法，可能是期望的行為。"
        },
        "NM_BAD_EQUAL": {
            "ShortDescription": "類定義 equal(Object); 應該是 equals(Object) 嗎？",
            "LongDescription": "類 {0} 定義了 equal(Object); 應該是 equals(Object) 嗎？",
            "Details": "該類定義了一個名為 equal(Object) 的方法。&nbsp; 此方法沒有覆寫父類中的方法，可能是期望的行為。"
        },
        "NM_CLASS_NOT_EXCEPTION": {
            "ShortDescription": "類未從異常派生，儘管名稱中包含 ‘Exception’",
            "LongDescription": "類 {0} 並未從異常派生，儘管它的名稱中包含 ‘Exception’",
            "Details": "該類並未從另一個異常派生，但它的名稱以 'Exception' 結尾。這會給使用該類的用戶造成困惑。"
        },
        "RR_NOT_CHECKED": {
            "ShortDescription": "方法忽略了 InputStream.read() 的結果",
            "LongDescription": "{1} 忽略了 {2} 的結果",
            "Details": "該方法忽略了 read() 的一個變種的返回值，它可以返回多個字節。&nbsp; 如果不檢查返回值，調用者將無法正確處理讀取的字節數量少於請求的情況。&nbsp; 這是一種特別隱蔽的 bug，因為在許多程序中，從輸入流的讀取通常會讀取到完整的數據量，導致程序只有在偶然的情況下失敗。"
        },
        "SR_NOT_CHECKED": {
            "ShortDescription": "方法忽略了 InputStream.skip() 的結果",
            "LongDescription": "{1} 忽略了 {2} 的結果",
            "Details": "該方法忽略了 skip() 的返回值，它可以跳過多個字節。&nbsp; 如果不檢查返回值，調用者將無法正確處理跳過的字節數量少於請求的情況。&nbsp; 這是一種特別隱蔽的 bug，因為在許多程序中，從輸入流的跳過通常能跳過請求的數據量，導致程序在偶然情況下失敗。不過在緩衝流的情況下，skip() 只會跳過緩衝區中的數據，通常無法跳過請求的字節數量。"
        },
        "SE_READ_RESOLVE_IS_STATIC": {
            "ShortDescription": "readResolve 方法不能被聲明為靜態方法。",
            "LongDescription": "{1} 應該被聲明為實例方法，而不是靜態方法",
            "Details": "為了使 readResolve 方法被序列化機制識別，必須不將其聲明為靜態方法。"
        },
        "SE_PRIVATE_READ_RESOLVE_NOT_INHERITED": {
            "ShortDescription": "私有 readResolve 方法未被子類繼承",
            "LongDescription": "類 {0} 中的私有 readResolve 方法未被子類繼承。",
            "Details": "該類定義了一個私有的 readResolve 方法。因為它是私有的，所以不會被子類繼承。&nbsp; 這可能是有意的，並且可以接受，但應當進行審查以確保這是期望的行為。"
        },
        "SE_READ_RESOLVE_MUST_RETURN_OBJECT": {
            "ShortDescription": "readResolve 方法必須聲明為返回類型為 Object。",
            "LongDescription": "方法 {1} 必須聲明為返回類型為 Object 而不是 {1.returnType}",
            "Details": "為了使 readResolve 方法被序列化機制識別，必須聲明返回類型為 Object。"
        },
        "SE_TRANSIENT_FIELD_OF_NONSERIALIZABLE_CLASS": {
            "ShortDescription": "不可序列化類的瞬態字段。",
            "LongDescription": "{1.givenClass} 是瞬態的，但 {0} 不是可序列化的",
            "Details": "該字段被標記為瞬態，但類並不是可序列化的，因此將其標記為瞬態完全沒有效果。&nbsp; 這可能是代碼之前版本的遺留標記，當時該類是可序列化的，或者可能表明對序列化原理的誤解。&nbsp; 僅在設置了特定選項時才報告此 bug。"
        },
        "SE_TRANSIENT_FIELD_NOT_RESTORED": {
            "ShortDescription": "瞬態字段未在反序列化時設定。",
            "LongDescription": "字段 {1} 是瞬態的，但未在反序列化時設定",
            "Details": "該類包含一個在類的多個位置更新的字段，因此似乎是類狀態的一部分。但是，由於該字段被標記為瞬態，並且未在 readObject 或 readResolve 中設定，它將在任何反序列化的類實例中包含默認值。"
        },
        "SE_PREVENT_EXT_OBJ_OVERWRITE": {
            "ShortDescription": "防止覆蓋可外部化對象",
            "LongDescription": "任何調用者都可以通過使用 readExternal() 方法重置對象的值。",
            "Details": "該方法必須被聲明為公共的，並且未能保護，以防惡意調用者，因此代碼允許任何調用者隨時重置對象的值。為了防止可外部化對象的覆蓋，您可以使用一個在實例字段填充後設置的布爾標誌。您還可以通過在私有鎖對象上進行同步來防止競態條件。"
        },
        "SE_METHOD_MUST_BE_PRIVATE": {
            "ShortDescription": "方法必須是私有的以使序列化工作",
            "LongDescription": "方法 {1.givenClass} 必須是私有的才能在序列化/反序列化 {0} 時被調用",
            "Details": "該類實現了 Serializable 接口，並定義了一個用於自定義序列化/反序列化的方法。但是由於該方法未聲明為私有，因此將被序列化/反序列化 API 忽略。"
        },
        "SE_NO_SUITABLE_CONSTRUCTOR_FOR_EXTERNALIZATION": {
            "ShortDescription": "類是可外部化的，但未定義無參構造函數",
            "LongDescription": "{0} 是可外部化的，但未定義無參構造函數",
            "Details": "該類實現了 Externalizable 接口，但未定義公共無參構造函數。當可外部化對象被反序列化時，首先需要通過調用公共無參構造函數來構造它。由於該類沒有此構造函數，因此序列化和反序列化將在運行時失敗。"
        },
        "SE_NO_SUITABLE_CONSTRUCTOR": {
            "ShortDescription": "類是可序列化的，但其超類未定義無參構造函數",
            "LongDescription": "{0} 是可序列化的，但其超類未定義可訪問的無參構造函數",
            "Details": "該類實現了 Serializable 接口，並且其超類沒有實現。這樣的對象在反序列化時，超類的字段需要通過調用超類的無參構造函數進行初始化。由於超類沒有此構造函數，序列化和反序列化將在運行時失敗。"
        },
        "SE_NO_SERIALVERSIONID": {
            "ShortDescription": "類是可序列化的，但未定義 serialVersionUID",
            "LongDescription": "{0} 是可序列化的；考慮聲明 serialVersionUID",
            "Details": "該類實現了 Serializable 接口，但未定義 serialVersionUID 字段。&nbsp; 僅添加對 .class 對象的引用的簡單更改將為類添加合成字段，這不幸地將改變隱式的 serialVersionUID（例如，添加對某個對象的引用會生成一個靜態字段）。此外，不同的源代碼到字節碼編譯器可能使用不同的命名約定來生成類對象或內部類引用的合成變量。為了確保跨版本的可序列化性，請考慮添加顯式的 serialVersionUID。"
        },
        "SE_COMPARATOR_SHOULD_BE_SERIALIZABLE": {
            "ShortDescription": "比較器未實現 Serializable",
            "LongDescription": "{0} 實現 Comparator 但未實現 Serializable",
            "Details": "該類實現了 Comparator 接口。您應該考慮它是否也應該實現 Serializable 接口。如果比較器用於構造有序集合，如 PriorityQueue，則只有當比較器也是可序列化時，構建的集合才能被序列化。由於大多數比較器幾乎沒有狀態，因此使其可序列化通常是容易的，也是良好的防禦性編程。"
        },
        "SF_SWITCH_FALLTHROUGH": {
            "ShortDescription": "發現 switch 語句，其中一個 case 通過到下一個 case",
            "LongDescription": "在 {1} 中發現 switch 語句，其中一個 case 通過到下一個 case",
            "Details": "該方法包含一個 switch 語句，其中一個 case 分支將通過到下一個 case。通常，您需要以 break 或 return 結束此 case。"
        },
        "SF_SWITCH_NO_DEFAULT": {
            "ShortDescription": "發現 switch 語句，缺少 default case",
            "LongDescription": "在 {1} 中發現 switch 語句，缺少 default case",
            "Details": "該方法包含一個 switch 語句，缺少 default case。通常，您需要提供一個 default case。由於分析僅查看生成的字節碼，如果 default case 在 switch 語句的末尾，且 switch 語句中的其他 case 沒有 break 聲明，則可能錯誤地觸發此警告。"
        },
        "SF_DEAD_STORE_DUE_TO_SWITCH_FALLTHROUGH": {
            "ShortDescription": "由於 switch 語句的 fall through 導致的無用存儲",
            "LongDescription": "前一個 case 的值 {2.givenClass} 在此被覆蓋，原因是 switch 語句的 fall through",
            "Details": "由於 switch case 的 fall through，在此覆蓋了前一個 case 中存儲的值。您可能忘了在前一個 case 的末尾放置 break 或 return。"
        },
        "SF_DEAD_STORE_DUE_TO_SWITCH_FALLTHROUGH_TO_THROW": {
            "ShortDescription": "由於 switch 語句的 fall through 到 throw 導致的無用存儲",
            "LongDescription": "前一個 case 的值 {2.givenClass} 在此丟失，原因是 switch 語句的 fall through 到 throw",
            "Details": "由於 switch case 的 fall through，前一個 case 中存儲的值在此被忽略。您可能忘了在前一個 case 的末尾放置 break 或 return。"
        },
        "WS_WRITEOBJECT_SYNC": {
            "ShortDescription": "類的 writeObject() 方法是同步的，但其他方法不是",
            "LongDescription": "{0} 的 writeObject 方法是同步的，但其他方法不是",
            "Details": "該類具有一個同步的方法；但是，該類沒有其他方法是同步的。"
        },
        "RS_READOBJECT_SYNC": {
            "ShortDescription": "類的 readObject() 方法是同步的",
            "LongDescription": "{0} 的 readObject 方法是同步的",
            "Details": "這個可序列化類定義了一個同步的 readObject() 方法。&nbsp; 根據定義，通過反序列化創建的對象只能被一個線程訪問，因此沒有必要進行同步。&nbsp; 如果該方法本身導致對象對另一個線程可見，則這就是非常可疑的編碼風格的例子。"
        },
        "SE_NONSTATIC_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID 不是靜態的",
            "LongDescription": "{1} 不是靜態的",
            "Details": "該類定義了一個非靜態的 serialVersionUID 字段。&nbsp; 如果它打算為序列化指定版本 UID，則該字段應設置為靜態。"
        },
        "SE_NONFINAL_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID 不是最終的",
            "LongDescription": "{1} 不是最終的",
            "Details": "該類定義了一個非最終的 serialVersionUID 字段。&nbsp; 如果它打算為序列化指定版本 UID，則該字段應設置為最終。"
        },
        "SE_NONLONG_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID 不是長整型",
            "LongDescription": "{1} 不是長整型",
            "Details": "該類定義了一個非長整型的 serialVersionUID 字段。&nbsp; 如果它打算為序列化指定版本 UID，則該字段應設置為長整型。"
        },
        "SE_BAD_FIELD": {
            "ShortDescription": "可序列化類中的非瞬態非可序列化實例字段",
            "LongDescription": "類 {0} 定義了非瞬態非可序列化實例字段 {1.name}",
            "Details": "該可序列化類定義了一個非基本類型的實例字段，該字段既不是瞬態的，也不是可序列化的，並且未實現 Serializable 接口或 Externalizable 接口。&nbsp; 如果該字段中存儲的對象不是可序列化的，則該類的對象在反序列化時將無法正確還原。"
        },
        "SE_BAD_FIELD_INNER_CLASS": {
            "ShortDescription": "不可序列化類具有可序列化的內部類",
            "LongDescription": "{0} 是可序列化的，但也是不可序列化類的內部類",
            "Details": "該可序列化類是不可序列化類的內部類。&nbsp; 因此，嘗試序列化它也將嘗試關聯與之相關聯的外部類的實例，導致運行時錯誤。&nbsp; 如果可能，應該將內部類聲明為靜態內部類，以解決此問題。將外部類設為可序列化也能奏效，但這意味著序列化內部類的實例將始終同時序列化外部類的實例，這通常並不是您真正想要的行為。"
        },
        "SE_INNER_CLASS": {
            "ShortDescription": "可序列化的內部類",
            "LongDescription": "{0} 是可序列化的內部類",
            "Details": "該可序列化類是一個內部類。&nbsp; 嘗試序列化它也會序列化相關聯的外部實例。該外部實例是可序列化的，因此這不會失敗，但它可能會序列化比預期多得多的數據。&nbsp; 如果可能，應該將內部類聲明為靜態內部類（也稱為嵌套類），以解決此問題。"
        },
        "SE_BAD_FIELD_STORE": {
            "ShortDescription": "非可序列化值存儲在可序列化類的實例字段中",
            "LongDescription": "{2} 存儲在非瞬態字段 {1.givenClass} 中",
            "Details": "一個非可序列化的值存儲在可序列化類的非瞬態字段中。"
        },
        "SC_START_IN_CTOR": {
            "ShortDescription": "構造函數調用 Thread.start()",
            "LongDescription": "{1} 調用 {2}",
            "Details": "構造函數啟動了一個線程。如果該類被擴展/子類化，這可能是錯誤的，因為線程將在子類構造函數開始之前啟動。"
        },
        "SS_SHOULD_BE_STATIC": {
            "ShortDescription": "未讀字段：這個字段應該是靜態的嗎？",
            "LongDescription": "未讀字段：{1}；這個字段應該是靜態的嗎？",
            "Details": "該類包含一個實例最終字段，它被初始化為編譯時靜態值。考慮將該字段聲明為靜態。"
        },
        "UUF_UNUSED_FIELD": {
            "ShortDescription": "未使用的字段",
            "LongDescription": "未使用的字段：{1}",
            "Details": "該字段從未使用過。&nbsp; 考慮將其從類中移除。"
        },
        "URF_UNREAD_FIELD": {
            "ShortDescription": "未讀字段",
            "LongDescription": "未讀字段：{1}",
            "Details": "該字段從未讀取。&nbsp; 考慮將其從類中移除。"
        },
        "UUF_UNUSED_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未使用的公共或受保護字段",
            "LongDescription": "未使用的公共或受保護字段：{1}",
            "Details": "該字段從未使用過。&nbsp;\n該字段是公共或受保護的，因此可能打算與未在分析中查看的類一起使用。如果不是，\n考慮除去該字段。"
        },
        "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未讀公共/受保護字段",
            "LongDescription": "未讀公共/受保護字段：{1}",
            "Details": "該字段從未讀取。&nbsp;\n該字段是公共或受保護的，因此可能打算與未在分析中查看的類一起使用。如果不是，\n考慮除去該字段。"
        },
        "QF_QUESTIONABLE_FOR_LOOP": {
            "ShortDescription": "for 循環中複雜、微妙或錯誤的增量",
            "LongDescription": "for 循環中複雜、微妙或錯誤的增量 {1}",
            "Details": "您確定這個 for 循環正在遞增/遞減正確的變量嗎？似乎另一個變量被初始化並通過 for 循環進行檢查。"
        },
        "UWF_NULL_FIELD": {
            "ShortDescription": "字段僅設置為 null",
            "LongDescription": "字段僅設置為 null：{1}",
            "Details": "對此字段的所有寫入都是常量值 null，因此所有讀取該字段將返回 null。\n檢查是否有錯誤，或者如果沒有用處則移除它。"
        },
        "UWF_UNWRITTEN_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未寫入的公共或受保護字段",
            "LongDescription": "未寫入的公共或受保護字段：{1}",
            "Details": "對該公共/受保護字段未看到任何寫入。&nbsp; 所有讀取它將返回默認值。檢查是否有錯誤（是否應已初始化？），或者如果沒有用處則移除它。"
        },
        "UWF_UNWRITTEN_FIELD": {
            "ShortDescription": "未寫入字段",
            "LongDescription": "未寫入字段：{1}",
            "Details": "該字段從未被寫入。&nbsp; 所有讀取它將返回默認值。檢查是否有錯誤（是否應已初始化？），或者如果沒有用處則移除它。"
        },
        "ST_WRITE_TO_STATIC_FROM_INSTANCE_METHOD": {
            "ShortDescription": "通過實例方法寫入靜態字段",
            "LongDescription": "從實例方法 {1} 寫入靜態字段 {2}",
            "Details": "該實例方法寫入一個靜態字段。如果操作多個實例，這樣做很容易出錯，\n通常也是不好的做法。\n"
        },
        "NP_LOAD_OF_KNOWN_NULL_VALUE": {
            "ShortDescription": "已知的空值加載",
            "LongDescription": "在 {1} 中加載已知的空值",
            "Details": "此時引用的變量由於之前的空值檢查已知為空。雖然這是有效的，但這可能是錯誤的（也許您\n打算引用不同的變量，或者之前的空值檢查應該是檢查該\n變量是否非空）。\n"
        },
        "NP_DEREFERENCE_OF_READLINE_VALUE": {
            "ShortDescription": "沒有空值檢查的 readLine() 結果解引用",
            "LongDescription": "在 {1} 中沒有空值檢查的 readLine() 結果解引用",
            "Details": "調用 readLine() 的結果在沒有檢查結果是否為空的情況下被解引用。如果沒有更多的文本行\n可讀，readLine() 將返回空，並且解引用將生成空指針異常。\n"
        },
        "NP_IMMEDIATE_DEREFERENCE_OF_READLINE": {
            "ShortDescription": "立即解引用 readLine() 的結果",
            "LongDescription": "在 {1} 中立即解引用 readLine() 的結果",
            "Details": "調用 readLine() 的結果立即被解引用。如果沒有更多的文本行\n可讀，readLine() 將返回空，並且解引用將生成空指針異常。\n"
        },
        "NP_UNWRITTEN_FIELD": {
            "ShortDescription": "未寫入字段的讀取",
            "LongDescription": "在 {1} 中讀取未寫入字段 {2.name}",
            "Details": "程序正在解引用一個似乎從未寫入非空值的字段。\n除非通過分析未能檢測到的一些機制對字段進行了初始化，\n否則解引用該值將生成空指針異常。\n"
        },
        "NP_UNWRITTEN_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "未寫入公共或受保護字段的讀取",
            "LongDescription": "在 {1} 中讀取未寫入的公共或受保護字段 {2.name}",
            "Details": "程序正在解引用一個似乎從未寫入非空值的公共或受保護的字段。\n除非通過分析未能檢測到的一些機制對字段進行了初始化，\n否則解引用該值將生成空指針異常。\n"
        },
        "SIC_THREADLOCAL_DEADLY_EMBRACE": {
            "ShortDescription": "非靜態內部類和線程局部的致命擁抱",
            "LongDescription": "{0} 需要為 _static_ 以避免與 {1} 之間的致命擁抱",
            "Details": "這個類是一個內部類，但可能應該是一個靜態內部類。因為它不是靜態的，所以存在內部類和外部類中的線程局部之間發生致命擁抱的嚴重危險。由於內部類不是靜態的，它保留了對外部類的引用。如果線程局部包含內部類的實例引用，內部和外部實例將都能被訪問，而不適合進行垃圾回收。\n"
        },
        "SIC_INNER_SHOULD_BE_STATIC": {
            "ShortDescription": "應該是一個靜態內部類",
            "LongDescription": "{0} 應該是一個 _static_ 內部類嗎？",
            "Details": "這個類是一個內部類，但沒有使用其創建它的對象的嵌入引用。\n這個引用使類的實例變得更大，並可能使對創建者對象的引用存活得比必要的時間更長。\n如果可能，應該將該類設為靜態。\n"
        },
        "UWF_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR": {
            "ShortDescription": "構造函數中未初始化的字段，但在沒有空值檢查的情況下解引用",
            "LongDescription": "{1.givenClass} 在構造函數中未初始化，並在 {2} 中解引用",
            "Details": "該字段在任何構造函數中都未初始化，因此在對象構造後可能為 null。\n在其他地方，它被加載並在沒有空值檢查的情況下解引用。\n這可能是錯誤或可疑的設計，因為如果在初始化之前解引用該字段，將生成空指針異常。\n"
        },
        "SIC_INNER_SHOULD_BE_STATIC_ANON": {
            "ShortDescription": "可以重構為命名的靜態內部類",
            "LongDescription": "類 {0} 可以重構為一個命名的 _static_ 內部類",
            "Details": "這個類是一個內部類，但沒有使用其創建它的對象的嵌入引用。這個引用使類的實例變得更大，並可能使對創建者對象的引用存活得比必要的時間更長。如果可能，應該將該類設為靜態。由於匿名內部類不能標記為靜態，因此這樣做將需要重構內部類，使其成為命名的內部類。"
        },
        "SIC_INNER_SHOULD_BE_STATIC_NEEDS_THIS": {
            "ShortDescription": "可以重構為靜態內部類",
            "LongDescription": "類 {0} 可以重構為 _static_ 內部類",
            "Details": "這個類是一個內部類，但在創建內部對象時沒有使用其嵌入引用。這個引用使類的實例變得更大，並可能使對創建者對象的引用存活得比必要的時間更長。如果可能，應該將該類設為靜態。由於在創建內部實例時需要對外部對象的引用，因此內部類需要重構，以便將對外部實例的引用傳遞給內部類的構造函數。"
        },
        "WA_NOT_IN_LOOP": {
            "ShortDescription": "等待不在循環中",
            "LongDescription": "在 {1} 中等待不在循環中",
            "Details": "該方法包含對不在循環中的調用。如果監視器用於多個條件，則調用者打算等待的條件可能不是實際發生的條件。"
        },
        "WA_AWAIT_NOT_IN_LOOP": {
            "ShortDescription": "Condition.await() 不在循環中",
            "LongDescription": "在 {1} 中 Condition.await() 不在循環中",
            "Details": "該方法包含對不在循環中的調用。如果該對象用於多個條件，則調用者打算等待的條件可能不是實際發生的條件。"
        },
        "NO_NOTIFY_NOT_NOTIFYALL": {
            "ShortDescription": "使用 notify() 而不是 notifyAll()",
            "LongDescription": "在 {1} 中使用 notify 而不是 notifyAll",
            "Details": "該方法調用了 notify，而不是 notifyAll。Java 監視器通常用於多個條件。僅調用 notify 將喚醒一個線程，這意味著喚醒的線程可能不是等待調用者剛剛滿足的條件的線程。"
        },
        "UC_USELESS_VOID_METHOD": {
            "ShortDescription": "無用的非空 void 方法",
            "LongDescription": "方法 {1} 似乎是無用的",
            "Details": "我們的分析顯示，該非空的 void 方法實際上沒有執行任何有用的工作。請檢查它：可能代碼中有錯誤或其主體可以完全移除。我們正在儘量減少誤報，但在某些情況下，此警告可能是錯誤的。常見的誤報情況包括：該方法旨在觸發某個類的加載，從而可能造成副作用。該方法旨在隱式拋出某個晦澀的異常。"
        },
        "UC_USELESS_CONDITION": {
            "ShortDescription": "條件沒有效果",
            "LongDescription": "無用的條件：在此時已知 {2}",
            "Details": "該條件始終產生與先前縮減的相關變量的值相同的結果。可能是另有所指，或條件可以被移除。"
        },
        "UC_USELESS_CONDITION_TYPE": {
            "ShortDescription": "由於變量類型條件沒有效果",
            "LongDescription": "無用的條件：由於變量類型為 {3}，因此它始終是 {2}",
            "Details": "該條件由於相關變量的類型範圍始終產生相同的結果。可能是另有所指，或條件可以被移除。"
        },
        "UC_USELESS_OBJECT": {
            "ShortDescription": "創建了無用的對象",
            "LongDescription": "在方法 {1} 的變量 {2} 中存儲了無用的對象",
            "Details": "我們的分析顯示，這個對象是無用的。它被創建和修改，但其值從未超出該方法或產生任何副作用。要麼是錯誤，預期使用該對象，要麼它可以被移除。這種分析很少產生誤報。常見的誤報情況包括：該對象用於隱式拋出某個晦澀的異常。該對象作為存根用於概括代碼。該對象用於持有對弱引用/軟引用對象的強引用。"
        },
        "UC_USELESS_OBJECT_STACK": {
            "ShortDescription": "創建了棧上的無用對象",
            "LongDescription": "在方法 {1} 中創建了無用的對象",
            "Details": "這個對象僅被創建以執行一些沒有任何副作用的修改。可能是另有所指，或者該對象可以被移除。"
        },
        "RANGE_ARRAY_INDEX": {
            "ShortDescription": "數組索引超出範圍",
            "LongDescription": "數組索引超出範圍：{3}",
            "Details": "執行了數組操作，但數組索引超出範圍，這將在運行時導致 ArrayIndexOutOfBoundsException。"
        },
        "RANGE_ARRAY_OFFSET": {
            "ShortDescription": "數組偏移量超出範圍",
            "LongDescription": "數組偏移量超出範圍：{3}",
            "Details": "使用數組參數和偏移量參數調用方法，但偏移量超出範圍。這將在運行時導致 IndexOutOfBoundsException。"
        },
        "RANGE_ARRAY_LENGTH": {
            "ShortDescription": "數組長度超出範圍",
            "LongDescription": "數組長度超出範圍：{3}",
            "Details": "使用數組參數和長度參數調用方法，但長度超出範圍。這將在運行時導致 IndexOutOfBoundsException。"
        },
        "RANGE_STRING_INDEX": {
            "ShortDescription": "字符串索引超出範圍",
            "LongDescription": "調用 {5} 時字符串索引超出範圍：{3}",
            "Details": "調用字符串方法時指定的字符串索引超出範圍。這將在運行時導致 StringIndexOutOfBoundsException。"
        },
        "RV_CHECK_FOR_POSITIVE_INDEXOF": {
            "ShortDescription": "方法檢查 String.indexOf 的結果是否為正",
            "LongDescription": "{1} 檢查 String.indexOf 的結果是否為正",
            "Details": "該方法調用 String.indexOf 並檢查結果是否為正或非正。通常是檢查結果是否為負或非負。僅在檢查的子字符串出現在字符串的開頭以外的地方時，才會為正。"
        },
        "RV_DONT_JUST_NULL_CHECK_READLINE": {
            "ShortDescription": "方法在檢查非空後丟棄 readLine 的結果",
            "LongDescription": "{1} 在檢查非空後丟棄 readLine 的結果",
            "Details": "readLine 返回的值在檢查它是否為非空後被丟棄。在幾乎所有情況下，如果結果非空，您會想使用該非空值。再次調用 readLine 將為您提供不同的行。"
        },
        "RV_RETURN_VALUE_IGNORED_INFERRED": {
            "ShortDescription": "方法忽略返回值，這合適嗎？",
            "LongDescription": "在 {1} 中忽略了 {2.givenClass} 的返回值，這合適嗎？",
            "Details": "該代碼調用一個方法並忽略返回值。返回值的類型與調用方法的類型相同，\n我們的分析表明返回值可能很重要（例如，忽略的返回值）。我們猜測，忽略返回值可能是個壞主意，僅從方法主體的簡單分析來看。您可以使用 @CheckReturnValue 註釋來指示 SpotBugs 是否重要或可接受忽略該方法的返回值。\n請仔細調查以決定是否可以忽略返回值。\n"
        },
        "RV_RETURN_VALUE_IGNORED_NO_SIDE_EFFECT": {
            "ShortDescription": "沒有副作用的方法的返回值被忽略",
            "LongDescription": "在 {1} 中忽略了返回值 {2.givenClass}，但該方法沒有副作用",
            "Details": "該代碼調用一個方法並忽略返回值。然而，我們的分析顯示，該方法（包括其在子類中的實現，如果有的話）不產生任何作用，除了返回值。因此，這個調用可以被移除。\n我們正在儘量減少誤報，但在某些情況下，此警告可能是錯誤的。常見的誤報情況包括：該方法旨在被重寫，並在其他項目中產生副作用，而這些超出了分析的範圍。該方法的調用旨在觸發類加載，可能有副作用。該方法的調用僅用於獲得某些異常。如果您覺得我們的假設不正確，可以使用 @CheckReturnValue 註釋來指示 SpotBugs 忽略該方法的返回值是可接受的。\n"
        },
        "RV_RETURN_VALUE_IGNORED": {
            "ShortDescription": "方法忽略返回值",
            "LongDescription": "在 {1} 中忽略了 {2.givenClass} 的返回值",
            "Details": "此方法的返回值應該被檢查。常見的警告原因是調用一個不可變對象的方法，\n認為它會更新該對象。例如，在以下代碼片段中，\nString dateString = getHeaderField(name);\ndateString.trim();\n程序員似乎認為 trim() 方法會更新 dateString 引用的字符串。但由於字符串是不可變的，trim() 函數返回一個新字符串值，而該值在這裡被忽略。代碼應該被更正為：String dateString = getHeaderField(name);\ndateString = dateString.trim();\n"
        },
        "RV_RETURN_VALUE_IGNORED_BAD_PRACTICE": {
            "ShortDescription": "方法忽略異常返回值",
            "LongDescription": "在 {1} 中忽略了 {2} 的異常返回值",
            "Details": "該方法返回一個未檢查的值。應檢查返回值，因為它可能指示異常或意外的功能執行。例如，\n該方法返回 false\n如果文件無法成功刪除（而不是拋出一個異常）。\n如果您不檢查結果，就不會注意到方法調用是否通過返回不典型的返回值信號表示意外行為。\n"
        },
        "RV_CHECK_COMPARETO_FOR_SPECIFIC_RETURN_VALUE": {
            "ShortDescription": "代碼檢查 compareTo 返回的特定值",
            "LongDescription": "檢查 {2.givenClass} 的返回值是否等於 {3}",
            "Details": "該代碼調用了 compareTo 或 compare 方法，並檢查返回值是否為特定值，\n例如 1 或 -1。在調用這些方法時，您只應檢查結果的符號，而不是任何特定的非零值。雖然許多或大多數 compareTo 和 compare 方法只返回 -1、0 或 1，但其中一些將返回其他值。"
        },
        "RV_EXCEPTION_NOT_THROWN": {
            "ShortDescription": "創建異常但未拋出",
            "LongDescription": "{2.givenClass} 在 {1} 中未拋出",
            "Details": "該代碼創建了一個異常（或錯誤）對象，但沒有對其進行任何操作。例如，\n類似於 if (x < 0) { new IllegalArgumentException(\"x must be nonnegative\");\n}\n這可能是程序員的意圖是拋出創建的異常：if (x < 0) { throw new IllegalArgumentException(\"x must be nonnegative\");\n}\n"
        },
        "NP_ALWAYS_NULL": {
            "ShortDescription": "空指針解引用",
            "LongDescription": "在 {1} 中解引用空指針 {2.givenClass}",
            "Details": "在這裡解引用了一個空指針。這會在代碼執行時導致錯誤。"
        },
        "NP_CLOSING_NULL": {
            "ShortDescription": "在始終為空的值上調用 close()",
            "LongDescription": "無法關閉 {2.givenClass}，因為它在 {1} 中始終為空",
            "Details": "close() 被調用在一個始終為空的值上。如果執行此語句，\n將發生空指針異常。但更大的風險在於您從未關閉應該關閉的內容。"
        },
        "NP_STORE_INTO_NONNULL_FIELD": {
            "ShortDescription": "將空值存儲到標註為 @Nonnull 的字段中",
            "LongDescription": "在 {1} 中將空值存儲到標註為 @Nonnull 的字段 {2.givenClass} 中",
            "Details": "將可能為 null 的值存儲到已標註為 @Nonnull 的字段中。"
        },
        "NP_ALWAYS_NULL_EXCEPTION": {
            "ShortDescription": "在異常路徑上方法中的空指針解引用",
            "LongDescription": "在異常路徑上解引用 {2.givenClass} 的空指針在 {1}",
            "Details": "在異常路徑上解引用空指針。在代碼執行時，這會導致錯誤。\n請注意，由於 SpotBugs 當前不會修剪不可行的異常路徑，\n這可能是誤警告。同樣，請注意，SpotBugs 將 switch 語句的默認情況視為異常路徑，\n因為默認情況通常是不可行的。"
        },
        "NP_PARAMETER_MUST_BE_NONNULL_BUT_MARKED_AS_NULLABLE": {
            "ShortDescription": "參數必須為非空但標記為可空",
            "LongDescription": "{2} 必須為非空但標記為可空",
            "Details": "此參數始終以需要它為非空的方式使用，\n但該參數顯式標註為 Nullable。參數的使用或註釋有誤。"
        },
        "NP_NULL_ON_SOME_PATH": {
            "ShortDescription": "可能的空指針解引用",
            "LongDescription": "在 {1} 中可能的空指針解引用 {2.givenClass}",
            "Details": "有一條語句分支，如果執行，確保將解引用一個空值，這\n將導致在代碼執行時出現錯誤。\n當然，問題可能是該分支或語句不可行，空指針異常可能根本無法執行；判斷這一點超出了 SpotBugs 的能力。"
        },
        "NP_NULL_ON_SOME_PATH_MIGHT_BE_INFEASIBLE": {
            "ShortDescription": "可能的空指針解引用，分支可能是不可行的",
            "LongDescription": "在 {1} 中可能的空指針解引用 {2.givenClass}，在可能不可行的分支上",
            "Details": "有一條語句分支，如果執行，確保將解引用一個空值，這\n將導致在代碼執行時出現錯誤。\n當然，問題可能是該分支或語句不可行，空指針異常可能根本無法執行；判斷這一點超出了 SpotBugs 的能力。\n由於之前對此值進行了空值測試，\n這是一種確定的可能性。"
        },
        "NP_NULL_ON_SOME_PATH_EXCEPTION": {
            "ShortDescription": "在異常路徑上方法中的可能空指針解引用",
            "LongDescription": "在異常路徑上在 {1} 中可能的空指針解引用 {2.givenClass}",
            "Details": "在某些異常控制路徑上解引用的值是空指針。\n這可能會導致在代碼執行時出現錯誤。\n請注意，由於 SpotBugs 當前不會修剪不可行的異常路徑，\n這可能是誤警告。同樣，請注意，SpotBugs 將 switch 語句的默認情況視為異常路徑，\n因為默認情況通常是不可行的。"
        },
        "NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE": {
            "ShortDescription": "由於被調用方法的返回值導致可能的空指針解引用",
            "LongDescription": "在 {1} 中由於被調用方法的返回值導致可能的空指針解引用",
            "Details": "一個方法的返回值在沒有空值檢查的情況下被解引用，\n該方法的返回值一般應該檢查是否為 null。這可能會導致\n在代碼執行時出現錯誤。\n"
        },
        "NP_NULL_PARAM_DEREF_NONVIRTUAL": {
            "ShortDescription": "非虛擬方法調用傳遞 null 給非空參數",
            "LongDescription": "在 {1} 中的非虛擬方法調用為 {2.givenClass} 的非空參數傳遞了 null",
            "Details": "一個可能為 null 的值被傳遞給一個非空方法參數。要麼該參數被標註為應該始終非空的參數，要麼分析顯示它將始終被解引用。"
        },
        "NP_NULL_PARAM_DEREF_ALL_TARGETS_DANGEROUS": {
            "ShortDescription": "方法調用為非空參數傳遞 null",
            "LongDescription": "在 {1} 中為 {2.givenClass} 的非空參數傳遞 null",
            "Details": "在調用點處傳遞一個可能為 null 的值，而所有已知目標方法都要求該參數為非空。要麼該參數被標註為應該始終非空的參數，要麼分析顯示它將始終被解引用。"
        },
        "NP_NULL_PARAM_DEREF": {
            "ShortDescription": "方法調用為非空參數傳遞 null",
            "LongDescription": "在 {1} 中為 {2.givenClass} 的非空參數傳遞 null",
            "Details": "該方法調用為非空方法參數傳遞了一个 null 值。要麼該參數被標註為應該始終非空的參數，要麼分析顯示它將始終被解引用。"
        },
        "NP_NONNULL_PARAM_VIOLATION": {
            "ShortDescription": "方法調用為非空參數傳遞 null",
            "LongDescription": "在 {1} 中為 {2.givenClass} 的非空參數傳遞 null",
            "Details": "該方法將一個 null 值作為必須為非空的方法參數傳遞。要麼該參數已顯式標記為 @Nonnull，要麼分析已確定該參數總是被解引用。"
        },
        "NP_NONNULL_RETURN_VIOLATION": {
            "ShortDescription": "方法可能返回 null，但聲明為 @Nonnull",
            "LongDescription": "{1} 可能返回 null，但聲明為 @Nonnull",
            "Details": "該方法可能返回一個 null 值，但該方法（或它重寫的超類方法）聲明返回 @Nonnull。"
        },
        "NP_CLONE_COULD_RETURN_NULL": {
            "ShortDescription": "克隆方法可能返回 null",
            "LongDescription": "{1} 可能返回 null",
            "Details": "該克隆方法在某些情況下似乎返回 null，但克隆絕不應返回 null 值。如果您确信此路徑是不可達的，請改為拋出 AssertionError。"
        },
        "NP_TOSTRING_COULD_RETURN_NULL": {
            "ShortDescription": "toString 方法可能返回 null",
            "LongDescription": "{1} 可能返回 null",
            "Details": "該 toString 方法在某些情況下似乎返回 null。對規範的寬鬆解讀可以被理解為允許這樣做，但這可能是個壞主意，並且可能導致其他代碼崩潰。返回空字符串或其他適當的字符串而不是 null。"
        },
        "NP_GUARANTEED_DEREF": {
            "ShortDescription": "空值保證被解引用",
            "LongDescription": "{2.givenClass} 可能為 null，並確保在 {1} 中被解引用",
            "Details": "有一個語句或分支，如果執行，保證在此時一個值為 null，並且該值保證被解引用（除非涉及運行時異常的向前路徑）。請注意，像 if (x == null) throw new NullPointerException(); 這樣的檢查被視為解引用。"
        },
        "NP_GUARANTEED_DEREF_ON_EXCEPTION_PATH": {
            "ShortDescription": "值為 null，並保證在異常路徑上被解引用",
            "LongDescription": "{2.name} 為 null，保證在 {1} 的異常路徑中被解引用",
            "Details": "在異常路徑上有一個語句或分支，如果執行，保證此時一個值為 null，並且該值保證被解引用（除非涉及運行時異常的向前路徑）。"
        },
        "SI_INSTANCE_BEFORE_FINALS_ASSIGNED": {
            "ShortDescription": "靜態初始化器在所有靜態最終字段分配之前創建實例",
            "LongDescription": "在 {0} 的靜態初始化器在所有靜態最終字段分配之前創建實例",
            "Details": "該類的靜態初始化器在所有靜態最終字段分配之前創建了該類的一個實例。"
        },
        "OS_OPEN_STREAM": {
            "ShortDescription": "方法可能未能關閉流",
            "LongDescription": "{1} 可能未能關閉流",
            "Details": "該方法創建了一個 IO 流對象，但未將其分配給任何字段，未將其傳遞給可能關閉它的其他方法，\n或返回它，並且在所有方法的返回路徑中似乎未關閉流。這可能導致文件描述符洩漏。通常，使用塊來確保流被關閉是個好主意。"
        },
        "OS_OPEN_STREAM_EXCEPTION_PATH": {
            "ShortDescription": "方法在異常情況下可能未能關閉流",
            "LongDescription": "{1} 在異常情況下可能未能關閉流",
            "Details": "該方法創建了一個 IO 流對象，但未將其分配給任何字段，未將其傳遞給其他方法或返回，並且在所有可能的異常路徑中似乎未關閉它。這可能導致文件描述符洩漏。通常，使用塊來確保流被關閉是個好主意。"
        },
        "PZLA_PREFER_ZERO_LENGTH_ARRAYS": {
            "ShortDescription": "考慮返回長度為零的數組而不是 null",
            "LongDescription": "是否應返回長度為零的數組而不是 null?",
            "Details": "通常返回長度為零的數組而不是 null 引用以指示沒有結果（即，空的結果列表）是更好的設計。這樣，方法的調用者無需顯式檢查是否為 null。另一方面，使用 null 來指示“沒有這個問題的答案”可能是合適的。例如，如果給定一個不包含文件的目錄，則返回空列表，\n如果文件不是目錄，則返回 null。"
        },
        "UCF_USELESS_CONTROL_FLOW": {
            "ShortDescription": "無用的控制流",
            "LongDescription": "在 {1} 中無用的控制流",
            "Details": "該方法包含一個無用的控制流語句，無論分支是否被執行，控制流都會繼續到同一個地方。例如，\n這是由於在 if 語句中有一個空語句塊導致的：if (argv.length == 0) { // TODO: 處理此情況\n}\n"
        },
        "UCF_USELESS_CONTROL_FLOW_NEXT_LINE": {
            "ShortDescription": "無用的控制流到下一行",
            "LongDescription": "在 {1} 中無用的控制流到下一行",
            "Details": "該方法包含一個無用的控制流語句，其中控制流無論分支是否被執行，都會跟隨到同一行或下一行。\n通常，這是由於不小心將空語句用作 if 語句的主體造成的，例如：if (argv.length == 1); System.out.println(\"Hello, \" + argv[0]);\n"
        },
        "RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE": {
            "ShortDescription": "對先前解引用值的空檢查",
            "LongDescription": "在 {1} 中對 {2.givenClass} 於 {4.lineNumber} 處的空檢查，該值先前已被解引用",
            "Details": "此處檢查一個值是否為 null，但此值不能為 null，因為它之前已被解引用，\n如果它為 null，在先前的解引用時將發生空指針異常。 本質上，此代碼與先前的解引用不一致，\n即該值是否允許為 null。檢查要麼是多餘的，要麼之前的解引用是錯誤的。"
        },
        "RCN_REDUNDANT_NULLCHECK_OF_NULL_VALUE": {
            "ShortDescription": "對已知為 null 的值的冗餘空檢查",
            "LongDescription": "在 {1} 中對已知為 null 的 {2} 的冗餘空檢查",
            "Details": "該方法包含對一個已知為空的值進行冗餘檢查，檢查是否等於常量 null。"
        },
        "RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE": {
            "ShortDescription": "對已知為非空值的冗餘空檢查",
            "LongDescription": "在 {1} 中對已知為非空的 {2} 的冗餘空檢查",
            "Details": "該方法包含對一個已知為非空的值進行冗餘檢查，檢查是否等於常量 null。"
        },
        "RCN_REDUNDANT_COMPARISON_TWO_NULL_VALUES": {
            "ShortDescription": "對兩個 null 值的冗餘比較",
            "LongDescription": "在 {1} 中對兩個 null 值的冗餘比較",
            "Details": "該方法包含對已知都為空的兩個引用的冗餘比較。"
        },
        "RCN_REDUNDANT_COMPARISON_OF_NULL_AND_NONNULL_VALUE": {
            "ShortDescription": "對非空值與 null 的冗餘比較",
            "LongDescription": "在 {1} 中對非空值與 null 的冗餘比較",
            "Details": "該方法包含一個已知為非空的引用與另一個已知為 null 的引用的比較。"
        },
        "RCN_REDUNDANT_CHECKED_NULL_COMPARISON": {
            "deprecated": "true",
            "ShortDescription": "對先前檢查的值的冗餘空比較",
            "LongDescription": "在 {1} 中對先前檢查的 {2} 進行冗餘空比較",
            "Details": "該方法包含對一個引用值進行的冗餘空比較。兩種類型的冗餘比較被報告：\n比較的兩個值都是 definitely null，一個值是 definitely null，另一個值是 definitely not null。這條特定的警告通常表示，\n對已知非空的值進行了空檢查。雖然該檢查不是必要的，但這可能只是防禦性編程的一個案例。"
        },
        "UL_UNRELEASED_LOCK": {
            "ShortDescription": "方法沒有在所有路徑上釋放鎖",
            "LongDescription": "{1} 沒有在所有路徑上釋放鎖",
            "Details": "該方法獲取了一個 JSR-166 () 鎖，\n但沒有在所有方法的返回路徑上釋放它。一般來說，使用 JSR-166 鎖的正確習慣是：\nLock l = ...;\nl.lock();\ntry { // 執行一些操作\n} finally { l.unlock();\n}\n"
        },
        "UL_UNRELEASED_LOCK_EXCEPTION_PATH": {
            "ShortDescription": "方法沒有在所有異常路徑上釋放鎖",
            "LongDescription": "{1} 沒有在所有異常路徑上釋放鎖",
            "Details": "該方法獲取了一個 JSR-166 () 鎖，\n但沒有在所有異常路徑中釋放它。一般來說，使用 JSR-166 鎖的正確習慣是：\nLock l = ...;\nl.lock();\ntry { // 執行一些操作\n} finally { l.unlock();\n}\n"
        },
        "RC_REF_COMPARISON": {
            "ShortDescription": "可疑的引用比較",
            "LongDescription": "在 {1} 中對 {2} 引用的可疑比較",
            "Details": "該方法使用 == 或 != 操作符比較兩個引用值，通常比較此類型的實例的正確方式是使用 equals() 方法。\n可能會創建不同的實例，這些實例是相等但不通過 == 比較，因為它們是不同的對象。\n通常不應通過引用比較的類示例包括 java.lang.Integer、java.lang.Float 等。 RC_REF_COMPARISON 僅涵蓋原始類型的包裝類型。 可疑類型列表可以通過添加帶有逗號分隔類的 frc.suspicious 系統屬性來擴展：<systemPropertyVariables> <frc.suspicious>java.time.LocalDate,java.util.List</frc.suspicious> </systemPropertyVariables>"
        },
        "RC_REF_COMPARISON_BAD_PRACTICE": {
            "ShortDescription": "可疑的引用比較與常量",
            "LongDescription": "在 {1} 中與常量 {2} 引用的可疑比較",
            "Details": "該方法使用 == 或 != 操作符將引用值與常量進行比較，通常比較此類型的實例的正確方式是使用 equals() 方法。\n可能會創建不同的實例，這些實例是相等但不通過 == 比較，因為它們是不同的對象。\n通常不應通過引用比較的類示例包括 java.lang.Integer、java.lang.Float 等。"
        },
        "RC_REF_COMPARISON_BAD_PRACTICE_BOOLEAN": {
            "ShortDescription": "可疑的布爾值引用比較",
            "LongDescription": "在 {1} 中對布爾值的可疑比較",
            "Details": "該方法使用 == 或 != 操作符比較兩個布爾值。通常，只有兩個布爾值 (Boolean.TRUE 和 Boolean.FALSE)，\n但可以使用 new Boolean(b) 構造函數創建其他布爾對象。最好避免這些對象，但如果它們確實存在，\n那麼使用 == 或 != 檢查布爾對象的相等性將得到不同於使用 equals() 的結果。"
        },
        "EC_UNRELATED_TYPES_USING_POINTER_EQUALITY": {
            "ShortDescription": "使用指針相等比較不同類型",
            "LongDescription": "在 {1} 中使用指針相等比較 {2.givenClass} 和 {3.givenClass}",
            "Details": "該方法使用指針相等比較兩個似乎是不同類型的引用。此比較的結果在運行時將始終為 false。"
        },
        "EC_UNRELATED_TYPES": {
            "ShortDescription": "調用 equals() 比較不同類型",
            "LongDescription": "在 {1} 中調用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "該方法在兩個不同類型的引用上調用 equals(Object)，分析表明，它們在運行時將是不同類對象。此外，檢查將被調用的 equals 方法表明，\n此調用總是返回 false，或者 equals 方法不是對稱的（這是 Object 類中 equals 的合同所要求的屬性）。"
        },
        "EC_UNRELATED_INTERFACES": {
            "ShortDescription": "調用 equals() 比較不同接口類型",
            "LongDescription": "在 {1} 中調用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "該方法在兩個不相關的接口類型的引用上調用 equals(Object)，其中兩者都不是彼此的子類型，且沒有已知的非抽象類實現這兩個接口。\n因此，被比較的對象在運行時不太可能屬於同一類（除非有些應用程序類未被分析，或者可以在運行時動態加載類）。\n根據 equals() 的合同，不同類的對象應始終比較為不相等；因此，根據 java.lang.Object.equals(Object) 定義的合同，\n此比較的結果在運行時將始終為 false。"
        },
        "EC_UNRELATED_CLASS_AND_INTERFACE": {
            "ShortDescription": "調用 equals() 比較不相關的類和接口",
            "LongDescription": "在 {1} 中調用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "\n該方法在兩個引用上調用 equals(Object)，其中一個是類，另一個是接口，且類及其所有非抽象子類都未實現該接口。\n因此，被比較的對象在運行時不太可能屬於同一類（除非有些應用程序類未被分析，或者可以在運行時動態加載類）。\n根據 equals() 的合同，不同類的對象應始終比較為不相等；因此，根據 java.lang.Object.equals(Object) 定義的合同，\n此比較的結果在運行時將始終為 false。"
        },
        "EC_NULL_ARG": {
            "ShortDescription": "調用 equals(null)",
            "LongDescription": "在 {1} 中調用 equals(null)",
            "Details": "該方法調用 equals(Object)，將 null 值作為參數傳遞。根據 equals() 方法的合同，此調用應始終返回 false。"
        },
        "MWN_MISMATCHED_WAIT": {
            "ShortDescription": "不匹配的 wait()",
            "LongDescription": "在 {1} 中不匹配的 wait()",
            "Details": "該方法調用 Object.wait()，但顯然沒有持有對象上的鎖。調用 wait() 而沒有持有鎖將導致線程拋出 IllegalMonitorStateException。"
        },
        "MWN_MISMATCHED_NOTIFY": {
            "ShortDescription": "不匹配的 notify()",
            "LongDescription": "在 {1} 中不匹配的 notify()",
            "Details": "該方法調用 Object.notify() 或 Object.notifyAll()，但顯然沒有持有對象上的鎖。調用 notify() 或 notifyAll() 而沒有持有鎖將導致線程拋出 IllegalMonitorStateException。"
        },
        "SA_LOCAL_SELF_ASSIGNMENT_INSTEAD_OF_FIELD": {
            "ShortDescription": "局部變量自賦值而不是賦值給字段",
            "LongDescription": "在 {1} 中局部變量 {2} 自賦值而不是賦值給字段",
            "Details": "該方法包含局部變量的自賦值，並且有一個相同名稱的字段，例如：int foo; public void setFoo(int foo) { foo = foo; }\n該賦值是無用的。您是想將值賦給字段嗎？"
        },
        "SA_LOCAL_SELF_ASSIGNMENT": {
            "ShortDescription": "局部變量自賦值",
            "LongDescription": "在 {1} 中局部變量 {2} 自賦值",
            "Details": "該方法包含局部變量的自賦值；例如 public void foo() { int x = 3; x = x; }\n\n這樣的賦值是無用的，可能表示邏輯錯誤或拼寫錯誤。"
        },
        "SA_FIELD_SELF_ASSIGNMENT": {
            "ShortDescription": "字段自賦值",
            "LongDescription": "在 {1} 中字段 {2.givenClass} 自賦值",
            "Details": "該方法包含字段的自賦值；例如 int x;\npublic void foo() { x = x; }\n這樣的賦值是無用的，可能表示邏輯錯誤或拼寫錯誤。"
        },
        "SA_FIELD_DOUBLE_ASSIGNMENT": {
            "ShortDescription": "字段的雙重賦值",
            "LongDescription": "在 {1} 中字段 {2.givenClass} 的雙重賦值",
            "Details": "該方法包含字段的雙重賦值；例如 int x, y;\npublic void foo() { x = x = 17; }\n對一個字段進行兩次賦值是無用的，可能表示邏輯錯誤或拼寫錯誤。"
        },
        "SA_LOCAL_DOUBLE_ASSIGNMENT": {
            "ShortDescription": "局部變量的雙重賦值",
            "LongDescription": "在 {1} 中局部變量 {2} 的雙重賦值",
            "Details": "該方法包含局部變量的雙重賦值；例如 public void foo() { int x, y; x = x = 17; }\n對一個變量賦值兩次是無用的，可能表示邏輯錯誤或拼寫錯誤。"
        },
        "SA_FIELD_SELF_COMPUTATION": {
            "ShortDescription": "涉及字段的無意義自計算（例如，x & x）",
            "LongDescription": "在 {1} 中對 {2.givenClass} 進行無意義的自計算",
            "Details": "該方法對一個字段與另一個相同字段的引用進行無意義的計算（例如，x & x 或 x - x）。由於計算的性質，\n該操作似乎沒有意義，可能表示拼寫錯誤或邏輯錯誤。請再次檢查計算。"
        },
        "SA_LOCAL_SELF_COMPUTATION": {
            "ShortDescription": "涉及變量的無意義自計算（例如，x & x）",
            "LongDescription": "在 {1} 中對 {2} 進行無意義的自計算",
            "Details": "該方法對一個局部變量與另一個相同變量的引用進行無意義的計算（例如，x & x 或 x - x）。由於計算的性質，\n該操作似乎沒有意義，可能表示拼寫錯誤或邏輯錯誤。請再次檢查計算。"
        },
        "SA_FIELD_SELF_COMPARISON": {
            "ShortDescription": "字段與自身的自比較",
            "LongDescription": "在 {1} 中，{2.givenClass} 與自身的自比較",
            "Details": "該方法將字段與自身進行比較，這可能表示拼寫錯誤或邏輯錯誤。確保您比較的是正確的內容。\n"
        },
        "SA_LOCAL_SELF_COMPARISON": {
            "ShortDescription": "值與自身的自比較",
            "LongDescription": "在 {1} 中，{2} 與自身的自比較",
            "Details": "該方法將局部變量與自身進行比較，這可能表示拼寫錯誤或邏輯錯誤。確保您比較的是正確的內容。\n"
        },
        "DMI_LONG_BITS_TO_DOUBLE_INVOKED_ON_INT": {
            "ShortDescription": "在整型上調用 Double.longBitsToDouble",
            "LongDescription": "在 {1} 中調用了 Double.longBitsToDouble，但傳遞了一個整型",
            "Details": "調用了 Double.longBitsToDouble 方法，但傳遞了一個 32 位的整型值作為參數。這幾乎肯定不是預期的，與預期結果不符。\n"
        },
        "DMI_ARGUMENTS_WRONG_ORDER": {
            "ShortDescription": "方法參數順序錯誤",
            "LongDescription": "在 {1} 中，調用 {2.name} 的參數順序錯誤",
            "Details": "該方法調用的參數似乎順序錯誤。例如，調用 Preconditions.checkNotNull(\"message\", message) 時\n未按照預期的順序傳遞參數：待檢查的值是第一個參數。\n"
        },
        "DMI_RANDOM_USED_ONLY_ONCE": {
            "ShortDescription": "隨機對象僅創建和使用一次",
            "LongDescription": "在 {1} 中創建和使用了一個隨機對象，僅使用一次",
            "Details": "該代碼創建了一個 java.util.Random 對象，使用它生成一個隨機數，然後丟棄了該隨機對象。這將產生質量一般的隨機數，並且效率低下。\n如果可能，重寫代碼，使得隨機對象只創建一次並保存，每次需要新的隨機數時調用已有的隨機對象的方法來獲取。\n如果生成的隨機數不應易於猜測，請不要為每個隨機數創建新的 Random；這些值太容易被猜測。您應考慮使用 java.security.SecureRandom 而不是（並避免為每個隨機數分配新的 SecureRandom）。\n"
        },
        "RV_ABSOLUTE_VALUE_OF_RANDOM_INT": {
            "ShortDescription": "計算有符號隨機整數絕對值的不當嘗試",
            "LongDescription": "在 {1} 中計算有符號隨機整數絕對值的不當嘗試",
            "Details": "該代碼生成一個隨機的有符號整數，然後計算該隨機整數的絕對值。如果隨機數生成器返回的數字是 Integer.MIN_VALUE，那麼結果也將是負數（因為 Math.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE）。（對於長整型也會出現同樣的問題）。\n"
        },
        "RV_ABSOLUTE_VALUE_OF_HASHCODE": {
            "ShortDescription": "計算有符號32位哈希碼絕對值的不當嘗試",
            "LongDescription": "在 {1} 中計算有符號32位哈希碼絕對值的不當嘗試",
            "Details": "該代碼生成一個哈希碼，然後計算該哈希碼的絕對值。如果哈希碼是 Integer.MIN_VALUE，那麼結果也將是負數（因為 Math.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE）。\n在 2^32 個字符串中，有一個哈希碼為 Integer.MIN_VALUE，包括 \"polygenelubricants\"、\"GydZG_\" 和 \"DESIGNING WORKHOUSES\"。\n"
        },
        "RV_REM_OF_RANDOM_INT": {
            "ShortDescription": "32位有符號隨機整數的余數",
            "LongDescription": "在 {1} 中計算的32位有符號隨機整數的余數",
            "Details": "該代碼生成一個隨機的有符號整數，然後計算該值除以其他值的余數。由於隨機數可能是負數，因此余數操作的結果也可能是負數。請確保這是有意的，並強烈考慮使用 Random.nextInt(int) 方法替代。\n"
        },
        "RV_REM_OF_HASHCODE": {
            "ShortDescription": "哈希碼的余數可能為負",
            "LongDescription": "在 {1} 中，哈希碼的余數可能為負",
            "Details": "該代碼計算一個哈希碼，然後計算該值除以其他值的余數。由於哈希碼可能為負，因此余數操作的結果也可能為負。如果您希望確保計算結果為非負，您可能需要更改您的代碼。\n如果您知道除數是2的幂，\n可以使用按位與運算符替代（即，用位與運算符代替除法）。這可能比計算余數更快。\n如果您不知道除數是2的幂，請取余數操作結果的絕對值。\n"
        },
        "INT_BAD_COMPARISON_WITH_NONNEGATIVE_VALUE": {
            "ShortDescription": "與負常量或零的非負值比較不當",
            "LongDescription": "在 {1} 中與 {2} 的不當比較",
            "Details": "該代碼將一個保證非負的值與負的常量或零進行比較。\n"
        },
        "INT_BAD_COMPARISON_WITH_SIGNED_BYTE": {
            "ShortDescription": "與簽名字節的比較不當",
            "LongDescription": "在 {1} 中與 {2} 的簽名字節比較不當",
            "Details": "簽名字節的值只能在 -128 到 127 的範圍內。將簽名字節與超出該範圍的值進行比較是無效的，且可能不正確。\n要將一個簽名字節轉換為範圍0..255的無符號值，使用 0xff &amp; b。"
        },
        "INT_BAD_COMPARISON_WITH_INT_VALUE": {
            "ShortDescription": "與長整型常量的整型值比較不當",
            "LongDescription": "在 {1} 中與 {2} 的整型比較不當",
            "Details": "該代碼將一個整型值與一個超出整型值表示範圍的長整型常量進行比較。\n該比較是無效的，且可能不正確。\n"
        },
        "INT_VACUOUS_BIT_OPERATION": {
            "ShortDescription": "對整型值的無效按位掩碼操作",
            "LongDescription": "在 {1} 中進行的無效 {2} 操作",
            "Details": "這是對整型進行的按位操作（與、或、異或），但沒有任何有用的工作（例如，v & 0xffffffff）。"
        },
        "INT_VACUOUS_COMPARISON": {
            "ShortDescription": "整型值的無效比較",
            "LongDescription": "整型值 {1} 的無效比較",
            "Details": "有一個整型比較總是返回相同的值（例如，x &lt;= Integer.MAX_VALUE）。\n"
        },
        "INT_BAD_REM_BY_1": {
            "ShortDescription": "整型對1的余數",
            "LongDescription": "在 {1} 中計算的整型對1的余數",
            "Details": "任何表達式 (exp % 1) 保證總是返回零。\n您是否想表示 (exp &amp; 1) 或 (exp % 2)？\n"
        },
        "BIT_IOR_OF_SIGNED_BYTE": {
            "ShortDescription": "簽名字節值的按位或",
            "LongDescription": "在 {1} 中計算的簽名字節值的按位或",
            "Details": "加載一個字節值（例如，從字節數組中加載的值或返回類型為 byte 的方法返回的值），並與該值進行按位或操作。字節值在進行任何按位操作之前會擴展為32位。\n因此，如果包含該值，並且初始值為 0，則代碼 ((x &lt;&lt; 8) | b[0]) 會簽名擴展為，為結果提供該值。\n尤其是，用於將字節數組打包為整型的以下代碼是錯誤的：int result = 0;\nfor (int i = 0; i &lt; 4; i++) { result = ((result &lt;&lt; 8) | b[i]);\n}\n以下習慣將正常工作：int result = 0;\nfor (int i = 0; i &lt; 4; i++) { result = ((result &lt;&lt; 8) | (b[i] &amp; 0xff));\n}\n"
        },
        "BIT_ADD_OF_SIGNED_BYTE": {
            "ShortDescription": "簽名字節值的按位加",
            "LongDescription": "在 {1} 中計算的簽名字節值的按位加",
            "Details": "加上一個字節值和一個已知低8位清除的值。從字節數組加載的值在進行任何按位操作之前會擴展為32位。\n因此，如果包含該值，並且初始值為 0，則代碼 ((x &lt;&lt; 8) + b[0]) 會簽名擴展為，為結果提供該值。\n尤其是，用於將字節數組打包為整型的以下代碼是錯誤的：int result = 0;\nfor (int i = 0; i &lt; 4; i++) result = ((result &lt;&lt; 8) + b[i]);\n以下習慣將正常工作：int result = 0;\nfor (int i = 0; i &lt; 4; i++) result = ((result &lt;&lt; 8) + (b[i] &amp; 0xff));\n"
        },
        "BIT_AND": {
            "ShortDescription": "不兼容的位掩碼",
            "LongDescription": "在 {1} 中 (e & {2} == {3}) 的不兼容位掩碼將產生常量結果",
            "Details": "該方法將形式為 (e &amp; C) 的表達式與 D 進行比較，這將始終比較為不相等，\n由於常量 C 和 D 的特定值。這可能表示邏輯錯誤或拼寫錯誤。"
        },
        "BIT_SIGNED_CHECK": {
            "ShortDescription": "檢查按位操作的符號",
            "LongDescription": "在 {1} 中檢查按位操作的符號",
            "Details": "該方法比較一個表達式，例如\n((event.detail &amp; SWT.SELECTED) &gt; 0)。使用位運算後再與大於操作符比較可能會導致意外結果（當然取決於\nSWT.SELECTED 的值）。如果 SWT.SELECTED 是負數，那麼這是一個錯誤的候選。\n即使 SWT.SELECTED 不是負數，使用 '!= 0' 替代 ' > 0 ' 似乎也是個好主意。\n"
        },
        "BIT_SIGNED_CHECK_HIGH_BIT": {
            "ShortDescription": "檢查涉及負數的按位操作的符號",
            "LongDescription": "在 {1} 中檢查涉及 {2} 的按位操作的符號",
            "Details": "該方法比較一個按位表達式，例如\n((val &amp; CONSTANT) &gt; 0)，其中 CONSTANT 是負數。\n用位運算處理後再與大於操作符比較可能會導致意外結果。這樣的比較不太可能按照預期工作，好的做法是用 '!= 0' 替代 ' > 0 '。\n"
        },
        "BIT_AND_ZZ": {
            "ShortDescription": "檢查 ((...) & 0) == 0",
            "LongDescription": "在 {1} 中檢查 ((...) & 0) == 0",
            "Details": "該方法將形式為 (e &amp; 0) 的表達式與 0 進行比較，\n這將始終比較相等。\n這可能表示邏輯錯誤或拼寫錯誤。"
        },
        "BIT_IOR": {
            "ShortDescription": "不兼容的位掩碼",
            "LongDescription": "在 (e | {2} == {3}) 中的不兼容位掩碼將產生常量結果",
            "Details": "該方法將形式為 (e | C) 的表達式與 D 進行比較，\n由於常量 C 和 D 的特定值，這將始終比較為不相等。\n這可能表示邏輯錯誤或拼寫錯誤。通常，此錯誤發生是因為代碼想要執行\n位集中的成員測試，但使用了按位或運算符（\"|\"）而不是按位與（\"&amp;\"）。此錯誤也可能出現在（e &amp; A | B） == C\n這樣的表達式中，解析為 ((e &amp; A) | B) == C，而應該是 (e &amp; (A | B)) == C。"
        },
        "LI_LAZY_INIT_INSTANCE": {
            "deprecated": "true",
            "ShortDescription": "實例字段的懶初始化不正確",
            "LongDescription": "在 {1} 中的實例字段 {2} 的懶初始化不正確",
            "Details": "該方法包含一個非同步的非易失字段的懶初始化。\n由於編譯器或處理器可能重新排序指令，\n線程不能確保看到完全初始化的對象，\n如果該方法可以被多個線程調用。您可以將字段聲明為 volatile 來修正該問題。\n有關更多信息，請查看\n<a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/\">Java 內存模型網站</a>。"
        },
        "LI_LAZY_INIT_STATIC": {
            "ShortDescription": "靜態字段的懶初始化不正確",
            "LongDescription": "在 {1} 中靜態字段 {2} 的懶初始化不正確",
            "Details": "該方法包含一個非同步的非易失靜態字段的懶初始化。\n由於編譯器或處理器可能重新排序指令，\n線程不能確保看到完全初始化的對象，\n如果該方法可以被多個線程調用。您可以將字段聲明為 volatile 來修正該問題。\n有關更多信息，請查看\n<a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/\">Java 內存模型網站</a>。"
        },
        "LI_LAZY_INIT_UPDATE_STATIC": {
            "ShortDescription": "靜態字段的懶初始化和更新不正確",
            "LongDescription": "在 {1} 中靜態字段 {2} 的懶初始化和更新不正確",
            "Details": "該方法包含一個非同步的靜態字段的懶初始化。\n在設置字段後，存儲在該位置的對象被進一步更新或訪問。\n字段的設置在其被設置後立即對其他線程可見。如果\n方法中的進一步訪問設置字段的目的是初始化對象，則\n您有一個非常嚴重的多線程錯誤，除非其他某些內容阻止\n任何其他線程在完全初始化之前訪問存儲的對象。即使您很確信該方法不會被多個\n線程調用，可能最好在設置靜態字段之前等待設置的值被完全填充/初始化。"
        },
        "JLM_JSR166_LOCK_MONITORENTER": {
            "ShortDescription": "在 Lock 上執行同步",
            "LongDescription": "在 {1} 中對 {2} 執行同步",
            "Details": "該方法在實現了 java.util.concurrent.locks.Lock 的對象上執行同步。該對象使用\n鎖定/解鎖，而不是使用 synchronized (...) 結構。"
        },
        "JML_JSR166_CALLING_WAIT_RATHER_THAN_AWAIT": {
            "ShortDescription": "在 util.concurrent 抽象上使用監視器樣式的等待方法",
            "LongDescription": "在 {1} 中調用 {2.name} 而不是 {3.name}",
            "Details": "該方法在也提供有方法（如 util.concurrent Condition 對象）的對象上調用 wait() 和 notify()。\n這可能不是您想要的，即使您確實想要這樣，也應該考慮更改您的設計，因為其他開發人員會發現這非常混淆。\n"
        },
        "JLM_JSR166_UTILCONCURRENT_MONITORENTER": {
            "ShortDescription": "在 util.concurrent 實例上執行同步",
            "LongDescription": "在 {1} 中對 {2} 執行同步",
            "Details": "該方法在 java.util.concurrent 包（或其子類）的類實例上執行同步。這些類的實例具有自己的並發控制機制，與 Java 關鍵字提供的同步是正交的。例如，\n對一個 Object 進行同步不會阻止其他線程修改該對象。\n此代碼可能是正確的，但應仔細審核和記錄，\n並且可能會混淆將來維護該代碼的人。\n"
        },
        "UPM_UNCALLED_PRIVATE_METHOD": {
            "ShortDescription": "私有方法從未被調用",
            "LongDescription": "私有方法 {1} 從未被調用",
            "Details": "該私有方法從未被調用。雖然通過反射調用該方法是可能的，但更可能的是該方法從未使用，應予以刪除。\n"
        },
        "UMAC_UNCALLABLE_METHOD_OF_ANONYMOUS_CLASS": {
            "ShortDescription": "匿名類中定義的不可調用方法",
            "LongDescription": "匿名類中定義的不可調用方法 {1}",
            "Details": "該匿名類定義了一個未直接調用的方法，並且沒有重寫超類中的方法。由於其他類中的方法無法直接調用匿名類中聲明的方法，因此似乎該方法是不可調用的。該方法可能只是死代碼，但也有可能該方法旨在重寫超類中聲明的方法，由於拼寫錯誤或其他錯誤，該方法並未真正重寫其意圖重寫的方法。\n"
        },
        "ODR_OPEN_DATABASE_RESOURCE": {
            "ShortDescription": "方法可能未能關閉數據庫資源",
            "LongDescription": "{1} 可能未能關閉 {2.excludingPackage}",
            "Details": "該方法創建了一個數據庫資源（如數據庫連接或行集），\n未將其分配給任何字段，未傳遞給其他方法或返回，並且似乎沒有在所有方法的返回路徑中關閉該對象。未能在所有路徑中關閉數據庫資源可能導致性能下降，並可能導致應用程序與數據庫的通信出現問題。\n"
        },
        "ODR_OPEN_DATABASE_RESOURCE_EXCEPTION_PATH": {
            "ShortDescription": "方法在異常情況下可能未關閉數據庫資源",
            "LongDescription": "{1} 在異常情況下可能未關閉數據庫資源",
            "Details": "該方法創建了一個數據庫資源（如數據庫連接或行集），\n未將其分配給任何字段，未傳遞給其他方法或返回，並且在所有異常路徑中似乎未關閉該對象。未能在所有路徑中關閉數據庫資源可能導致性能下降，並可能導致應用程序與數據庫的通信出現問題。"
        },
        "SBSC_USE_STRINGBUFFER_CONCATENATION": {
            "ShortDescription": "方法在循環中使用 + 連接字符串",
            "LongDescription": "{1} 在循環中使用 + 連接字符串",
            "Details": "該方法似乎在循環中使用連接方式構建字符串。\n在每次迭代中，字符串被轉換為 StringBuffer/StringBuilder，進行追加，然後轉換回字符串。這會導致與迭代次數成二次方的成本，因為在每次迭代中，增長的字符串會被重新複製。通過顯式使用 StringBuffer（或 Java 5 中的 StringBuilder）可以獲得更好的性能。例如：// 這不好\nString s = \"\";\nfor (int i = 0; i < field.length; ++i) { s = s + field[i];\n}\n\n// 這樣更好\nStringBuffer buf = new StringBuffer();\nfor (int i = 0; i < field.length; ++i) { buf.append(field[i]);\n}\nString s = buf.toString();\n"
        },
        "IIL_PREPARE_STATEMENT_IN_LOOP": {
            "ShortDescription": "方法在循環中調用 prepareStatement",
            "LongDescription": "{1} 在循環中以常量參數調用 prepareStatement",
            "Details": "該方法在循環中調用 Connection.prepareStatement，傳遞常量參數。\n如果 PreparedStatement 應該多次執行，就沒有必要在每次循環迭代時重新創建它。\n將此調用移到循環外部。"
        },
        "IIL_ELEMENTS_GET_LENGTH_IN_LOOP": {
            "ShortDescription": "在循環中調用 NodeList.getLength()",
            "LongDescription": "{1} 在循環中調用 NodeList.getLength()，用於 getElementsByTagName 的返回值",
            "Details": "該方法在循環中調用 NodeList.getLength()，而 NodeList 是通過 getElementsByTagName 調用生成的。\n這個 NodeList 不存儲其長度，而是在每次調用時都會以不太理想的方式計算。\n考慮在循環之前將長度存儲到變量中。\n"
        },
        "IIL_PATTERN_COMPILE_IN_LOOP": {
            "ShortDescription": "方法在循環中調用 Pattern.compile",
            "LongDescription": "{1} 在循環中用常量參數調用 Pattern.compile",
            "Details": "該方法在循環中調用 Pattern.compile，傳遞常量參數。\n如果該模式要使用多次，就沒有必要在每次循環迭代時編譯它。\n將此調用移到循環外部，甚至移動到靜態最終字段。"
        },
        "IIL_PATTERN_COMPILE_IN_LOOP_INDIRECT": {
            "ShortDescription": "方法在循環中編譯正則表達式",
            "LongDescription": "{1} 在循環中編譯正則表達式",
            "Details": "該方法在循環中創建相同的正則表達式，因此每次迭代都將編譯。\n將首先使用 Pattern.compile 在循環外編譯該正則表達式，將更具優化。"
        },
        "IIO_INEFFICIENT_INDEX_OF": {
            "ShortDescription": "低效使用 String.indexOf(String)",
            "LongDescription": "{1} 使用 String.indexOf(String) 而不是 String.indexOf(int)",
            "Details": "該代碼將常量字符串（長度為 1）傳遞給 String.indexOf()。\n使用 String.indexOf() 的整數實現更為高效。\n例如，調用而不是"
        },
        "IIO_INEFFICIENT_LAST_INDEX_OF": {
            "ShortDescription": "低效使用 String.lastIndexOf(String)",
            "LongDescription": "{1} 使用 String.lastIndexOf(String) 而不是 String.lastIndexOf(int)",
            "Details": "該代碼將常量字符串（長度為 1）傳遞給 String.lastIndexOf()。\n使用 String.lastIndexOf() 的整數實現更為高效。\n例如，調用而不是"
        },
        "ITA_INEFFICIENT_TO_ARRAY": {
            "ShortDescription": "方法使用了帶有零長度數組參數的 toArray()",
            "LongDescription": "{1} 使用了帶有零長度數組參數的 Collection.toArray()",
            "Details": "該方法使用了派生類的 toArray() 方法，並傳入了一個零長度的原型數組參數。更高效的做法是使用\nmyCollection.toArray(new Foo[myCollection.size()])\n如果傳入的數組足夠大以存儲集合中的所有元素，那麼它將被填充並直接返回。這避免了通過反射創建第二個數組作為結果。"
        },
        "IJU_ASSERT_METHOD_INVOKED_FROM_RUN_METHOD": {
            "ShortDescription": "在運行方法中進行的 JUnit 斷言將不會被 JUnit 發現",
            "LongDescription": "在 {1} 中，JUnit 斷言將不會被 JUnit 發現",
            "Details": "在一個運行方法中執行了 JUnit 斷言。失敗的 JUnit 斷言只會導致異常被拋出。\n因此，如果此異常發生在調用測試方法的線程以外的線程中，該異常將終止該線程，但不會導致測試失敗。\n"
        },
        "IJU_SETUP_NO_SUPER": {
            "ShortDescription": "TestCase 定義的 setUp 沒有調用 super.setUp()",
            "LongDescription": "TestCase {0} 定義的 setUp 沒有調用 super.setUp()",
            "Details": "該類是 JUnit TestCase，並實現了 setUp 方法。setUp 方法應調用\nsuper.setUp()，但沒有調用。"
        },
        "IJU_TEARDOWN_NO_SUPER": {
            "ShortDescription": "TestCase 定義的 tearDown 沒有調用 super.tearDown()",
            "LongDescription": "TestCase {0} 定義的 tearDown 沒有調用 super.tearDown()",
            "Details": "該類是 JUnit TestCase，並實現了 tearDown 方法。tearDown 方法應調用\nsuper.tearDown()，但沒有調用。"
        },
        "IJU_SUITE_NOT_STATIC": {
            "ShortDescription": "TestCase 實現了非靜態的 suite 方法",
            "LongDescription": "TestCase {0} 實現了一個非靜態的 suite 方法",
            "Details": "該類是 JUnit TestCase，並實現了 suite() 方法。suite 方法應被聲明為靜態，但沒有被聲明為靜態。"
        },
        "IJU_BAD_SUITE_METHOD": {
            "ShortDescription": "TestCase 聲明了一個錯誤的 suite 方法",
            "LongDescription": "在 {0} 中，suite 方法的聲明錯誤",
            "Details": "該類是 JUnit TestCase，並定義了 suite() 方法。但是，suite 方法需要聲明為\npublic static junit.framework.Test suite()\n或 public static junit.framework.TestSuite suite()"
        },
        "IJU_NO_TESTS": {
            "ShortDescription": "TestCase 沒有測試",
            "LongDescription": "TestCase {0} 沒有測試",
            "Details": "該類是 JUnit TestCase，但沒有實現任何測試方法。"
        },
        "BOA_BADLY_OVERRIDDEN_ADAPTER": {
            "ShortDescription": "類錯誤地重寫了超類 Adapter 中實現的方法",
            "LongDescription": "類 {0} 錯誤地重寫了超類 Adapter 中實現的方法 {1}",
            "Details": "該方法重寫了父類中的一個方法，而該父類是一個實現了 java.awt.event 或 javax.swing.event 包中定義的監聽器的適配器。因此，當事件發生時，此方法將不會被調用。"
        },
        "BRSA_BAD_RESULTSET_ACCESS": {
            "deprecated": "true",
            "ShortDescription": "方法嘗試訪問索引為 0 的結果集字段",
            "LongDescription": "{1} 嘗試訪問索引為 0 的結果集字段",
            "Details": "對結果集的 getXXX 或 updateXXX 方法的調用 where 字段索引為 0。由於 ResultSet 字段從索引 1 開始，因此這始終是一個錯誤。"
        },
        "SQL_BAD_RESULTSET_ACCESS": {
            "ShortDescription": "方法嘗試訪問索引為 0 的結果集字段",
            "LongDescription": "{1} 嘗試訪問索引為 0 的結果集字段",
            "Details": "對結果集的 getXXX 或 updateXXX 方法的調用 where 字段索引為 0。由於 ResultSet 字段從索引 1 開始，因此這始終是一個錯誤。"
        },
        "SQL_BAD_PREPARED_STATEMENT_ACCESS": {
            "ShortDescription": "方法嘗試訪問索引為 0 的預編譯語句參數",
            "LongDescription": "{1} 嘗試訪問索引為 0 的預編譯語句參數",
            "Details": "對預編譯語句的 setXXX 方法的調用，其中參數索引為 0。由於參數索引從索引 1 開始，因此這始終是一個錯誤。"
        },
        "SIO_SUPERFLUOUS_INSTANCEOF": {
            "ShortDescription": "使用 instanceof 運算符進行不必要的類型檢查",
            "LongDescription": "{1} 進行不必要的類型檢查，使用 instanceof 運算符可以靜態確定",
            "Details": "使用 instanceof 運算符執行類型檢查，但可以靜態確定對象是否屬於請求的類型。"
        },
        "BAC_BAD_APPLET_CONSTRUCTOR": {
            "ShortDescription": "不合適的 Applet 構造函數依賴於未初始化的 AppletStub",
            "LongDescription": "不合適的 Applet 構造函數依賴於未初始化的 AppletStub",
            "Details": "該構造函數調用父類 Applet 中依賴於 AppletStub 的方法。由於 AppletStub 只有在調用此 applet 的 init() 方法後才會被初始化，因此這些方法無法正確執行。\n"
        },
        "EC_ARRAY_AND_NONARRAY": {
            "ShortDescription": "使用 equals() 比較數組和非數組",
            "LongDescription": "在 {1} 中調用 {3.simpleClass}.equals({2.simpleClass})",
            "Details": "該方法調用 .equals(Object o) 來比較一個數組和似乎不是數組的引用。如果被比較的對象類型不同，它們保證不相等，比較幾乎肯定是個錯誤。即使它們都是數組，數組上的該方法也僅僅確定兩個數組是否是同一對象。\n要比較數組的內容，請使用 java.util.Arrays.equals(Object[], Object[])"
        },
        "EC_BAD_ARRAY_COMPARE": {
            "ShortDescription": "對數組調用 equals()，這相當於 ==",
            "LongDescription": "在 {1} 中使用 .equals 比較兩個 {2.simpleClass}（等價於 ==）",
            "Details": "該方法在數組上調用 .equals(Object o) 方法。由於數組沒有重寫 Object 的 equals 方法，因此在數組上調用 equals 與比較它們的地址是相同的。要比較數組的內容，請使用 java.util.Arrays.equals(Object[], Object[])。\n比較數組的地址，最好顯式檢查指針相等性。"
        },
        "EC_INCOMPATIBLE_ARRAY_COMPARE": {
            "ShortDescription": "使用 equals(...) 比較不兼容的數組",
            "LongDescription": "在 {1} 中使用 equals 比較 {2.simpleClass} 和 {3.simpleClass}",
            "Details": "該方法調用 .equals(Object o) 比較兩個數組，但數組類型不兼容（例如，String[] 和 StringBuffer[]，或 String[] 和 int[]）。它們將永遠不相等。此外，當使用 equals(...) 比較數組時，它僅檢查它們是否是同一個數組，忽略數組的內容。\n"
        },
        "STI_INTERRUPTED_ON_CURRENTTHREAD": {
            "ShortDescription": "對 currentThread() 的不必要調用以便調用 interrupted()",
            "LongDescription": "{1} 進行了一次不必要的調用 currentThread() 只是為了調用 interrupted()",
            "Details": "該方法調用了 currentThread()，只是為了調用 interrupted() 方法。由於 interrupted() 是靜態方法，因此使用更簡單明瞭的方法更好。"
        },
        "STI_INTERRUPTED_ON_UNKNOWNTHREAD": {
            "ShortDescription": "對線程實例調用靜態 Thread.interrupted() 方法",
            "LongDescription": "{1} 在線程實例上調用靜態 Thread.interrupted() 方法",
            "Details": "該方法在一個看似不是當前線程的 Thread 對象上調用了 Thread.interrupted() 方法。由於 interrupted() 方法是靜態的，interrupted 方法將被調用到與作者意圖不同的對象上。\n"
        },
        "IP_PARAMETER_IS_DEAD_BUT_OVERWRITTEN": {
            "ShortDescription": "方法進入時參數為死參數但被覆蓋",
            "LongDescription": "進入 {1} 的參數 {2} 是死參數但被覆蓋",
            "Details": "此參數的初始值被忽略，並在此處被覆蓋。這通常表明錯誤的信念，即\nthe 對參數的寫入將被傳回給調用者。\n"
        },
        "DLS_DEAD_LOCAL_STORE_SHADOWS_FIELD": {
            "ShortDescription": "對局部變量的死存儲遮蔽字段",
            "LongDescription": "在 {1} 中對 {2} 的死存儲，而不是同名字段",
            "Details": "此指令將值分配給局部變量，\n但該值在後續指令中未被讀取或使用。\n這通常指示錯誤，因為計算出的值從未被使用。存在一個與局部變量同名的字段。您是想將值賦給那個變量嗎？\n"
        },
        "DLS_DEAD_LOCAL_STORE": {
            "ShortDescription": "對局部變量的死存儲",
            "LongDescription": "在 {1} 中對 {2} 的死存儲",
            "Details": "此指令將值分配給局部變量，\n但該值在後續指令中未被讀取或使用。\n這通常指示錯誤，因為計算出的值從未被使用。\n\n請注意，Sun 的 javac 編譯器通常為最終局部變量生成死存儲。由於 SpotBugs 是一個基於字節碼的工具，\n沒有簡單的方法來消除此類誤報。\n"
        },
        "DLS_DEAD_LOCAL_STORE_IN_RETURN": {
            "ShortDescription": "返回語句中的無用賦值",
            "LongDescription": "來自 {1} 的返回中的無用賦值",
            "Details": "該語句在返回語句中對局部變量進行了賦值。此賦值\n沒有效果。請驗證該語句是否正確。\n"
        },
        "DLS_DEAD_LOCAL_INCREMENT_IN_RETURN": {
            "ShortDescription": "返回語句中的無用自增",
            "LongDescription": "來自 {1} 的返回中的無用自增",
            "Details": "該語句有一個返回，例如 return x++;/return x--;。\n後綴自增/自減對表達式的值沒有影響，\n因此此自增/自減沒有效果。\n請驗證該語句是否正確。\n"
        },
        "DLS_DEAD_STORE_OF_CLASS_LITERAL": {
            "ShortDescription": "類字面量的死存儲",
            "LongDescription": "在 {1} 中的 {3}.class 的死存儲",
            "Details": "該指令將類字面量分配給變量，然後從未使用。\n<a href=\"http://www.oracle.com/technetwork/java/javase/compatibility-137462.html#literal\">在 Java 1.4 和 Java 5 中，這種行為有所不同。\n在 Java 1.4 及更早版本中，對引用的使用會強制執行靜態初始化程序，如果已經執行過則不會。\n在 Java 5 及更高版本中，則不會。\n有關更多詳細信息和示例，請參閱 Oracle <a href=\"http://www.oracle.com/technetwork/java/javase/compatibility-137462.html#literal\">關於 Java SE 兼容性</a>的文章，並獲取有關如何在 Java 5 以上強制類初始化的建議。\n"
        },
        "DLS_DEAD_LOCAL_STORE_OF_NULL": {
            "ShortDescription": "將 null 存儲到局部變量的死存儲",
            "LongDescription": "在 {1} 中對 {2} 的死存儲為 null",
            "Details": "代碼將 null 存儲到局部變量中，存儲的值沒有被讀取。此存儲可能是為了輔助垃圾收集器引入的，但\n自從 Java SE 6.0 以來，這不再需要或有用。\n"
        },
        "MF_METHOD_MASKS_FIELD": {
            "ShortDescription": "方法定義一個變量，遮蔽了字段",
            "LongDescription": "{1} 定義了一個變量，遮蔽了字段 {2.givenClass}",
            "Details": "該方法定義了一個局部變量，名稱與該類或超類中的字段相同。\n這可能導致該方法從字段中讀取未初始化的值，使字段保持未初始化狀態，或者兩者都有。"
        },
        "MF_CLASS_MASKS_FIELD": {
            "ShortDescription": "類定義了一個字段，遮蔽了超類字段",
            "LongDescription": "字段 {1.givenClass} 遮蔽了超類 {2.class} 中的字段",
            "Details": "該類定義了一個字段，名稱與超類中可見的實例字段相同。\n這會造成混淆，並且如果方法在訪問一個字段時想要訪問另一個字段，則可能會導致錯誤。"
        },
        "WMI_WRONG_MAP_ITERATOR": {
            "ShortDescription": "低效使用 keySet 迭代器而不是 entrySet 迭代器",
            "LongDescription": "{1} 低效使用了 keySet 迭代器而不是 entrySet 迭代器",
            "Details": "該方法訪問 Map 條目的值，使用從 keySet 迭代器檢索的鍵。使用 map 的 entrySet 上的迭代器更高效，以避免 Map.get(key) 查找。"
        },
        "ISC_INSTANTIATE_STATIC_CLASS": {
            "ShortDescription": "不必要的實例化僅提供靜態方法的類",
            "LongDescription": "{1} 不必要地實例化一個僅提供靜態方法的類",
            "Details": "該類分配了一個基於僅提供靜態方法的類的對象。此對象\n沒有必要創建，只需使用類名作為限定符直接訪問靜態方法。"
        },
        "REC_CATCH_EXCEPTION": {
            "ShortDescription": "捕獲異常，但並未拋出異常",
            "LongDescription": "在 {1} 中捕獲異常，但並未拋出異常",
            "Details": "該方法使用了一個捕獲異常對象的 try-catch 塊，但在 try 塊內未拋出異常，且沒有顯式捕獲 RuntimeException。常見的錯誤模式是這樣寫 try { ... } catch (Exception e) { something } 作為捕獲多種類型異常的簡寫，每種 catch 塊是相同的，但這種構造也會意外捕獲 RuntimeException，從而掩蓋潛在的錯誤。更好的做法是顯式捕獲拋出的特定異常，或顯式捕獲 RuntimeException，重新拋出，然後捕獲所有非 Runtime 異常，如下所示：try { ...\n} catch (RuntimeException e) { throw e;\n} catch (Exception e) { ... 處理所有非運行時異常 ...\n}\n"
        },
        "DCN_NULLPOINTER_EXCEPTION": {
            "ShortDescription": "捕獲了 NullPointerException",
            "LongDescription": "請不要像在 {1} 中那樣捕獲 NullPointerException",
            "Details": "\n根據 SEI Cert 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR08-J.+Do+not+catch+NullPointerException+or+any+of+its+ancestors\">ERR08-J</a>，NullPointerException 不應被捕獲。處理 NullPointerException 被視為一個不如 null 檢查的低劣替代方案。\n\n這個不合規代碼捕獲了一個 NullPointerException 來檢查傳入的參數是否為 null：\n\nboolean hasSpace(String m) { try { String ms[] = m.split(\" \"); return names.length != 1; } catch (NullPointerException e) { return false; }\n}\n\n合規的解決方案是使用 null 檢查，如以下示例所示：\n\nboolean hasSpace(String m) { if (m == null) return false; String ms[] = m.split(\" \"); return names.length != 1;\n}\n"
        },
        "FE_TEST_IF_EQUAL_TO_NOT_A_NUMBER": {
            "ShortDescription": "對 NaN 的絕望等值測試",
            "LongDescription": "在 {1} 中對 NaN 的絕望等值測試",
            "Details": "該代碼檢查浮點值是否等於特殊的 Not A Number 值（例如，如果 (x == Double.NaN)）。然而，由於的特殊語義，沒有值等於，包括。結果是，x == Double.NaN 始終計算為 false。\n要檢查值是否為特殊的 Not A Number 值，使用（或如果是浮點精度）。"
        },
        "FE_FLOATING_POINT_EQUALITY": {
            "ShortDescription": "浮點等值測試",
            "LongDescription": "在 {1} 中進行的浮點等值測試",
            "Details": "該操作將兩個浮點值進行等值比較。由於浮點計算可能涉及四捨五入，因此計算的 float 和 double 值可能不精確。對於必須精確的值，例如貨幣值，考慮使用固定精度類型，例如 BigDecimal。對於不需要精確的值，考慮在某個範圍內比較等值，例如：if ( Math.abs(x - y) &lt; .0000001 )。請參見 Java 語言規範，第 4.2.4 節。"
        },
        "UM_UNNECESSARY_MATH": {
            "ShortDescription": "方法對常量值調用靜態 Math 類方法",
            "LongDescription": "方法對常量值調用靜態 Math 類方法",
            "Details": "該方法在常量值上使用 java.lang.Math 的靜態方法。在這種情況下，這個方法的結果可以靜態確定，並且使用常量的方式更快，且有時更精確。檢測到的方法有：\n0.0 或 1.0"
        },
        "CD_CIRCULAR_DEPENDENCY": {
            "ShortDescription": "類之間的循環依賴測試",
            "LongDescription": "類 {0} 與其他類之間存在循環依賴",
            "Details": "該類與其他類之間存在循環依賴。這使得構建這些類變得困難，因為每個類都依賴於另一個類才能正確構建。考慮使用接口來打破這種強依賴。"
        },
        "RI_REDUNDANT_INTERFACES": {
            "ShortDescription": "類實現與超類相同的接口",
            "LongDescription": "類 {0} 實現與超類相同的接口",
            "Details": "該類聲明它實現了一個超類也實現的接口。這是冗餘的，因為一旦超類實現了一個接口，所有子類默認也實現該接口。這可能表明自該類創建以來，繼承層次結構已更改，應考慮接口實現的歸屬。"
        },
        "MTIA_SUSPECT_STRUTS_INSTANCE_FIELD": {
            "ShortDescription": "類擴展 Struts Action 類並使用實例變量",
            "LongDescription": "類 {0} 擴展 Struts Action 類並使用實例變量",
            "Details": "該類從 Struts Action 類擴展，並使用實例成員變量。由於由 Struts 框架創建的 Struts Action 類僅創建一個實例，並以多線程方式使用，因此這種范式是高度不推薦的，且可能出現問題。僅考慮使用方法局部變量。"
        },
        "MTIA_SUSPECT_SERVLET_INSTANCE_FIELD": {
            "ShortDescription": "類擴展 Servlet 類並使用實例變量",
            "LongDescription": "類 {0} 擴展 Servlet 類並使用實例變量",
            "Details": "該類從 Servlet 類擴展，並使用實例成員變量。由於由 J2EE 框架創建的 Servlet 類僅創建一個實例，並以多線程方式使用，因此這種范式是高度不推薦的，且可能出現問題。僅考慮使用方法局部變量。"
        },
        "PS_PUBLIC_SEMAPHORES": {
            "ShortDescription": "類在其公共接口中暴露同步和信號量",
            "LongDescription": "類 {0} 在其公共接口中暴露同步和信號量",
            "Details": "該類在自身（this 引用）上使用同步及 wait()、notify() 或 notifyAll()。使用該類的客戶端類可能還會將該類的實例用作同步對象。由於兩個類使用相同對象進行同步，多線程的正確性可疑。您不應在公共引用上進行同步或調用信號量方法。考慮使用內部私有成員變量來控制同步。"
        },
        "ICAST_INTEGER_MULTIPLY_CAST_TO_LONG": {
            "ShortDescription": "將整型乘法結果強制轉換為長整型",
            "LongDescription": "在 {1} 中將整型乘法結果強制轉換為長整型",
            "Details": "該代碼執行整型乘法，然後將結果轉換為長整型，例如：long convertDaysToMilliseconds(int days) { return 1000*3600*24*days; }\n\n如果使用長整型數學運算進行乘法，可以避免結果溢出的可能性。例如，您可以修復上述代碼為：long convertDaysToMilliseconds(int days) { return 1000L*3600*24*days; }\nstatic final long MILLISECONDS_PER_DAY = 24L*3600*1000;\nlong convertDaysToMilliseconds(int days) { return days * MILLISECONDS_PER_DAY; }\n"
        },
        "ICAST_INT_2_LONG_AS_INSTANT": {
            "ShortDescription": "int 值轉換為 long 並作為絕對時間使用",
            "LongDescription": "在 {1} 中，int 轉換為 long 並作為絕對時間傳遞給 {2}",
            "Details": "\n該代碼將一個 32 位的 int 值轉換為 64 位的 long 值，然後將該值作為需要絕對時間值的方法參數傳遞。\n絕對時間值是自標準基礎時間 \"紀元\"（即 1970 年 1 月 1 日，00:00:00 GMT）以來的毫秒數。\n例如，以下方法意圖將紀元以來的秒數轉換為日期，但實現存在嚴重問題：Date getDate(int seconds) { return new Date(seconds * 1000); }\n乘法使用 32 位算術進行運算，然後轉換為 64 位值。\n當 32 位值被轉換為 64 位並用於表示絕對時間值時，只能表示 1969 年 12 月和 1970 年 1 月的日期。\n上述方法的正確實現是：// 在 2037 年之後將失敗\nDate getDate(int seconds) { return new Date(seconds * 1000L); }\n\n// 更好，適用於所有日期\nDate getDate(long seconds) { return new Date(seconds * 1000); }\n"
        },
        "ICAST_INT_CAST_TO_FLOAT_PASSED_TO_ROUND": {
            "ShortDescription": "int 值轉換為 float 後傳遞給 Math.round",
            "LongDescription": "int 值轉換為 float 後在 {1} 中傳遞給 Math.round",
            "Details": "\n該代碼將一個 int 值轉換為浮點精度的浮點數，然後將結果傳遞給 Math.round() 函數，該函數返回最接近的 int/long 值。\n此操作應始終無效，因為將整數轉換為浮點數應該產生無小數部分的數字。\n生成要傳遞給 Math.round 的值的操作可能是希望使用浮點算術進行。\n"
        },
        "ICAST_INT_CAST_TO_DOUBLE_PASSED_TO_CEIL": {
            "ShortDescription": "整型值轉換為 double 後傳遞給 Math.ceil",
            "LongDescription": "整型值在 {1} 中轉換為 double 後傳遞給 Math.ceil",
            "Details": "\n該代碼將整型值（例如，int 或 long）轉換為雙精度浮點數，並將結果傳遞給 Math.ceil() 函數，該函數將雙精度浮點數四捨五入到下一個更高的整數值。\n此操作應始終無效，因為將整數轉換為雙精度浮點數應該產生無小數部分的數字。\n生成要傳遞給 Math.ceil 的值的操作可能是希望使用雙精度浮點算術進行。\n"
        },
        "ICAST_IDIV_CAST_TO_DOUBLE": {
            "ShortDescription": "整型除法結果轉換為 double 或 float",
            "LongDescription": "在 {1} 中整型除法結果轉換為 double 或 float",
            "Details": "\n該代碼將整型除法（例如，int 或 long 除法）操作的結果強制轉換為 double 或 float。\n對整數進行除法會將結果截斷為最接近零的整數值。結果被強制轉換為 double 表明應該保留這一精度。\n可能想到的是將一個或兩個操作數強制轉換為 double 以執行除法。以下是一個示例：\nint x = 2;\nint y = 5;\n// 錯誤：產生結果 0.0\ndouble value1 = x / y;\n\n// 正確：產生結果 0.4\ndouble value2 = x / (double) y;\n"
        },
        "J2EE_STORE_OF_NON_SERIALIZABLE_OBJECT_INTO_SESSION": {
            "ShortDescription": "將不可序列化對象存入 HttpSession",
            "LongDescription": "在 {1} 中將不可序列化的 {2} 存入 HttpSession",
            "Details": "\n該代碼似乎正在將不可序列化的對象存儲到 HttpSession 中。\n如果該會話被掛起或遷移，將會導致錯誤。\n"
        },
        "DMI_NONSERIALIZABLE_OBJECT_WRITTEN": {
            "ShortDescription": "不可序列化對象寫入 ObjectOutput",
            "LongDescription": "在 {1} 中寫入不可序列化的 {2} 到 ObjectOutput",
            "Details": "\n該代碼似乎正在傳遞一個不可序列化的對象給 ObjectOutput.writeObject 方法。\n如果該對象確實不可序列化，將會導致錯誤。\n"
        },
        "VA_FORMAT_STRING_USES_NEWLINE": {
            "ShortDescription": "格式字符串應使用 %n 而不是 \\n",
            "LongDescription": "在 {1} 中格式字符串應使用 %n 而不是 \\n",
            "Details": "\n該格式字符串包含換行符 (\\n)。在格式字符串中，通常使用 %n 更可取，因為它將生成平台特定的行分隔符。當使用 Java 15 引入的文本塊時，使用轉義序列：\n\t \nString value = \"\"\" first line%n\\ second line%n\\ \"\"\";"
        },
        "FS_BAD_DATE_FORMAT_FLAG_COMBO": {
            "ShortDescription": "日期格式字符串可能導致意外行為",
            "LongDescription": "在 {1.nameAndSignature} 中，'{3}' 日期格式字符串可能導致意外行為",
            "Details": "該格式字符串包含不良的標誌組合，可能導致意外行為。潛在的不良組合包括：將周年（\"Y\"）與年份中的月份（\"M\"）和月份中的天（\"d\"）結合使用，而未指定年份中的周（\"w\"）。此處鼠標標誌（\"y\"）可能更合適；使用 AM/PM 小時（\"h\" 或 \"K\"）而未指定 AM/PM 標誌（\"a\"）或白晝標誌（\"B\"）；使用 24 小時制小時（\"H\" 或 \"k\"）與 AM/PM 標誌或白晝標誌一起使用；同時使用一天的毫秒（\"A\"）和小時（\"H\"、\"h\"、\"K\"、\"k\"）和/或分鐘（\"m\"）和/或秒（\"s\"）；同時使用一天的毫秒（\"A\"）和一天納秒（\"N\"）；同時使用秒的分數（\"S\"）、納秒（\"n\"）；同時使用 AM/PM 標誌（\"a\"）和白晝標誌（\"B\"）；同時使用年份（\"y\"）和年代（\"u\"）等。"
        },
        "VA_PRIMITIVE_ARRAY_PASSED_TO_OBJECT_VARARG": {
            "ShortDescription": "原始數組傳遞給期望可變數量對象參數的函數",
            "LongDescription": "{2} 傳遞給 varargs 方法 {3} 在 {1}",
            "Details": "\n該代碼將原始數組傳遞給一個接收可變數量對象參數的函數。\n這創建了一個長度為 1 的數組來容納原始數組，並將其傳遞給該函數。\n"
        },
        "BC_EQUALS_METHOD_SHOULD_WORK_FOR_ALL_OBJECTS": {
            "ShortDescription": "equals 方法不應假設其參數的類型",
            "LongDescription": "{0} 的 equals 方法假設參數類型為 {0.givenClass}",
            "Details": "\nequals(Object o) 方法不應對類型做任何假設。\n如果不是同一類型，則應簡單地返回 false。"
        },
        "BC_BAD_CAST_TO_ABSTRACT_COLLECTION": {
            "ShortDescription": "對抽象集合的不當轉換",
            "LongDescription": "在 {1} 中從 Collection 轉換到抽象類 {3} 的不當轉換",
            "Details": "\n該代碼將 Collection 強制轉換為一個抽象集合（例如，Collection、List 或 Set）。\n確保您確保對象是要轉換的類型。\n如果您只需要能夠遍歷集合，則不需要將其轉換為 Set 或 List。\n"
        },
        "BC_IMPOSSIBLE_CAST_PRIMITIVE_ARRAY": {
            "ShortDescription": "對原始數組的不可能強制轉換",
            "LongDescription": "在 {1} 中涉及原始數組的不可能強制轉換",
            "Details": "\n該強制轉換將始終拋出 ClassCastException。\n"
        },
        "BC_IMPOSSIBLE_CAST": {
            "ShortDescription": "不可能的強制轉換",
            "LongDescription": "在 {1} 中從 {2} 強制轉換到 {3} 的不可能強制轉換",
            "Details": "\n該強制轉換將始終拋出 ClassCastException。\nSpotBugs 根據 instanceof 檢查跟踪類型信息，並使用更精確的信息關於方法返回的值和從字段加載的值的類型。\n因此，它可能比僅聲明的變量類型具有更準確的信息，並可以利用這一點來確定\n該強制轉換將始終在運行時拋出異常。\n"
        },
        "BC_IMPOSSIBLE_DOWNCAST": {
            "ShortDescription": "不可能的降級轉換",
            "LongDescription": "在 {1} 中從 {2} 降級到 {3} 的不可能降級轉換",
            "Details": "\n該強制轉換將始終拋出 ClassCastException。\n分析認為能夠精確知道正在強制轉換的值的類型，\n嘗試下轉為子類型將始終因拋出 ClassCastException 而失敗。\n"
        },
        "BC_IMPOSSIBLE_DOWNCAST_OF_TOARRAY": {
            "ShortDescription": "toArray() 結果的不可能降級轉換",
            "LongDescription": "在 {1} 中對 toArray() 結果的不可能降級轉換到 {3}",
            "Details": "\n該代碼將對集合的調用結果的返回類型強制轉換為一種比 Collection 更具體的類型。\n例如：String[] getAsArray(Collection&lt;String&gt; c) { return (String[]) c.toArray();\n}\n這通常會因拋出 ClassCastException 而失敗。\n幾乎所有集合的 .toArray() 都返回一個 Object[]。\n它們實際上無法做任何其他事情，\n因為集合對象沒有對集合聲明的泛型類型的引用。\n從集合獲取特定類型的數組的正確方法是使用 c.toArray(new String[0]); 或 c.toArray(new String[c.size()]);（前者在 <a href=\"https://shipilev.net/blog/2016/arrays-wisdom-ancients/#_historical_perspective\">自 Java 6 更新以來效率稍高</a>）。\n有一個常見/已知的例外。\n通過將 List 的 .toArray 方法返回的數組將返回一個協變類型的數組。\n例如，Arrays.asArray(new String[] { \"a\" }).toArray() 將返回一個 String[] 。 \nSpotBugs 嘗試檢測和抑制這種情況，但可能會漏掉一些。\n"
        },
        "NP_NULL_INSTANCEOF": {
            "ShortDescription": "已知的 null 值檢查是否為某類型的實例",
            "LongDescription": "在 {1} 中檢查已知的 null 值是否為 {2} 的實例",
            "Details": "\n這個 instanceof 測試將始終返回 false，因為被檢查的值已保證為 null。\n儘管這很安全，但請確保這不是誤解或其他邏輯錯誤的跡象。\n"
        },
        "BC_NULL_INSTANCEOF": {
            "deprecated": "true",
            "ShortDescription": "已知的 null 值檢查是否為某類型的實例",
            "LongDescription": "在 {1} 中檢查已知的 null 值是否為 {2} 的實例",
            "Details": "\n這個 instanceof 測試將始終返回 false，因為被檢查的值已保證為 null。\n儘管這很安全，但請確保這不是誤解或其他邏輯錯誤的跡象。\n"
        },
        "BC_IMPOSSIBLE_INSTANCEOF": {
            "ShortDescription": "instanceof 將始終返回 false",
            "LongDescription": "在 {1} 中，instanceof 將始終返回 false，因為 {2} 不能是 {3}",
            "Details": "\n這個 instanceof 測試將始終返回 false。儘管這很安全，但請確保這不是\n誤解或其他邏輯錯誤的跡象。\n"
        },
        "BC_VACUOUS_INSTANCEOF": {
            "ShortDescription": "instanceof 將始終返回 true",
            "LongDescription": "在 {1} 中，instanceof 將始終對所有非空值返回 true，因為所有 {2} 都是 {3} 的實例",
            "Details": "\n這個 instanceof 測試將始終返回 true（除非被測試的值為 null）。\n儘管這很安全，但請確保這不是\n誤解或其他邏輯錯誤的跡象。\n如果您真的想測試值是否為 null，可能直接測試 null 會更清晰。\n"
        },
        "BC_UNCONFIRMED_CAST": {
            "ShortDescription": "未经检查/确认的转换",
            "LongDescription": "在 {1} 中从 {2} 到 {3} 的未经检查/确认的转换",
            "Details": "\n该转换是未经检查的，并且并不是所有来自类型的实例都可以转换为被强制转换的类型。检查您的程序逻辑以确保此\n转换不会失败。\n"
        },
        "BC_UNCONFIRMED_CAST_OF_RETURN_VALUE": {
            "ShortDescription": "對方法返回值的未经检查/确认的转化",
            "LongDescription": "在 {1} 中从 {2} 到 {3} 的未经检查/确认的转化",
            "Details": "\n该代码对方法的返回值执行了未经检查的转化。\n代码可能以某种方式调用该方法，保证该转化是\n安全的，但 SpotBugs 无法验证该转化是否安全。检查您的程序逻辑以确保此\n转化不会失败。\n"
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
            "Details": "\n该代码使用\n其中需要正则表达式。这将在 Windows 平台上失败，\n因为 \\ 是反斜杠，在正则表达式中被解释为转义字符。除了其他选择，您可以简单地使用\n File.separatorChar=='\\\\' ? \"\\\\\\\\\" : File.separator\n而不是\n"
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
            "ShortDescription": "值與不兼容的類型限定符進行比較",
            "LongDescription": "值被標註為具有類型限定符 {2.simpleName}，與一個永不具有該限定符的值進行相等比較",
            "Details": "將一個指定為攜帶類型限定符註釋的值與一個永遠不攜帶該限定符的值進行比較。更確切地說，帶有指定為 when=ALWAYS 的類型限定符的值與帶有相同類型限定符指定為 when=NEVER 的值進行比較。例如，假設 @NonNegative 是 when=When.NEVER 的類型限定符註釋 @Negative 的暱稱。以下代碼將生成此警告，因為返回語句需要 @NonNegative 值，但接收的是標記為 @Negative 的值。public boolean example(@Negative Integer value1, @NonNegative Integer value2) { return value1.equals(value2);\n}"
        },
        "TQ_ALWAYS_VALUE_USED_WHERE_NEVER_REQUIRED": {
            "ShortDescription": "標註為攜帶類型限定符的值在必須不攜帶該限定符的地方被使用",
            "LongDescription": "標註為攜帶類型限定符 {2.simpleName} 的值用於必須不攜帶該限定符的地方",
            "Details": "一個標註為攜帶類型限定符註釋的值在一個或多個位置被消耗，在這些位置要求該值不攜帶該註釋。更確切地說，帶有指定為 when=ALWAYS 的類型限定符的值被確保達到一個或多個該類型限定符指定為 when=NEVER 的使用位置。例如，假設 @NonNegative 是 when=When.NEVER 的類型限定符 @Negative 的暱稱。以下代碼將生成此警告，因為返回語句要求 @NonNegative 值，但接收到的是標記為 @Negative 的值。public @NonNegative Integer example(@Negative Integer value) { return value;\n}"
        },
        "TQ_UNKNOWN_VALUE_USED_WHERE_ALWAYS_STRICTLY_REQUIRED": {
            "ShortDescription": "沒有類型限定符的值在嚴格要求須具有該限定符的地方被使用",
            "LongDescription": "沒有類型限定符的值在需要具有 {2.simpleName} 註釋的地方被使用",
            "Details": "某個值以要求其帶有類型限定符的方式被使用。該類型限定符是嚴格的，因此工具拒絕任何不具有適當註釋的值。要強制某個值具有嚴格註釋，必須定義一個返回值帶有嚴格註釋的身份函數。這是將非註釋值轉換為具有嚴格類型限定符註釋的值的唯一方法。"
        },
        "TQ_NEVER_VALUE_USED_WHERE_ALWAYS_REQUIRED": {
            "ShortDescription": "標註為永不攜帶類型限定符的值在要求攜帶該限定符的地方被使用",
            "LongDescription": "標註為永不攜帶類型限定符 {2.simpleName} 的值在要求攜帶該限定符的地方被使用",
            "Details": "標註為不攜帶類型限定符註釋的值確保會在一個或多個需要該值攜帶該註釋的地方被消耗。更確切地說，帶有指定為 when=NEVER 的類型限定符的值確保達到一個或多個該類型限定符指定為 when=ALWAYS 的使用位置。TODO: 示例"
        },
        "TQ_MAYBE_SOURCE_VALUE_REACHES_ALWAYS_SINK": {
            "ShortDescription": "可能不攜帶類型限定符的值始終以要求該類型限定符的方式被使用",
            "LongDescription": "可能不攜帶 {2.simpleName} 註釋的值始終被以要求該類型限定符的方式使用",
            "Details": "一個被註釋為可能不屬於類型限定符所描述的值，並且該值被保證以要求此類型限定符的方式使用。"
        },
        "TQ_MAYBE_SOURCE_VALUE_REACHES_NEVER_SINK": {
            "ShortDescription": "可能攜帶類型限定符的值始終被以禁止其攜帶該類型限定符的方式使用",
            "LongDescription": "一個被註釋為可能屬於類型限定符所描述的值，並且該值被保證以禁止此類型限定符的方式使用",
            "Details": "一個被註釋為可能屬於類型限定符所描述的值，並且該值被確保以要求此類型限定符的方式使用。"
        },
        "TQ_EXPLICIT_UNKNOWN_SOURCE_VALUE_REACHES_NEVER_SINK": {
            "ShortDescription": "值被要求不具有類型限定符，但標記為未知",
            "LongDescription": "值被要求永遠不為 {2.simpleName}，但明確標註為未知，涉及 {2.simpleName}",
            "Details": "一個以要求其永遠不為類型限定符所描述的值，但有一個明確的註解表明不確定該值是否被禁止攜帶類型限定符。使用或註解中可能存在錯誤。"
        },
        "TQ_EXPLICIT_UNKNOWN_SOURCE_VALUE_REACHES_ALWAYS_SINK": {
            "ShortDescription": "值被要求具有類型限定符，但標記為未知",
            "LongDescription": "值被要求始終為 {2.simpleName}，但明確標註為未知，涉及 {2.simpleName}",
            "Details": "一個以要求值始終為類型限定符所描述的值，但有一個明確的註解表明不確定該值是否要求具有類型限定符。使用或註解中可能存在錯誤。"
        },
        "IO_APPENDING_TO_OBJECT_OUTPUT_STREAM": {
            "ShortDescription": "試圖向對象輸出流追加內容的失敗嘗試",
            "LongDescription": "在 {1} 中試圖向對象輸出流追加內容的失敗嘗試",
            "Details": "此代碼以追加模式打開文件，然後將結果包裝在對象輸出流中，如下所示：OutputStream out = new FileOutputStream(anyFile, true); new ObjectOutputStream(out);這不會允許您向存儲在文件中的現有對象輸出流追加內容。如果您希望能夠向對象輸出流追加內容，您需要保持該對象輸出流打開。唯一可能的情況是，在讀取文件時，您計劃以隨機訪問模式打開文件，並尋求追加開始的字節偏移量。"
        },
        "WL_USING_GETCLASS_RATHER_THAN_CLASS_LITERAL": {
            "ShortDescription": "在 getClass 上同步而不是類字面量",
            "LongDescription": "在 {1} 中對 getClass 而不是類字面量進行同步",
            "Details": "此實例方法在同步。如果該類被子類化，子類將對子類的類對象進行同步，這不太可能是預期的。例如，考慮以下來自 java.awt.Label 的代碼：private static final String base = \"label\";\nprivate static int nameCounter = 0;\n\nString constructComponentName() { synchronized (getClass()) { return base + nameCounter++; }\n}\n子類不會對相同的子類進行同步，從而引起數據競爭。相反，此代碼應在以下內容上進行同步：private static final String base = \"label\";\nprivate static int nameCounter = 0;\n\nString constructComponentName() { synchronized (Label.class) { return base + nameCounter++; }\n}\n這個缺陷模式由 Jason Mehrens 貢獻。"
        },
        "OBL_UNSATISFIED_OBLIGATION": {
            "ShortDescription": "方法可能未能清理流或資源",
            "LongDescription": "{1} 可能未能清理 {2}",
            "Details": "該方法可能未能清理（關閉、釋放）流、數據庫對象或其他需要顯式清理操作的資源。一般來說，如果方法打開了流或其他資源，則該方法應該使用 try/finally 塊來確保流或資源在方法返回之前被清理。此缺陷模式本質上與 OS_OPEN_STREAM 和 ODR_OPEN_DATABASE_RESOURCE 缺陷模式相同，但基於不同（希望更好）的靜態分析技術。我們對這個缺陷模式的有用性感興趣。關於發送反饋的信息，請查看：<a href=\"https://github.com/spotbugs/spotbugs/blob/master/.github/CONTRIBUTING.md\">貢獻指南<a href=\"https://github.com/spotbugs/discuss/issues?q=\">郵件列表。\n特別是，此缺陷模式的假陽性抑制啟發式尚未經過廣泛調整，因此關於假陽性的報告對我們幫助很大。\n參見 Weimer 和 Necula，《尋找和防止運行時錯誤處理錯誤》(<a href=\"https://people.eecs.berkeley.edu/~necula/Papers/rte_oopsla04.pdf\">PDF)，以獲取分析技術的描述。"
        },
        "OBL_UNSATISFIED_OBLIGATION_EXCEPTION_EDGE": {
            "ShortDescription": "方法可能在檢查異常時未能清理流或資源",
            "LongDescription": "{1} 可能在檢查異常時未能清理 {2}",
            "Details": "該方法可能未能清理（關閉、釋放）流、數據庫對象或其他需要顯式清理操作的資源。一般來說，如果方法打開了流或其他資源，則該方法應該使用 try/finally 塊來確保流或資源在方法返回之前被清理。此缺陷模式本質上與 OS_OPEN_STREAM 和 ODR_OPEN_DATABASE_RESOURCE 缺陷模式相同，但基於不同（希望更好）的靜態分析技術。我們對這個缺陷模式的有用性感興趣。關於發送反饋的信息，請查看：<a href=\"https://github.com/spotbugs/spotbugs/blob/master/.github/CONTRIBUTING.md\">貢獻指南<a href=\"https://github.com/spotbugs/discuss/issues?q=\">郵件列表。\n特別是，此缺陷模式的假陽性抑制啟發式尚未經過廣泛調整，因此關於假陽性的報告對我們幫助很大。\n參見 Weimer 和 Necula，《尋找和防止運行時錯誤處理錯誤》(<a href=\"https://people.eecs.berkeley.edu/~necula/Papers/rte_oopsla04.pdf\">PDF)，以獲取分析技術的描述。"
        },
        "FB_UNEXPECTED_WARNING": {
            "ShortDescription": "SpotBugs 發出的意外/不希望的警告",
            "LongDescription": "在 {1} 中發現意外/不希望的 {2} SpotBugs 警告",
            "Details": "SpotBugs 生成了一個警告，根據某些註釋，這個警告是意外或不希望的。"
        },
        "FB_MISSING_EXPECTED_WARNING": {
            "ShortDescription": "缺少預期或想要的 SpotBugs 警告",
            "LongDescription": "在 {1} 中缺少預期或想要的 {2} SpotBugs 警告",
            "Details": "SpotBugs 沒有生成一個警告，而根據某些註釋，這是預期或想要的。"
        },
        "RV_RETURN_VALUE_OF_PUTIFABSENT_IGNORED": {
            "ShortDescription": "忽略了 putIfAbsent 的返回值，傳遞給 putIfAbsent 的值被重用",
            "LongDescription": "putIfAbsent 的返回值被忽略，但在 {1} 中重用了 {4}",
            "Details": "該方法通常用於確保與給定鍵關聯一個唯一值（第一個 put if absent 成功的值）。如果您忽略返回值並保留傳入的值的引用，則有可能保留的值不是關聯到映射中鍵的值。如果您使用的值很重要，並且使用的是未存儲在映射中的值，則程序將無法正常工作。"
        },
        "LG_LOST_LOGGER_DUE_TO_WEAK_REFERENCE": {
            "ShortDescription": "由於 OpenJDK 中的弱引用，可能丟失日誌記錄器的更改",
            "LongDescription": "在 {1} 中可能丟失對日誌記錄器的更改",
            "Details": "OpenJDK 引入了潛在的不兼容性。特別地，java.util.logging.Logger 的行為已經改變。它不再使用強引用，而是使用弱引用。這是一個合理的變化，但不幸的是，一些代碼依賴舊的行為 - 改變日誌記錄器配置時，它簡單地放棄對日誌記錄器的引用。這意味著垃圾收集器可以自由回收該內存，從而導致日誌記錄器配置丟失。例如，考慮：public static void initLogging() throws Exception { Logger logger = Logger.getLogger(\"edu.umd.cs\"); logger.addHandler(new FileHandler()); // 調用以更改日誌記錄器配置 logger.setUseParentHandlers(false); // 另一個調用以更改日誌記錄器配置\n}\n日誌記錄器引用在方法結束時丟失（它不會\n逃脫該方法），因此如果在調用 initLogging 之後剛好進行了垃圾收集周期，則日誌記錄器配置將丟失\n（因為 Logger 只保留弱引用）。public static void main(String[] args) throws Exception { initLogging(); // 向日誌記錄器添加文件處理程序 System.gc(); // 日誌記錄配置丟失 Logger.getLogger(\"edu.umd.cs\").info(\"一些消息\"); // 預期不會被記錄到文件中\n}\nUlf Ochsenfahrt 和 Eric Fellheimer"
        },
        "AT_OPERATION_SEQUENCE_ON_CONCURRENT_ABSTRACTION": {
            "ShortDescription": "對並發抽象的調用序列可能不是原子的",
            "LongDescription": "對 {2} 的調用序列在 {1} 中可能不是原子的",
            "Details": "此代碼包含對並發抽象（例如並發哈希圖）的調用序列。這些調用將不會原子地執行。"
        },
        "AT_UNSAFE_RESOURCE_ACCESS_IN_THREAD": {
            "ShortDescription": "在多線程上下文中對資源的操作不安全",
            "LongDescription": "在 {1} 中，對資源 {3} 的操作在多線程上下文中不安全",
            "Details": "此代碼中對一個資源的操作在多線程上下文中並不安全。該資源可能會被多個線程並發訪問而沒有適當的同步。這可能導致數據損壞。請使用同步或其他並發控制機制以確保安全訪問該資源。見相關的 SEI CERT 規則，但探測器不局限於鏈式方法：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/VNA04-J.+Ensure+that+calls+to+chained+methods+are+atomic\"> VNA04-J. 確保對鏈式方法的調用是原子的。"
        },
        "DM_DEFAULT_ENCODING": {
            "ShortDescription": "依賴默認編碼",
            "LongDescription": "在 {1} 中發現依賴默認編碼: {2}",
            "Details": "發現調用某個方法，該方法將字節轉換為字符串（或字符串轉換為字節），並假定默認平台編碼是合適的。這將導致應用程序在不同平台上的行為不一致。請使用其他 API，並明確指定字符集名稱或字符集對象。"
        },
        "NP_METHOD_PARAMETER_RELAXING_ANNOTATION": {
            "ShortDescription": "方法收緊了參數的 nullness 註釋",
            "LongDescription": "方法 {1} 重寫了 nullness 註釋，放寬了祖先方法對參數的要求。",
            "Details": "一個方法應該始終實現它重寫的方法的合同。因此，如果一個方法接受標記為 @Nullable 的參數，則不應在子類中重寫該方法，以使該參數為 @Nonnull。這樣做違反了該方法應處理空參數的合同。"
        },
        "NP_METHOD_PARAMETER_TIGHTENS_ANNOTATION": {
            "ShortDescription": "方法收緊了參數的 nullness 註釋",
            "LongDescription": "方法 {1} 以不兼容的方式重寫了參數 {2} 的 nullness 註釋",
            "Details": "一個方法應該始終實現它重寫的方法的合同。因此，如果一個方法接受標記為 @Nullable 的參數，那麼在子類中不應將該方法重寫為參數為 @Nonnull 的方法。這樣做違反了該方法應處理空參數的合同。"
        },
        "NP_METHOD_RETURN_RELAXING_ANNOTATION": {
            "ShortDescription": "方法放寬了返回值的 nullness 註釋",
            "LongDescription": "方法 {1} 以不兼容的方式重寫了返回值的 nullness 註釋。",
            "Details": "一個方法應該始終實現它重寫的方法的合同。因此，如果一個方法標註為返回 @Nonnull 值，則不應在子類中重寫該方法為標註返回 @Nullable 或 @CheckForNull 值的方法。這樣做違反了該方法不應返回 null 的合同。"
        },
        "EOS_BAD_END_OF_STREAM_CHECK": {
            "ShortDescription": "讀取的資料在與 -1 比較之前被轉換",
            "LongDescription": "方法 {1} 中 {2} 的返回值在與 {4} 比較之前被轉換為 {3}。",
            "Details": "方法 java.io.FileInputStream.read() 返回一個 int。如果該 int 被轉換為一個字節，那麼 -1 （表示 EOF）和字節 0xFF 變得不可區分，這樣在比較（轉換後的）結果與 -1 時，如果遇到字符 0xFF，讀取（可能在一個循環中）就會提前結束。類似地，方法 java.io.FileReader.read() 也返回一個 int。如果它被轉換為一個 char，那麼 -1 變成 0xFFFF，即 Character.MAX_VALUE。將結果與 -1 比較是毫無意義的，因為 Java 中的字符是無符號的。如果檢查 EOF 是循環的條件，那麼這個循環就是無限的。見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/FIO08-J.+Distinguish+between+characters+or+bytes+read+from+a+stream+and+-1\">FIO08-J. 區分從流中讀取的字符或字節與 -1。"
        },
        "REFLC_REFLECTION_MAY_INCREASE_ACCESSIBILITY_OF_CLASS": {
            "ShortDescription": "公共方法使用反射創建其參數中獲取的類，這可能增加任何類的可訪問性",
            "LongDescription": "公共方法 {1} 使用反射創建其參數中獲取的類，這可能增加任何類的可訪問性",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC05-J.+Do+not+use+reflection+to+increase+accessibility+of+classes%2C+methods%2C+or+fields\">SEI CERT SEC05-J 規則禁止使用反射來增加類、方法或字段的可訪問性。如果包中的一個類提供了一個公共方法，該方法將一個 java.lang.Class 的實例作為參數，並調用其 newInstance() 方法，則它增加了同一包中沒有公共構造函數的類的可訪問性。攻擊者代碼可能調用該方法並傳遞這樣的類以創建其實例。應通過使該方法為非公共或在包上檢查包訪問權限來避免這種情況。第三種可能性是使用 java.beans.Beans.instantiate() 方法，而不是 java.lang.Class.newInstance() 方法，該方法檢查接收到的 Class 對象是否具有任何公共構造函數。"
        },
        "REFLF_REFLECTION_MAY_INCREASE_ACCESSIBILITY_OF_FIELD": {
            "ShortDescription": "公共方法使用反射修改其參數中獲得的字段，這可能增加任何類的可訪問性",
            "LongDescription": "公共方法 {1} 使用反射修改其參數中獲得的字段，這可能增加任何類的可訪問性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC05-J.+Do+not+use+reflection+to+increase+accessibility+of+classes%2C+methods%2C+or+fields\">SEI CERT SEC05-J 規則禁止使用反射來增加類、方法或字段的可訪問性。如果包中的一個類提供了一個公共方法，該方法將一個 java.lang.reflect.Field 的實例作為參數，並調用 setter 方法（或 setAccessible() 方法），那麼它可能會增加同一包中私有的、保護的或包私有字段的可訪問性。攻擊者代碼可能調用該方法並傳遞這樣的字段以改變它。應通過使該方法為非公共或在包上檢查包訪問權限來避免這種情況。"
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_CONSTRUCTOR": {
            "ShortDescription": "構造函數中調用了可重寫的方法",
            "LongDescription": "可重寫的方法 {2} 在構造函數 {1} 中被調用。",
            "Details": "在構造函數中調用可重寫的方法可能導致使用未初始化的數據。它也可能洩漏部分構造對象的 this 引用。僅應從構造函數中調用靜態、最終或私有方法。見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET05-J.+Ensure+that+constructors+do+not+call+overridable+methods\">MET05-J. 確保構造函數不調用可重寫的方法。"
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_CLONE": {
            "ShortDescription": "在 clone() 方法中調用了可重寫的方法。",
            "LongDescription": "可重寫的方法 {2} 在類 {0} 的 clone() 方法中被調用。",
            "Details": "從 clone() 方法調用可重寫的方法是不安全的，因為子類可以重寫該方法，影響 clone() 的行為。它還可以在部分初始化狀態下觀察或修改克隆對象。僅應從 clone() 方法中調用靜態、最終或私有方法。見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88487921\">MET06-J. 不要在 clone() 中調用可重寫的方法。"
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_READ_OBJECT": {
            "ShortDescription": "在 readObject 方法中調用了可重寫的方法。",
            "LongDescription": "可重寫的方法 {2} 在 readObject 方法中被調用。",
            "Details": "readObject() 方法不得調用任何可重寫的方法。從 readObject() 方法調用可重寫的方法可能會使重寫方法在對象完全初始化之前訪問對象的狀態。這種過早的訪問是可能的，因為在反序列化中，readObject 扮演對象構造函數的角色，因此在 readObject 退出之前對象初始化並未完成。見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SER09-J.+Do+not+invoke+overridable+methods+from+the+readObject%28%29+method\"> SER09-J. 不要從 readObject() 方法中調用可重寫的方法。"
        },
        "SING_SINGLETON_IMPLEMENTS_CLONEABLE": {
            "ShortDescription": "使用單例設計模式的類直接實現了 Cloneable 接口。",
            "LongDescription": "使用單例設計模式的類 ({0}) 直接實現了 Cloneable 接口。",
            "Details": "如果使用單例設計模式的類直接實現了 Cloneable 接口，則可能創建該對象的副本，從而違反單例模式。因此，應避免實現 Cloneable 接口。有關更多信息，參見：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_INDIRECTLY_IMPLEMENTS_CLONEABLE": {
            "ShortDescription": "使用單例設計模式的類間接實現了 Cloneable 接口。",
            "LongDescription": "使用單例設計模式的類 ({0}) 間接實現了 Cloneable 接口。",
            "Details": "如果使用單例設計模式的類間接實現了 Cloneable 接口，則可能創建該對象的副本，從而違反單例模式。因此，應避免實現 Cloneable 接口。如果因擴展超類而無法做到這一點，解決方案是重寫 clone 方法以無條件拋出 CloneNotSupportedException。有關更多信息，參見：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_IMPLEMENTS_CLONE_METHOD": {
            "ShortDescription": "使用單例設計模式的類實現了 clone() 方法而沒有無條件拋出 CloneNotSupportedException。",
            "LongDescription": "使用單例設計模式的類 ({0}) 實現了 clone() 方法而沒有無條件拋出 CloneNotSupportedException。",
            "Details": "該類使用單例設計模式，並未實現 Cloneable 接口，但實現了 clone() 方法而沒有無條件拋出 CloneNotSupportedException。這樣就可能創建該對象的副本，從而違反單例模式。因此，應該避免實現 clone 方法，否則解決方案就是重寫 clone 方法以無條件拋出 CloneNotSupportedException。有關更多信息，參見：<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_HAS_NONPRIVATE_CONSTRUCTOR": {
            "ShortDescription": "使用單例設計模式的類具有非私有構造函數。",
            "LongDescription": "使用單例設計模式的類 ({0}) 具有非私有構造函數。",
            "Details": "該類使用單例設計模式，並具有非私有構造函數（請注意，可能存在默認構造函數而不是私有的）。因此，可以創建該對象的副本，從而違反單例模式。更簡單的解決方案是將構造函數設為私有。<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J 規則"
        },
        "SING_SINGLETON_IMPLEMENTS_SERIALIZABLE": {
            "ShortDescription": "使用單例設計模式的類直接或間接實現了 Serializable 接口。",
            "LongDescription": "使用單例設計模式的類 ({0}) 直接或間接實現了 Serializable 接口。",
            "Details": "該類（使用單例設計模式）直接或間接實現了 Serializable 接口，這允許該類被序列化。反序列化使單例類的多重實例化成為可能，因此應避免這類行為。<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J 規則"
        },
        "SING_SINGLETON_GETTER_NOT_SYNCHRONIZED": {
            "ShortDescription": "使用單例設計模式的類的實例獲取方法未同步。",
            "LongDescription": "使用單例設計模式的類的實例獲取方法 ({0}) 未同步。",
            "Details": "使用單例設計模式的類的實例獲取方法未同步。當此方法被兩個或更多線程同時調用時，單例類的多重實例化變得可能。<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J 規則"
        },
        "SSD_DO_NOT_USE_INSTANCE_LOCK_ON_SHARED_STATIC_DATA": {
            "ShortDescription": "在共享靜態數據上使用了實例級鎖",
            "LongDescription": "靜態字段 \"{2}\" 被實例級 {3} 修改。",
            "Details": "如果鎖或 synchronized 方法不是靜態的，修改靜態字段，則可能使共享靜態數據在並發訪問時未被保護。可能的情況有兩種，如果一個同步方法使用非靜態鎖對象，或者一個 synchronized 方法被聲明為非靜態。這兩種方式都是無效的。最佳解決方案是使用私有的靜態最終鎖對象來保護共享的靜態數據。見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK06-J.+Do+not+use+an+instance+lock+to+protect+shared+static+data\"> LCK06-J. 不要使用實例鎖來保護共享的靜態數據。"
        },
        "FL_FLOATS_AS_LOOP_COUNTERS": {
            "ShortDescription": "不要使用浮點變量作為循環計數器",
            "LongDescription": "使用浮點循環計數器可能導致意外行為。",
            "Details": "應避免將浮點變量用作循環計數器，因為它們不精確，可能導致循環不正確。循環計數器是一個在每次迭代時更改的變量，控制循環何時終止。它在每次迭代時增加或減少固定量。見規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/NUM09-J.+Do+not+use+floating-point+variables+as+loop+counters\">NUM09-J。"
        },
        "THROWS_METHOD_THROWS_RUNTIMEEXCEPTION": {
            "ShortDescription": "方法故意拋出 RuntimeException。",
            "LongDescription": "方法故意拋出 RuntimeException。",
            "Details": "方法故意拋出 RuntimeException。根據 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J 規則，拋出 RuntimeException 可能導致錯誤，例如調用者無法檢查異常，從而無法正確恢復。同時，拋出 RuntimeException 將強迫調用者捕獲 RuntimeException，因此違反了 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR08-J.+Do+not+catch+NullPointerException+or+any+of+its+ancestors\">SEI CERT ERR08-J 規則。請注意，您可以從 Exception 或 RuntimeException 派生，並可以拋出該異常的新實例。"
        },
        "THROWS_METHOD_THROWS_CLAUSE_BASIC_EXCEPTION": {
            "ShortDescription": "方法在其 throws 子句中列出了 Exception。",
            "LongDescription": "方法在其 throws 子句中列出了 Exception。",
            "Details": "方法在其 throws 子句中列出了 Exception。\n\n 在聲明方法時，throws 子句中的異常類型應盡可能具體。因此，使用 Exception 作為 throws 子句將迫使調用者在其自己的 throws 子句中使用它，或在 try-catch 塊中使用它（當它未必包含任何有關拋出異常的有意義信息時）。有關更多信息，參見 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J 規則。"
        },
        "THROWS_METHOD_THROWS_CLAUSE_THROWABLE": {
            "ShortDescription": "方法在其 throws 子句中列出了 Throwable。",
            "LongDescription": "方法在其 throws 子句中列出了 Throwable。",
            "Details": "方法在其 throws 子句中列出了 Throwable。\n 在聲明方法時，throws 子句中的異常類型應盡可能具體。因此，使用 Throwable 作為 throws 子句將迫使調用者在其自己的 throws 子句中使用它，或在 try-catch 塊中使用它（當它未必包含任何有關拋出異常的有意義信息時）。此外，以這種方式使用 Throwable 是一種語義上的不良實踐，因為 Throwable 包括錯誤，而根據定義，它們發生在無法恢復的場景中。有關更多信息，參見 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J 規則。"
        },
        "PERM_SUPER_NOT_CALLED_IN_GETPERMISSIONS": {
            "ShortDescription": "自定義類加載器未調用其超類的 getPermissions()",
            "LongDescription": "自定義類加載器 {1} 未調用其超類的 getPermissions()",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC07-J.+Call+the+superclass%27s+getPermissions%28%29+method+when+writing+a+custom+class+loader\">SEI CERT 規則 SEC07-J 要求自定義類加載器必須始終在其自己的 getPermissions() 方法中調用其超類的 getPermissions() 方法，以初始化其返回的對象。省略它意味著使用此自定義類加載器定義的類具有與系統範圍的策略文件中指定的權限完全獨立的權限。實際上，該類的權限覆蓋了它們。"
        },
        "USC_POTENTIAL_SECURITY_CHECK_BASED_ON_UNTRUSTED_SOURCE": {
            "ShortDescription": "基於不信任來源的潛在安全檢查。",
            "LongDescription": "在進入 doPrivileged 塊之前，非最終方法 {4} 在 {5} 調用，並且在公共方法 {1} 中還在 {6} 調用了該方法，在非最終的類實例 {3} 中。如果此調用是在進入 doPrivileged() 塊之前進行的檢查，則可能不可靠，因為該方法可能接收到不可信的子類實例，該實例重寫了此方法，使其行為與預期不同。",
            "Details": "公共類的公共方法可能從包外調用，這意味著可能會傳遞不可信的數據。如果在 doPrivileged 之前調用此方法以檢查其返回值，然後在類內部調用同一方法，如果該方法或其封閉類不是最終的，則這是危險的。攻擊者可能傳遞一個惡意子類的實例，而不是期望中的實例，該實例以不同的方式重寫該方法，使其在不同的調用中返回不同的值。例如，一個返回文件路徑的方法可能在進入 doPrivileged 塊之前返回一個無害的路徑，而在 doPrivileged 塊內的調用中返回一個敏感文件。為了避免這種情況，防禦性地複製參數中接收到的對象，例如使用作為形式參數類型的拷貝構造函數。這確保了方法按預期完全執行。見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC02-J.+Do+not+base+security+checks+on+untrusted+sources\">SEC02-J. 不要基於不可信來源執行安全檢查。"
        },
        "ASE_ASSERTION_WITH_SIDE_EFFECT": {
            "ShortDescription": "斷言中的表達式可能產生副作用",
            "LongDescription": "在 {1} 的斷言中使用的表達式可能會產生副作用。如果斷言被禁用，則表達式不會執行，方法的結果可能會改變。",
            "Details": "在斷言中使用的表達式不得產生副作用。\n參見 SEI CERT 規則 EXP06 以獲取更多信息。"
        },
        "ASE_ASSERTION_WITH_SIDE_EFFECT_METHOD": {
            "ShortDescription": "在斷言中調用的方法可能產生副作用",
            "LongDescription": "在 {1} 的斷言中調用的方法可能會產生副作用。如果斷言被禁用，則方法調用不會執行，方法的結果可能會改變。",
            "Details": "在斷言中使用的表達式不得產生副作用。\n參見 SEI CERT 規則 EXP06 以獲取更多信息。"
        },
        "PA_PUBLIC_PRIMITIVE_ATTRIBUTE": {
            "ShortDescription": "原始字段是公共的",
            "LongDescription": "原始字段 {1} 是公共的，並從類內部設置，這使其暴露過多。考慮將其設為私有，以限制外部可訪問性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT 規則 OBJ01-J 要求限制字段的可訪問性。否則，字段的值可能會被外部修改，這可能是意外或不希望的行為。一般來說，要求沒有字段允許 public 是過於嚴苛且不切實際的。即使規則提到最終字段可以是公共的。此外，公共字段可能還有其他用途：某些公共字段可以作為“標誌”，影響類的行為。這些標誌字段預期由當前實例（或在靜態字段的情況下由當前類）讀取，但由其他人寫入。如果字段由當前實例的方法（或當前類，在靜態字段的情況下）和外部方法都寫入，那麼代碼是可疑的。考慮將這些字段設為私有，並在必要時提供適當的 setter。請注意，如果構造函數、初始化器和終結器僅在類內部寫入字段，則這些是例外，字段不會被視為由類本身寫入。"
        },
        "PA_PUBLIC_ARRAY_ATTRIBUTE": {
            "ShortDescription": "數組類型字段是公共的",
            "LongDescription": "數組類型字段 {1} 是公共的，這使其暴露過多。考慮將其設為私有，以限制外部可訪問性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT 規則 OBJ01-J 要求限制字段的可訪問性。將數組類型字段設為最終並不能防止其他類修改數組的內容。然而，通常限制不允許公共字段是過於嚴苛且不切實際的。公共字段可能有用途：某些公共字段可能作為影響類行為的“標誌”。這些標誌字段預期由當前實例（或在靜態字段的情況下由當前類）讀取，但由其他人寫入。如果字段由當前實例的方法（或當前類，在靜態字段的情況下）和外部方法都寫入，那麼代碼是可疑的。考慮將這些字段設為私有，並在必要時提供適當的 setter。請注意，如果構造函數、初始化器和終結器僅在類內部寫入字段，字段不會被視為由類本身寫入。"
        },
        "PA_PUBLIC_MUTABLE_OBJECT_ATTRIBUTE": {
            "ShortDescription": "可變對象類型字段是公共的",
            "LongDescription": "可變對象類型字段 {1} 是公共的，這使其暴露過多。考慮將其設為私有，以限制外部可訪問性。",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT 規則 OBJ01-J 要求限制字段的可訪問性。將可變對象類型字段設為最終並不能防止其他類修改對象的內容。然而，通常限制不允許公共字段是過於嚴苛且不切實際的。公共字段可能有用途：某些公共字段可能作為影響類行為的“標誌”。這些標誌字段預期由當前實例（或在靜態字段的情況下由當前類）讀取，但由其他人寫入。如果字段由當前實例的方法（或當前類，在靜態字段的情況下）和外部方法都寫入，那麼代碼是可疑的。考慮將這些字段設為私有，並在必要時提供適當的 setter。請注意，如果構造函數、初始化器和終結器僅在類內部寫入字段，字段不會被視為由類本身寫入。在對象類型字段的情況下，“寫入”意指調用其名稱暗示修改的方法。"
        },
        "VSC_VULNERABLE_SECURITY_CHECK_METHODS": {
            "ShortDescription": "非私有且非最終的安全檢查方法易受攻擊",
            "LongDescription": "方法 '{1}' 通過使用 Security Manager 類的 '{2}' 方法執行安全檢查，但它是可重寫的。請將該方法聲明為最終或私有，以解決此問題。",
            "Details": "執行安全檢查的方法應防止被重寫，因此必須聲明為私有或最終。否則，這些方法在惡意子類重寫並省略檢查時可能會被破壞。參見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET03-J.+Methods+that+perform+a+security+check+must+be+declared+private+or+final\">MET03-J. 執行安全檢查的方法必須聲明為私有或最終。"
        },
        "AA_ASSERTION_OF_ARGUMENTS": {
            "ShortDescription": "斷言用於驗證公共方法的參數",
            "LongDescription": "在 {1} 處的斷言驗證方法參數。如果斷言被禁用，則不會有任何參數驗證。",
            "Details": "斷言不得用於驗證公共方法的參數，因為如果斷言被禁用，則不會執行驗證。\n參見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET01-J.+Never+use+assertions+to+validate+method+arguments\">MET01-J. 從不使用斷言驗證方法參數以獲取更多信息。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_CLASS_NAMES": {
            "ShortDescription": "請勿將 JSL 中的公共標識符用作類名",
            "LongDescription": "類 {0} 的名稱遮蔽了 Java 標準庫中的公共可用標識符。",
            "Details": "避免將 Java 標準庫中的公共標識符重用為類名是良好實踐。因為 Java 標準庫是 Java 平台的一部分，預期將在所有 Java 環境中可用。這樣做可能導致命名衝突和混淆，使代碼的理解和維護變得更加困難。最佳實踐是選擇唯一且描述性的類名，準確表示您自己代碼的目的和功能。舉個例子，假設您想為應用程序處理日期創建一個類。您可以選擇一個更具體、唯一的名稱，比如 “AppDate” 或 “DisplayDate”，而不是使用像 “Date” 這樣的常見名稱，這樣會與現有的 java.util.Date 類發生衝突。\n 選擇標識符名稱時請記住幾個關鍵點：使用有意義的前綴或命名空間：為您的類名加上特定於項目的前綴或命名空間，使其與眾不同。例如，如果您的項目名稱為 “MyApp”，您可以使用 “MyAppDate” 作為您的類名。使用描述性名稱：選擇清晰表明其目的和功能的類名。這有助於避免遮蔽現有 Java 標準庫標識符。例如，不要使用 “List”，可以考慮使用 “CustomAppList”。遵循命名約定：遵循 Java 的命名約定，例如使用駝峰命名法（例如 MyClass）作為類名。這會促進代碼的可讀性，並減少衝突的可能性。\n參見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 請勿重用 Java 標準庫的公共標識符。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_FIELD_NAMES": {
            "ShortDescription": "請勿將 JSL 中的公共標識符用作字段名",
            "LongDescription": "類 {0} 中的字段 {1.name} 遮蔽了 Java 標準庫中的公共可用標識符。",
            "Details": "避免在代碼中將 Java 標準庫中的公共標識符重用為字段名是良好實踐。這樣做可能導致混淆和潛在衝突，使理解和維護您的代碼變得更加困難。因此，建議選擇唯一和描述性的字段名稱，準確表示它們的目的，並將其與標準庫標識符區分開。\n 例如，假設您想為應用程序創建一個處理日期的類。您可以選擇一個更具體和唯一的名稱，例如 “AppDate” 或 “DisplayDate”，而不是使用像 “Date” 這樣的常見名稱，這樣會與現有的 java.util.Date 類發生衝突。\n 例如，假設您正在為應用程序創建一個表示汽車的類。您應該選擇一個更具體和獨特的名稱，例如 “VehiclePart” 或 “CarComponent”，而不是使用像 “Component” 這樣的常見名稱，這樣會與現有的 java.awt.Component 類發生衝突。\n 選擇標識符名稱時請記住幾個關鍵點：使用描述性名稱：選擇清晰表明其目的和功能的字段名稱。這有助於避免遮蔽現有的 Java 標準庫標識符。例如，不要使用 \"list\"，可以考慮使用 \"myFancyList\"。遵循命名約定：遵循 Java 的命名約定，例如在字段名稱中使用混合大小寫。以小寫字母開頭，內部單詞應以大寫字母開頭（例如，myFieldUsesMixedCase）。這促進了代碼的可讀性，並減少了衝突的可能性。\n參見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 請勿重用 Java 標準庫中的公共標識符。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_METHOD_NAMES": {
            "ShortDescription": "請勿將 JSL 中的公共標識符用作方法名",
            "LongDescription": "方法 {1} 的名稱遮蔽了 Java 標準庫中的公共可用標識符。",
            "Details": "避免將 Java 標準庫中的公共標識符重用為方法名是良好實踐。這樣做可能會導致混淆、潛在衝突和意外行為。為了保持代碼的清晰性並確保適當的功能，建議為您的方法選擇獨特且描述性的名稱，準確表示其目的並將其與標準庫標識符區分開。\n 例如，假設您想為應用程序創建一個處理創建自定義文件的方法。您可以選擇一個更具體和唯一的名稱，例如 “generateFile” 或 “createOutPutFile”，而不是使用像 “File” 這樣的常見名稱，因為這會與現有的 java.io.File 類發生衝突。\n 選擇標識符名稱時請記住幾個關鍵點：使用描述性名稱：選擇清晰表明其目的和功能的方法名稱。這有助於避免遮蔽現有的 Java 標準庫標識符。例如，不要使用 “abs()”，可以考慮使用 “calculateAbsoluteValue()”。遵循命名約定：遵循 Java 的命名約定，如對於方法名稱使用混合大小寫。方法名應為動詞，第一个字母小寫，每個內部單詞的第一個字母大寫（例如 runFast()）。這促進了代碼的可讀性，減少了衝突的機會。\n參見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 請勿重用 Java 標準庫中的公共標識符。"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_LOCAL_VARIABLE_NAMES": {
            "ShortDescription": "請勿將 JSL 中的公共標識符用作變量名",
            "LongDescription": "方法 {1} 中的變量名 {2} 遮蔽了 Java 標準庫中的公共可用標識符。",
            "Details": "在 Java 中聲明局部變量時，建議避免重用 Java 標準庫中的公共標識符。將這些標識符作為局部變量名重用可能導致混淆，妨礙代碼理解，並可能導致與現有公共可用標識符名稱的衝突。為了維護代碼的清晰性並避免此類問題，最佳實踐是為局部變量選擇唯一和描述性的名稱。\n 例如，假設您想在變量中存儲自定義字體值。您可以選擇一個更具體和唯一的名稱，例如 “customFont” 或 “loadedFontName”，而不是使用像 “Font” 這樣的常見名稱，這樣會與現有的 java.awt.Font 類發生衝突。\n 選擇標識符名稱時請記住幾個關鍵點：使用描述性名稱：選擇清晰表明其目的和功能的變量名稱。這有助於避免遮蔽現有的 Java 標準庫標識符。例如，不要使用 \"variable\"，可以考慮使用 \"myVariableName\"。遵循命名約定：遵循 Java 的命名約定，例如對變量名稱使用混合大小寫。以小寫字母開頭，內部單詞應該以大寫字母開頭（例如，myVariableName）。這促進了代碼的可讀性，並減少了衝突的可能性。\n參見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. 請勿重用 Java 標準庫中的公共標識符。"
        },
        "ENV_USE_PROPERTY_INSTEAD_OF_ENV": {
            "ShortDescription": "更可取的是使用可移植的 Java 屬性，而不是環境變量。",
            "LongDescription": "在方法 {1} 中，更可取的是使用可移植的 Java 屬性 '{3}'，而不是環境變量 '{2}'。",
            "Details": "環境變量並不是可移植的，變量名本身（不僅僅是值）在不同運行操作系統時可能不同。特定環境變量的名稱不僅可以不同（例如，Windows 中的 `USERNAME` 和 Unix 系統中的 `USER`），甚至語義也可能不同，例如區分大小寫（Windows 不區分大小寫而 Unix 區分大小寫）。此外，返回的環境變量 Map 和其集合視圖可能不遵循和的方法的一般合同。因此，使用環境變量可能會產生意外的副作用。此外，環境變量的可見性與 Java 屬性相比限制較少：它們對定義進程的所有後代可見，而不僅僅是直接的 Java 子進程。出於這些原因，即使是 Java API 也建議在可能的情況下使用 Java 屬性 （System.getProperty()）而不是環境變量 （System.getenv()）。如果一個值可以通過 System.getProperty() 和 System.getenv() 兩者訪問，則應使用前者。相應的 Java 系統屬性的映射：環境變量。參見 SEI CERT 規則 <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables\">ENV02-J. 不要信任環境變量的值。"
        }
    },

    "bugCodes": {
        "FS": {
            "text": "格式字符串問題"
        },
        "SKIPPED": {
            "text": "分析被跳過"
        },
        "IL": {
            "text": "無限循環"
        },
        "VO": {
            "text": "使用 volatile"
        },
        "UI": {
            "text": "不安全的繼承"
        },
        "FL": {
            "text": "浮點精度的使用"
        },
        "TEST": {
            "text": "測試原型和不完整的錯誤模式"
        },
        "IMSE": {
            "text": "有疑問的 IllegalMonitorStateException 捕獲"
        },
        "CN": {
            "text": "克隆模式的糟糕實現"
        },
        "CAA": {
            "text": "協變數組賦值"
        },
        "AT": {
            "text": "可能的原子性違反"
        },
        "FI": {
            "text": "不正確的終結器使用"
        },
        "ES": {
            "text": "使用 == 或 != 檢查字符串相等性"
        },
        "ML": {
            "text": "在更新字段上進行同步（可變鎖）"
        },
        "UG": {
            "text": "未同步的獲取方法，已同步的設置方法"
        },
        "IO": {
            "text": "輸入/輸出問題"
        },
        "IC": {
            "text": "初始化循環性"
        },
        "SI": {
            "text": "可疑的靜態初始化器"
        },
        "MSF": {
            "text": "可變的servlet字段"
        },
        "IS": {
            "text": "不一致的同步"
        },
        "Eq": {
            "text": "equals() 實現的問題"
        },
        "Co": {
            "text": "compareTo() 實現的問題"
        },
        "HE": {
            "text": "相等的對象必須具有相等的哈希碼"
        },
        "AM": {
            "text": "API 誤用"
        },
        "Dm": {
            "text": "使用了可疑的方法"
        },
        "Bx": {
            "text": "原始值的可疑裝箱"
        },
        "UR": {
            "text": "構造函數中字段的未初始化讀取"
        },
        "RR": {
            "text": "方法忽略 InputStream.read() 的結果"
        },
        "NN": {
            "text": "裸通知"
        },
        "UW": {
            "text": "無條件等待"
        },
        "SP": {
            "text": "方法在字段上自旋"
        },
        "DC": {
            "text": "雙重檢查模式"
        },
        "Wa": {
            "text": "不在循環中等待"
        },
        "No": {
            "text": "使用 notify() 而不是 notifyAll()"
        },
        "DE": {
            "text": "丟棄或忽略的異常"
        },
        "Ru": {
            "text": "方法調用 run()"
        },
        "It": {
            "text": "Iterator 的不正確定義"
        },
        "SnVI": {
            "text": "沒有版本 ID 的可序列化類"
        },
        "Se": {
            "text": "可序列化類的不正確定義"
        },
        "WS": {
            "text": "類的 writeObject() 方法是同步的，但其他方法不是"
        },
        "RS": {
            "text": "類的 readObject() 方法是同步的"
        },
        "SC": {
            "text": "構造函數調用 Thread.start()"
        },
        "MS": {
            "text": "可變的靜態字段"
        },
        "ME": {
            "text": "可變的枚舉字段"
        },
        "EI": {
            "text": "返回數組的方法可能暴露內部表示"
        },
        "Nm": {
            "text": "混淆的方法名"
        },
        "SS": {
            "text": "未讀字段應為靜態"
        },
        "UuF": {
            "text": "未使用的字段"
        },
        "UrF": {
            "text": "未讀字段"
        },
        "UwF": {
            "text": "未寫入字段"
        },
        "SIC": {
            "text": "內部類可以被聲明為靜態"
        },
        "TLW": {
            "text": "持有兩個鎖時等待"
        },
        "RANGE": {
            "text": "範圍檢查"
        },
        "RV": {
            "text": "錯誤使用方法的返回值"
        },
        "LG": {
            "text": "日誌記錄器問題"
        },
        "IA": {
            "text": "模糊的調用"
        },
        "HSC": {
            "text": "巨大的字符串常量"
        },
        "HRS": {
            "text": "HTTP 回應拆分漏洞"
        },
        "PT": {
            "text": "路徑遍歷"
        },
        "XSS": {
            "text": "跨站腳本漏洞"
        },
        "NP": {
            "text": "空指針解引用"
        },
"NOISE": {
            "text": "虛假隨機警告"
        },
        "RpC": {
            "text": "重複的條件測試"
        },
        "OS": {
            "text": "所有路徑上未關閉的流"
        },
        "PZLA": {
            "text": "優先使用零長度數組而不是 null 來表示沒有結果"
        },
        "UCF": {
            "text": "無用的控制流"
        },
        "RCN": {
            "text": "冗餘的 null 比較"
        },
        "UL": {
            "text": "未在所有路徑上釋放鎖"
        },
        "RC": {
            "text": "可疑的引用相等性使用，而不是調用 equals"
        },
        "EC": {
            "text": "比較不兼容的類型以進行相等性檢查"
        },
        "MWN": {
            "text": "不匹配的 wait() 或 notify()"
        },
        "SA": {
            "text": "無用的自操作"
        },
        "INT": {
            "text": "可疑的整數表達式"
        },
        "BIT": {
            "text": "可疑的位邏輯表達式"
        },
        "LI": {
            "text": "未同步的延遲初始化"
        },
        "JLM": {
            "text": "在 java.util.concurrent 對象上同步"
        },
        "UPM": {
            "text": "私有方法從未被調用"
        },
        "UMAC": {
            "text": "匿名類的不可調用方法"
        },
        "EI2": {
            "text": "存儲對可變對象的引用"
        },
        "NS": {
            "text": "可疑的非短路布爾操作符使用"
        },
        "ODR": {
            "text": "資料庫資源在所有路徑上未關閉"
        },
        "SBSC": {
            "text": "循環中使用 + 運算符的字符串連接"
        },
        "IIL": {
            "text": "可以移出循環的低效代碼"
        },
        "IIO": {
            "text": "對 String.indexOf(String) 或 String.lastIndexOf(String) 的低效使用"
        },
        "ITA": {
            "text": "對 collection.toArray(new Foo[0]) 的低效使用"
        },
        "SW": {
            "text": "Swing 編碼規則"
        },
        "IJU": {
            "text": "JUnit TestCase 實現不當"
        },
        "BOA": {
            "text": "錯誤重寫的適配器"
        },
        "SF": {
            "text": "switch case 貫穿"
        },
        "SIO": {
            "text": "多餘的 instanceof"
        },
        "BAC": {
            "text": "錯誤的 Applet 構造函數"
        },
        "UOE": {
            "text": "使用對象的 equals"
        },
        "STI": {
            "text": "可疑的線程中斷"
        },
        "DLS": {
            "text": "死局局部存儲"
        },
        "IP": {
            "text": "被忽略的參數"
        },
        "MF": {
            "text": "屏蔽字段"
        },
        "WMI": {
            "text": "低效映射迭代器"
        },
        "ISC": {
            "text": "實例化靜態類"
        },
        "DCN": {
            "text": "不要捕獲 NullPointerException"
        },
        "REC": {
            "text": "RuntimeException 捕獲"
        },
        "FE": {
            "text": "測試浮點相等"
        },
        "UM": {
            "text": "對常量的不必要數學運算"
        },
        "UC": {
            "text": "無用的代碼"
        },
        "CNT": {
            "text": "已知常量的粗略值"
        },
        "CD": {
            "text": "循環依賴"
        },
        "RI": {
            "text": "冗餘接口"
        },
        "MTIA": {
            "text": "多線程實例訪問"
        },
        "PS": {
            "text": "公共信號量"
        },
        "BSHIFT": {
            "text": "錯誤的位移"
        },
        "ICAST": {
            "text": "從整數值轉換"
        },
        "RE": {
            "text": "正則表達式"
        },
        "SQL": {
            "text": "潛在的 SQL 問題"
        },
        "WL": {
            "text": "可能在錯誤對象上鎖定"
        },
        "ESync": {
            "text": "空的同步塊"
        },
        "QF": {
            "text": "可疑的 for 循環"
        },
        "VA": {
            "text": "可變參數問題"
        },
        "BC": {
            "text": "對象引用的錯誤轉換"
        },
        "IM": {
            "text": "可疑的整數數學"
        },
        "ST": {
            "text": "靜態字段的誤用"
        },
        "JCIP": {
            "text": "違反 net.jcip 註釋"
        },
        "USELESS_STRING": {
            "text": "生成的無用/無信息字符串"
        },
        "DMI": {
            "text": "可疑的方法調用"
        },
        "PZ": {
            "text": "受 Joshua Bloch 和 Neal Gafter 的編程難題啟發的警告"
        },
        "SWL": {
            "text": "持鎖睡眠"
        },
        "J2EE": {
            "text": "J2EE 錯誤"
        },
        "DB": {
            "text": "重複分支"
        },
        "IMA": {
            "text": "低效成員訪問"
        },
        "XFB": {
            "text": "XML 工廠繞過"
        },
        "USM": {
            "text": "無用的子類方法"
        },
        "CI": {
            "text": "混淆的繼承"
        },
        "QBA": {
            "text": "可疑的布爾賦值"
        },
        "VR": {
            "text": "版本兼容性問題"
        },
        "DP": {
            "text": "使用 doPrivileged"
        },
        "GC": {
            "text": "可疑調用泛型集合方法"
        },
        "STCAL": {
            "text": "對類型 Calendar 或 DateFormat 的靜態使用"
        },
        "TQ": {
            "text": "類型限定符註釋的不一致使用"
        },
        "OBL": {
            "text": "未滿足的清理流或資源的義務"
        },
        "FB": {
            "text": "SpotBugs 未在方法上生成預期的警告"
        },
        "DL": {
            "text": "因在共享對象上鎖而導致的意外競爭或可能的死鎖"
        },
        "JUA": {
            "text": "JUnit 斷言中的問題"
        },
        "EOS": {
            "text": "錯誤的流結束檢查"
        },
        "REFLC": {
            "text": "反射增加類的可訪問性"
        },
        "REFLF": {
            "text": "反射增加字段的可訪問性"
        },
        "MC": {
            "text": "危險的可重寫方法調用"
        },
        "CT": {
            "text": "構造函數拋出"
        },
        "SSD": {
            "text": "不要使用實例鎖來保護共享靜態數據"
        },
        "SING": {
            "text": "單例問題"
        },
        "THROWS": {
            "text": "與異常拋出相關的問題"
        },
        "PERM": {
            "text": "自訂類載入器未調用其超類的 getPermissions()"
        },
        "USC": {
            "text": "基於不可信來源的潛在安全檢查"
        },
        "ASE": {
            "text": "具有副作用的斷言"
        },
        "PA": {
            "text": "公共屬性"
        },
        "VSC": {
            "text": "執行方法的易受攻擊的安全檢查"
        },
        "AA": {
            "text": "對公共方法的參數使用斷言的不當"
        },
        "PI": {
            "text": "請勿重用 Java 標準庫中的公共標識符"
        },
        "ENV": {
            "text": "使用環境變數而不是相應的 Java 屬性"
        }
    }
};
