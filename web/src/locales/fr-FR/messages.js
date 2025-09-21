export const sscanMessages = {
    "bugCategories": {
        "CORRECTNESS": {
            "Description": "Correctness",
            "Abbreviation": "C",
            "Details": "Probable bug - an apparent coding mistake resulting in code that was probably not what the developer intended. We strive for a low false positive rate."
        },
        "NOISE": {
            "Description": "Bogus random noise",
            "Abbreviation": "N",
            "Details": "Bogus random noise: intended to be useful as a control in data mining experiments, not in finding actual bugs in software"
        },
        "SECURITY": {
            "Description": "Security",
            "Abbreviation": "S",
            "Details": "A use of untrusted input in a way that could create a remotely exploitable security vulnerability."
        },
        "BAD_PRACTICE": {
            "Description": "Bad practice",
            "Abbreviation": "B",
            "Details": "Violations of recommended and essential coding practice. Examples include hash code and equals problems, cloneable idiom, dropped exceptions, Serializable problems, and misuse of finalize. We strive to make this analysis accurate, although some groups may not care about some of the bad practices."
        },
        "STYLE": {
            "Description": "Dodgy code",
            "Abbreviation": "D",
            "Details": "Code that is confusing, anomalous, or written in a way that leads itself to errors. Examples include dead local stores, switch fall through, unconfirmed casts, and redundant null check of value known to be null. More false positives accepted. In previous versions of SpotBugs, this category was known as Style."
        },
        "PERFORMANCE": {
            "Description": "Performance",
            "Abbreviation": "P",
            "Details": "Code that is not necessarily incorrect but may be inefficient"
        },
        "MALICIOUS_CODE": {
            "Description": "Malicious code vulnerability",
            "Abbreviation": "V",
            "Details": "Code that is vulnerable to attacks from untrusted code"
        },
        "MT_CORRECTNESS": {
            "Description": "Multithreaded correctness",
            "Abbreviation": "M",
            "Details": "Code flaws having to do with threads, locks, and volatiles"
        },
        "I18N": {
            "Description": "Internationalization",
            "Abbreviation": "I",
            "Details": "Code flaws having to do with internationalization and locale"
        },
        "EXPERIMENTAL": {
            "Description": "Experimental",
            "Abbreviation": "X",
            "Details": "Experimental and not fully vetted bug patterns"
        }
    },

    "bugPatterns": { 
        "CT_CONSTRUCTOR_THROW": {
            "ShortDescription": "Be wary of letting constructors throw exceptions.",
            "LongDescription": "Exception thrown in class {0} at {1} will leave the constructor. The object under construction remains partially initialized and may be vulnerable to Finalizer attacks.",
            "Details": "Classes that throw exceptions in their constructors are vulnerable to Finalizer attacks\nA finalizer attack can be prevented, by declaring the class final, using an empty finalizer declared as final, or by a clever use of a private constructor.\nSee <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ11-J.+Be+wary+of+letting+constructors+throw+exceptions\">SEI CERT Rule OBJ-11for more information."
        },
        "JUA_DONT_ASSERT_INSTANCEOF_IN_TESTS": {
            "ShortDescription": "Asserting value of instanceof in tests is not recommended.",
            "LongDescription": "Assertion of type {0} in {2} at {3} may hide useful information about why a cast may have failed.",
            "Details": "Asserting type checks in tests is not recommended as a class cast exception message could better indicate the cause of an instance of the wrong class being used than an instanceof assertion.\nWhen debugging tests that fail due to bad casts, it may be more useful to observe the output of the resulting ClassCastException which could provide information about the actual encountered type. Asserting the type before casting would instead result in a less informative\"false is not true\"message.\nIf JUnit is used with hamcrest, the <a href=\"https://junit.org/junit4/javadoc/latest/index.html?org/hamcrest/core/IsInstanceOf.html\">class from hamcrest could be used instead."
        },
        "OVERRIDING_METHODS_MUST_INVOKE_SUPER": {
            "ShortDescription": "Super method is annotated with @OverridingMethodsMustInvokeSuper, but the overriding method isn't calling the super method.",
            "LongDescription": "Super method is annotated with @OverridingMethodsMustInvokeSuper, but {1} isn't calling the super method.",
            "Details": "Super method is annotated with @OverridingMethodsMustInvokeSuper, but the overriding method isn't calling the super method."
        },
        "CNT_ROUGH_CONSTANT_VALUE": {
            "ShortDescription": "Rough value of known constant found",
            "LongDescription": "Rough value of {3} found: {2}",
            "Details": "It's recommended to use the predefined library constant for code clarity and better precision."
        },
        "SKIPPED_CLASS_TOO_BIG": {
            "ShortDescription": "Class too big for analysis",
            "LongDescription": "{0} is too big for analysis",
            "Details": "This class is bigger than can be effectively handled, and was not fully analyzed for errors.\n"
        },
        "NOISE_NULL_DEREFERENCE": {
            "ShortDescription": "Bogus warning about a null pointer dereference",
            "LongDescription": "Bogus warning about a null pointer dereference in {1}",
            "Details": "Bogus warning."
        },
        "NOISE_METHOD_CALL": {
            "ShortDescription": "Bogus warning about a method call",
            "LongDescription": "Bogus warning about a method call {2} in {1}",
            "Details": "Bogus warning."
        },
        "NOISE_FIELD_REFERENCE": {
            "ShortDescription": "Bogus warning about a field reference",
            "LongDescription": "Bogus warning about a reference to {2} in {1}",
            "Details": "Bogus warning."
        },
        "NOISE_OPERATION": {
            "ShortDescription": "Bogus warning about an operation",
            "LongDescription": "Bogus warning about an operation {1}",
            "Details": "Bogus warning."
        },
        "DMI_BIGDECIMAL_CONSTRUCTED_FROM_DOUBLE": {
            "ShortDescription": "BigDecimal constructed from double that isn't represented precisely",
            "LongDescription": "BigDecimal constructed from {4} in {1}",
            "Details": "\nThis code creates a BigDecimal from a double value that doesn't translate well to a\ndecimal number.\nFor example, one might assume that writing new BigDecimal(0.1) in Java creates a BigDecimal which is exactly equal to 0.1 (an unscaled value of 1, with a scale of 1), but it is actually equal to 0.1000000000000000055511151231257827021181583404541015625.\nYou probably want to use the BigDecimal.valueOf(double d) method, which uses the String representation\nof the double to create the BigDecimal (e.g., BigDecimal.valueOf(0.1) gives 0.1).\n"
        },
        "DMI_DOH": {
            "ShortDescription": "D'oh! A nonsensical method invocation",
            "LongDescription": "D'oh! A nonsensical invocation of {2.nameAndSignature} in {1}",
            "Details": "\nThis particular method invocation doesn't make sense, for reasons that should be apparent from inspection.\n"
        },
        "DMI_VACUOUS_CALL_TO_EASYMOCK_METHOD": {
            "ShortDescription": "Useless/vacuous call to EasyMock method",
            "LongDescription": "Useless/vacuous call to {2} in {1}",
            "Details": "This call doesn't pass any objects to the EasyMock method, so the call doesn't do anything.\n"
        },
        "DMI_SCHEDULED_THREAD_POOL_EXECUTOR_WITH_ZERO_CORE_THREADS": {
            "ShortDescription": "Creation of ScheduledThreadPoolExecutor with zero core threads",
            "LongDescription": "Creation of ScheduledThreadPoolExecutor with zero core threads in {1}",
            "Details": "(<a href=\"https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html#ScheduledThreadPoolExecutor-int-\">Javadoc)\nA ScheduledThreadPoolExecutor with zero core threads will never execute anything; changes to the max pool size are ignored.\n"
        },
        "DMI_FUTILE_ATTEMPT_TO_CHANGE_MAXPOOL_SIZE_OF_SCHEDULED_THREAD_POOL_EXECUTOR": {
            "ShortDescription": "Futile attempt to change max pool size of ScheduledThreadPoolExecutor",
            "LongDescription": "Futile attempt to change max pool size of ScheduledThreadPoolExecutor in {1}",
            "Details": "(<a href=\"https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ScheduledThreadPoolExecutor.html\">Javadoc)\nWhile ScheduledThreadPoolExecutor inherits from ThreadPoolExecutor, a few of the inherited tuning methods are not useful for it. In particular, because it acts as a fixed-sized pool using corePoolSize threads and an unbounded queue, adjustments to maximumPoolSize have no useful effect."
        },
        "DMI_UNSUPPORTED_METHOD": {
            "ShortDescription": "Call to unsupported method",
            "LongDescription": "Call to unsupported method {2} in {1}",
            "Details": "All targets of this method invocation throw an UnsupportedOperationException.\n"
        },
        "DMI_EMPTY_DB_PASSWORD": {
            "ShortDescription": "Empty database password",
            "LongDescription": "Empty database password in {1}",
            "Details": "This code creates a database connect using a blank or empty password. This indicates that the database is not protected by a password.\n"
        },
        "DMI_CONSTANT_DB_PASSWORD": {
            "ShortDescription": "Hardcoded constant database password",
            "LongDescription": "Hardcoded constant database password in {1}",
            "Details": "This code creates a database connect using a hardcoded, constant password. Anyone with access to either the source code or the compiled code can easily learn the password.\n"
        },
        "HRS_REQUEST_PARAMETER_TO_COOKIE": {
            "ShortDescription": "HTTP cookie formed from untrusted input",
            "LongDescription": "HTTP cookie formed from untrusted input in {1}",
            "Details": "This code constructs an HTTP Cookie using an untrusted HTTP parameter. If this cookie is added to an HTTP response, it will allow an HTTP response splitting\nvulnerability. See <a href=\"http://en.wikipedia.org/wiki/HTTP_response_splitting\">http://en.wikipedia.org/wiki/HTTP_response_splitting\nfor more information.SpotBugs looks only for the most blatant, obvious cases of HTTP response splitting.\nIf SpotBugs found, youalmost certainlyhave more\nvulnerabilities that SpotBugs doesn't report. If you are concerned about HTTP response splitting, you should seriously\nconsider using a commercial static analysis or pen-testing tool.\n"
        },
        "HRS_REQUEST_PARAMETER_TO_HTTP_HEADER": {
            "ShortDescription": "HTTP Response splitting vulnerability",
            "LongDescription": "HTTP parameter directly written to HTTP header output in {1}",
            "Details": "This code directly writes an HTTP parameter to an HTTP header, which allows for an HTTP response splitting\nvulnerability. See <a href=\"http://en.wikipedia.org/wiki/HTTP_response_splitting\">http://en.wikipedia.org/wiki/HTTP_response_splitting\nfor more information.SpotBugs looks only for the most blatant, obvious cases of HTTP response splitting.\nIf SpotBugs found, youalmost certainlyhave more\nvulnerabilities that SpotBugs doesn't report. If you are concerned about HTTP response splitting, you should seriously\nconsider using a commercial static analysis or pen-testing tool.\n"
        },
        "PT_RELATIVE_PATH_TRAVERSAL": {
            "ShortDescription": "Relative path traversal in servlet",
            "LongDescription": "Relative path traversal in {1}",
            "Details": "The software uses an HTTP request parameter to construct a pathname that should be within a restricted directory, but it does not properly neutralize sequences such as \"..\" that can resolve to a location that is outside of that directory.\n\nSee <a href=\"http://cwe.mitre.org/data/definitions/23.html\">http://cwe.mitre.org/data/definitions/23.html\nfor more information.SpotBugs looks only for the most blatant, obvious cases of relative path traversal.\nIf SpotBugs found, youalmost certainlyhave more\nvulnerabilities that SpotBugs doesn't report. If you are concerned about relative path traversal, you should seriously\nconsider using a commercial static analysis or pen-testing tool.\n"
        },
        "PT_ABSOLUTE_PATH_TRAVERSAL": {
            "ShortDescription": "Absolute path traversal in servlet",
            "LongDescription": "Absolute path traversal in {1}",
            "Details": "The software uses an HTTP request parameter to construct a pathname that should be within a restricted directory,\nbut it does not properly neutralize absolute path sequences such as \"/abs/path\" that can resolve to a location that is outside of that directory.\n\nSee <a href=\"http://cwe.mitre.org/data/definitions/36.html\">http://cwe.mitre.org/data/definitions/36.html\nfor more information.SpotBugs looks only for the most blatant, obvious cases of absolute path traversal.\nIf SpotBugs found, youalmost certainlyhave more\nvulnerabilities that SpotBugs doesn't report. If you are concerned about absolute path traversal, you should seriously\nconsider using a commercial static analysis or pen-testing tool.\n"
        },
        "XSS_REQUEST_PARAMETER_TO_SERVLET_WRITER": {
            "ShortDescription": "Servlet reflected cross site scripting vulnerability",
            "LongDescription": "HTTP parameter written to Servlet output in {1}",
            "Details": "This code directly writes an HTTP parameter to Servlet output, which allows for a reflected cross site scripting\nvulnerability. See <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting\nfor more information.SpotBugs looks only for the most blatant, obvious cases of cross site scripting.\nIf SpotBugs found, youalmost certainlyhave more cross site scripting\nvulnerabilities that SpotBugs doesn't report. If you are concerned about cross site scripting, you should seriously\nconsider using a commercial static analysis or pen-testing tool.\n"
        },
        "XSS_REQUEST_PARAMETER_TO_SEND_ERROR": {
            "ShortDescription": "Servlet reflected cross site scripting vulnerability in error page",
            "LongDescription": "HTTP parameter written to Servlet error page in {1}",
            "Details": "This code directly writes an HTTP parameter to a Server error page (using HttpServletResponse.sendError). Echoing this untrusted input allows\nfor a reflected cross site scripting\nvulnerability. See <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting\nfor more information.SpotBugs looks only for the most blatant, obvious cases of cross site scripting.\nIf SpotBugs found, youalmost certainlyhave more cross site scripting\nvulnerabilities that SpotBugs doesn't report. If you are concerned about cross site scripting, you should seriously\nconsider using a commercial static analysis or pen-testing tool.\n"
        },
        "XSS_REQUEST_PARAMETER_TO_JSP_WRITER": {
            "ShortDescription": "JSP reflected cross site scripting vulnerability",
            "LongDescription": "HTTP parameter directly written to JSP output, giving reflected XSS vulnerability in {1.class}",
            "Details": "This code directly writes an HTTP parameter to JSP output, which allows for a cross site scripting\nvulnerability. See <a href=\"http://en.wikipedia.org/wiki/Cross-site_scripting\">http://en.wikipedia.org/wiki/Cross-site_scripting\nfor more information.SpotBugs looks only for the most blatant, obvious cases of cross site scripting.\nIf SpotBugs found, youalmost certainlyhave more cross site scripting\nvulnerabilities that SpotBugs doesn't report. If you are concerned about cross site scripting, you should seriously\nconsider using a commercial static analysis or pen-testing tool.\n"
        },
        "SW_SWING_METHODS_INVOKED_IN_SWING_THREAD": {
            "ShortDescription": "Certain swing methods need to be invoked in Swing thread",
            "LongDescription": "Call to swing method in {1} needs to be performed in Swing event thread",
            "Details": "(<a href=\"http://web.archive.org/web/20090526170426/http://java.sun.com/developer/JDCTechTips/2003/tt1208.html\">From JDC Tech Tip): The Swing methods\nshow(), setVisible(), and pack() will create the associated peer for the frame.\nWith the creation of the peer, the system creates the event dispatch thread.\nThis makes things problematic because the event dispatch thread could be notifying\nlisteners while pack and validate are still processing. This situation could result in\ntwo threads going through the Swing component-based GUI -- it's a serious flaw that\ncould result in deadlocks or other related threading issues. A pack call causes\ncomponents to be realized. As they are being realized (that is, not necessarily\nvisible), they could trigger listener notification on the event dispatch thread."
        },
        "IL_INFINITE_LOOP": {
            "ShortDescription": "An apparent infinite loop",
            "LongDescription": "There is an apparent infinite loop in {1}",
            "Details": "This loop doesn't seem to have a way to terminate (other than by perhaps\nthrowing an exception)."
        },
        "IL_INFINITE_RECURSIVE_LOOP": {
            "ShortDescription": "An apparent infinite recursive loop",
            "LongDescription": "There is an apparent infinite recursive loop in {1}",
            "Details": "This method unconditionally invokes itself. This would seem to indicate\nan infinite recursive loop that will result in a stack overflow."
        },
        "IL_CONTAINER_ADDED_TO_ITSELF": {
            "ShortDescription": "A collection is added to itself",
            "LongDescription": "A collection is added to itself in {1}",
            "Details": "A collection is added to itself. As a result, computing the hashCode of this\nset will throw a StackOverflowException.\n"
        },
        "VO_VOLATILE_REFERENCE_TO_ARRAY": {
            "ShortDescription": "A volatile reference to an array doesn't treat the array elements as volatile",
            "LongDescription": "{1} is a volatile reference to an array; the array elements are non-volatile",
            "Details": "This declares a volatile reference to an array, which might not be what\nyou want. With a volatile reference to an array, reads and writes of\nthe reference to the array are treated as volatile, but the array elements\nare non-volatile. To get volatile array elements, you will need to use\none of the atomic array classes in java.util.concurrent (provided\nin Java 5.0)."
        },
        "VO_VOLATILE_INCREMENT": {
            "ShortDescription": "An increment to a volatile field isn't atomic",
            "LongDescription": "Increment of volatile field {2} in {1}",
            "Details": "This code increments/decrements a volatile field. Increments/Decrements of volatile fields aren't\natomic. If more than one thread is incrementing/decrementing the field at the same time,\nincrements/decrements could be lost.\n"
        },
        "UI_INHERITANCE_UNSAFE_GETRESOURCE": {
            "ShortDescription": "Usage of GetResource may be unsafe if class is extended",
            "LongDescription": "Usage of GetResource in {1} may be unsafe if class is extended",
            "Details": "Callingcould give\nresults other than expected if this class is extended by a class in\nanother package."
        },
        "NP_BOOLEAN_RETURN_NULL": {
            "ShortDescription": "Method with Boolean return type returns explicit null",
            "LongDescription": "{1} has Boolean return type and returns explicit null",
            "Details": "A method that returns either Boolean.TRUE, Boolean.FALSE or null is an accident waiting to happen. This method can be invoked as though it returned a value of type boolean, and the compiler will insert automatic unboxing of the Boolean value. If a null value is returned, this will result in a NullPointerException."
        },
        "NP_OPTIONAL_RETURN_NULL": {
            "ShortDescription": "Method with Optional return type returns explicit null",
            "LongDescription": "{1} has Optional return type and returns explicit null",
            "Details": "The usage of Optional return type (java.util.Optional or com.google.common.base.Optional) always means that explicit null returns were not desired by design. Returning a null value in such case is a contract violation and will most likely break client code."
        },
        "NP_NONNULL_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR": {
            "ShortDescription": "Non-null field is not initialized",
            "LongDescription": "Non-null field {2.name} is not initialized by {1}",
            "Details": "The field is marked as non-null, but isn't written to by the constructor. The field might be initialized elsewhere during constructor, or might always be initialized before use."
        },
        "NP_SYNC_AND_NULL_CHECK_FIELD": {
            "ShortDescription": "Synchronize and null check on the same field.",
            "LongDescription": "In {1} the field {2.givenClass} is synchronized on and then checked if null.",
            "Details": "Since the field is synchronized on, it seems not likely to be null.\nIf it is null and then synchronized on a NullPointerException will be\nthrown and the check would be pointless. Better to synchronize on\nanother field."
        },
        "RpC_REPEATED_CONDITIONAL_TEST": {
            "ShortDescription": "Repeated conditional tests",
            "LongDescription": "Repeated conditional test in {1}",
            "Details": "The code contains a conditional test is performed twice, one right after the other\n(e.g.,x == 0 || x == 0). Perhaps the second occurrence is intended to be something else\n(e.g.,x == 0 || y == 0"
        },
        "TESTING": {
            "ShortDescription": "Testing",
            "LongDescription": "Test warning generated in {1}",
            "Details": "This bug pattern is only generated by new, incompletely implemented\nbug detectors."
        },
        "TESTING1": {
            "ShortDescription": "Testing 1",
            "LongDescription": "Test warning 1 generated in {1}",
            "Details": "This bug pattern is only generated by new, incompletely implemented\nbug detectors."
        },
        "TESTING2": {
            "ShortDescription": "Testing 2",
            "LongDescription": "Test warning 2 generated in {1}",
            "Details": "This bug pattern is only generated by new, incompletely implemented\nbug detectors."
        },
        "TESTING3": {
            "ShortDescription": "Testing 3",
            "LongDescription": "Test warning 3 generated in {1}",
            "Details": "This bug pattern is only generated by new, incompletely implemented\nbug detectors."
        },
        "UNKNOWN": {
            "ShortDescription": "Unknown bug pattern",
            "LongDescription": "Unknown bug pattern BUG_PATTERN in {1}",
            "Details": "A warning was recorded, but SpotBugs cannot find the description of this bug pattern\nand so cannot describe it. This should occur only in cases of a bug in SpotBugs or its configuration,\nor perhaps if an analysis was generated using a plugin, but that plugin is not currently loaded.\n."
        },
        "AM_CREATES_EMPTY_ZIP_FILE_ENTRY": {
            "ShortDescription": "Creates an empty zip file entry",
            "LongDescription": "Empty zip file entry created in {1}",
            "Details": "The code calls, immediately\nfollowed by a call to. This results\nin an empty ZipFile entry. The contents of the entry\nshould be written to the ZipFile between the calls to\nand\n"
        },
        "AM_CREATES_EMPTY_JAR_FILE_ENTRY": {
            "ShortDescription": "Creates an empty jar file entry",
            "LongDescription": "Empty jar file entry created in {1}",
            "Details": "The code calls, immediately\nfollowed by a call to. This results\nin an empty JarFile entry. The contents of the entry\nshould be written to the JarFile between the calls to\nand\n"
        },
        "IMSE_DONT_CATCH_IMSE": {
            "ShortDescription": "Dubious catching of IllegalMonitorStateException",
            "LongDescription": "Dubious catching of IllegalMonitorStateException in {1}",
            "Details": "IllegalMonitorStateException is generally only thrown in case of a design flaw in your code (calling wait or notify on an object you do not hold a lock on)."
        },
        "FL_MATH_USING_FLOAT_PRECISION": {
            "ShortDescription": "Method performs math using floating point precision",
            "LongDescription": "{1} performs math using floating point precision",
            "Details": "The method performs math operations using floating point precision. Floating point precision is very imprecise. For example, 16777216.0f + 1.0f = 16777216.0f. Consider using double math instead."
        },
        "CAA_COVARIANT_ARRAY_FIELD": {
            "ShortDescription": "Covariant array assignment to a field",
            "LongDescription": "Array of type {2} is assigned to the field of type {3}",
            "Details": "Array of covariant type is assigned to a field. This is confusing and may lead to ArrayStoreException at runtime\nif the reference of some other type will be stored in this array later like in the following code:\nNumber[] arr = new Integer[10];\narr[0] = 1.0;\nConsider changing the type of created array or the field type."
        },
        "CAA_COVARIANT_ARRAY_LOCAL": {
            "ShortDescription": "Covariant array assignment to a local variable",
            "LongDescription": "Array of type {2} is assigned to the variable of type {3}",
            "Details": "Array of covariant type is assigned to a local variable. This is confusing and may lead to ArrayStoreException at runtime\nif the reference of some other type will be stored in this array later like in the following code:\nNumber[] arr = new Integer[10];\narr[0] = 1.0;\nConsider changing the type of created array or the local variable type."
        },
        "CAA_COVARIANT_ARRAY_RETURN": {
            "ShortDescription": "Covariant array is returned from the method",
            "LongDescription": "Array of type {2} is returned from the method which return type is {3}",
            "Details": "Array of covariant type is returned from the method. This is confusing and may lead to ArrayStoreException at runtime\nif the calling code will try to store the reference of some other type in the returned array.\nConsider changing the type of created array or the method return type."
        },
        "CAA_COVARIANT_ARRAY_ELEMENT_STORE": {
            "ShortDescription": "Possibly incompatible element is stored in covariant array",
            "LongDescription": "Value of type {2} is stored into array which element type is {3}",
            "Details": "Value is stored into the array and the value type doesn't match the array type.\nIt's known from the analysis that actual array type is narrower than the declared type of its variable or field\nand this assignment doesn't satisfy the original array type. This assignment may cause ArrayStoreException\nat runtime.\n"
        },
        "CN_IDIOM": {
            "ShortDescription": "Class implements Cloneable but does not define or use clone method",
            "LongDescription": "Class {0} implements Cloneable but does not define or use clone method",
            "Details": "Class implements Cloneable but does not define or use the clone method."
        },
        "CN_IMPLEMENTS_CLONE_BUT_NOT_CLONEABLE": {
            "ShortDescription": "Class defines clone() but doesn't implement Cloneable",
            "LongDescription": "{0} defines clone() but doesn't implement Cloneable",
            "Details": "This class defines a clone() method but the class doesn't implement Cloneable.\nThere are some situations in which this is OK (e.g., you want to control how subclasses\ncan clone themselves), but just make sure that this is what you intended.\n"
        },
        "CN_IDIOM_NO_SUPER_CALL": {
            "ShortDescription": "clone method does not call super.clone()",
            "LongDescription": "{1} does not call super.clone()",
            "Details": "This non-final class defines a clone() method that does not call super.clone().\nIf this class (\"\") is extended by a subclass (\"\"),\nand the subclasscalls super.clone(), then it is likely that\n's clone() method will return an object of type,\nwhich violates the standard contract for clone().If all clone() methods call super.clone(), then they are guaranteed\nto use Object.clone(), which always returns an object of the correct type."
        },
        "NM_FUTURE_KEYWORD_USED_AS_IDENTIFIER": {
            "ShortDescription": "Use of identifier that is a keyword in later versions of Java",
            "LongDescription": "{1} uses {2} for a variable name, which is a keyword in later versions of Java",
            "Details": "The identifier is a word that is reserved as a keyword in later versions of Java, and your code will need to be changed\nin order to compile it in later versions of Java."
        },
        "NM_FUTURE_KEYWORD_USED_AS_MEMBER_IDENTIFIER": {
            "ShortDescription": "Use of identifier that is a keyword in later versions of Java",
            "LongDescription": "{1} conflicts with a keyword in a more recent version of Java",
            "Details": "This identifier is used as a keyword in later versions of Java. This code, and\nany code that references this API,\nwill need to be changed in order to compile it in later versions of Java."
        },
        "DE_MIGHT_DROP": {
            "ShortDescription": "Method might drop exception",
            "LongDescription": "{1} might drop {2}",
            "Details": "This method might drop an exception.&nbsp; In general, exceptions should be handled or reported in some way, or they should be thrown out of the method."
        },
        "DE_MIGHT_IGNORE": {
            "ShortDescription": "Method might ignore exception",
            "LongDescription": "{1} might ignore {2}",
            "Details": "This method might ignore an exception.&nbsp; In general, exceptions should be handled or reported in some way, or they should be thrown out of the method."
        },
        "DP_DO_INSIDE_DO_PRIVILEGED": {
            "ShortDescription": "Method invoked that should be only be invoked inside a doPrivileged block",
            "LongDescription": "Invocation of {2}, which should be invoked from within a doPrivileged block, in {1}",
            "Details": "This code invokes a method that requires a security permission check. If this code will be granted security permissions, but might be invoked by code that does not have security permissions, then the invocation needs to occur inside a doPrivileged block."
        },
        "DP_DO_INSIDE_DO_PRIVILEDGED": {
            "ShortDescription": "Method invoked that should be only be invoked inside a doPrivileged block",
            "LongDescription": "Invocation of {2}, which should be invoked from within a doPrivileged block, in {1}",
            "Details": "This code invokes a method that requires a security permission check. If this code will be granted security permissions, but might be invoked by code that does not have security permissions, then the invocation needs to occur inside a doPrivileged block."
        },
        "DP_CREATE_CLASSLOADER_INSIDE_DO_PRIVILEGED": {
            "ShortDescription": "Classloaders should only be created inside doPrivileged block",
            "LongDescription": "{1} creates a {2} classloader, which should be performed within a doPrivileged block",
            "Details": "This code creates a classloader,  which needs permission if a security manage is installed. If this code might be invoked by code that does not have security permissions, then the classloader creation needs to occur inside a doPrivileged block."
        },
        "JCIP_FIELD_ISNT_FINAL_IN_IMMUTABLE_CLASS": {
            "ShortDescription": "Fields of immutable classes should be final",
            "LongDescription": "{1.givenClass} should be final since {0} is marked as Immutable.",
            "Details": "The class is annotated with net.jcip.annotations.Immutable or javax.annotation.concurrent.Immutable, and the rules for those annotations require that all fields are final. ."
        },
        "DMI_THREAD_PASSED_WHERE_RUNNABLE_EXPECTED": {
            "ShortDescription": "Thread passed where Runnable expected",
            "LongDescription": "Thread passed where Runnable expected in {1}",
            "Details": "A Thread object is passed as a parameter to a method where\na Runnable is expected. This is rather unusual, and may indicate a logic error\nor cause unexpected behavior."
        },
        "DMI_COLLECTION_OF_URLS": {
            "ShortDescription": "Maps and sets of URLs can be performance hogs",
            "LongDescription": "{1} is or uses a map or set of URLs, which can be a performance hog",
            "Details": "This method or field is or uses a Map or Set of URLs. Since both the equals and hashCode\nmethod of URL perform domain name resolution, this can result in a big performance hit.\nSee <a href=\"http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html\">http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.htmlfor more information.\nConsider usinginstead."
        },
        "DMI_BLOCKING_METHODS_ON_URL": {
            "ShortDescription": "The equals and hashCode methods of URL are blocking",
            "LongDescription": "Invocation of {2}, which blocks to do domain name resolution, in {1}",
            "Details": "The equals and hashCode\nmethod of URL perform domain name resolution, this can result in a big performance hit.\nSee <a href=\"http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.html\">http://michaelscharf.blogspot.com/2006/11/javaneturlequals-and-hashcode-make.htmlfor more information.\nConsider usinginstead."
        },
        "DMI_ANNOTATION_IS_NOT_VISIBLE_TO_REFLECTION": {
            "ShortDescription": "Cannot use reflection to check for presence of annotation without runtime retention",
            "LongDescription": "Use of reflection to check for the presence the annotation {3} which doesn't have runtime retention, in {1}",
            "Details": "Unless an annotation has itself been annotated with  @Retention(RetentionPolicy.RUNTIME), the annotation cannot be observed using reflection\n(e.g., by using the isAnnotationPresent method). ."
        },
        "DM_EXIT": {
            "ShortDescription": "Method invokes System.exit(...)",
            "LongDescription": "{1} invokes System.exit(...), which shuts down the entire virtual machine",
            "Details": "Invoking System.exit shuts down the entire Java virtual machine. This should only been done when it is appropriate. Such calls make it hard or impossible for your code to be invoked by other code. Consider throwing a RuntimeException instead."
        },
        "DM_RUN_FINALIZERS_ON_EXIT": {
            "ShortDescription": "Method invokes dangerous method runFinalizersOnExit",
            "LongDescription": "{1} invokes dangerous method runFinalizersOnExit",
            "Details": "Never call System.runFinalizersOnExit\nor Runtime.runFinalizersOnExit for any reason: they are among the most\ndangerous methods in the Java libraries.-- Joshua Bloch"
        },
        "DM_STRING_CTOR": {
            "ShortDescription": "Method invokes inefficient new String(String) constructor",
            "LongDescription": "{1} invokes inefficient new String(String) constructor",
            "Details": "Using theconstructor wastes memory because the object so constructed will be functionally indistinguishable from thepassed as a parameter.&nbsp; Just use the argumentdirectly."
        },
        "DM_STRING_VOID_CTOR": {
            "ShortDescription": "Method invokes inefficient new String() constructor",
            "LongDescription": "{1} invokes inefficient new String() constructor",
            "Details": "Creating a newobject using the no-argument constructor wastes memory because the object so created will be functionally indistinguishable from the empty string constant.&nbsp; Java guarantees that identical string constants will be represented by the sameobject.&nbsp; Therefore, you should just use the empty string constant directly."
        },
        "DM_STRING_TOSTRING": {
            "ShortDescription": "Method invokes toString() method on a String",
            "LongDescription": "{1} invokes toString() method on a String",
            "Details": "Callingis a redundant operation. Just use the String."
        },
        "DM_GC": {
            "ShortDescription": "Explicit garbage collection; extremely dubious except in benchmarking code",
            "LongDescription": "{1} forces garbage collection; extremely dubious except in benchmarking code",
            "Details": "Code explicitly invokes garbage collection. Except for specific use in benchmarking, this is very dubious.In the past, situations where people have explicitly invoked the garbage collector in routines such as close or finalize methods has led to huge performance black holes. Garbage collection can be expensive. Any situation that forces hundreds or thousands of garbage collections will bring the machine to a crawl."
        },
        "DM_BOOLEAN_CTOR": {
            "ShortDescription": "Method invokes inefficient Boolean constructor; use Boolean.valueOf(...) instead",
            "LongDescription": "{1} invokes inefficient Boolean constructor; use Boolean.valueOf(...) instead",
            "Details": "Creating new instances ofwastes memory, sinceobjects are immutable and there are only two useful values of this type.&nbsp; Use themethod (or Java 5 autoboxing) to createobjects instead."
        },
        "DM_NUMBER_CTOR": {
            "ShortDescription": "Method invokes inefficient Number constructor; use static valueOf instead",
            "LongDescription": "{1} invokes inefficient {2} constructor; use {3} instead",
            "Details": "Usingnew Integer(int)is guaranteed to always result in a new object whereasallows caching of values to be done by the compiler, class library, or JVM. Using of cached values avoids object allocation and the code will be faster.Values between -128 and 127 are guaranteed to have corresponding cached instances and usingis approximately 3.5 times faster than using constructor. For values outside the constant range the performance of both styles is the same.Unless the class must be compatible with JVMs predating Java 5, use either autoboxing or themethod when creating instances of,,,, and."
        },
        "DM_FP_NUMBER_CTOR": {
            "ShortDescription": "Method invokes inefficient floating-point Number constructor; use static valueOf instead",
            "LongDescription": "{1} invokes inefficient {2} constructor; use {3} instead",
            "Details": "Usingnew Double(double)is guaranteed to always result in a new object whereasallows caching of values to be done by the compiler, class library, or JVM. Using of cached values avoids object allocation and the code will be faster.Unless the class must be compatible with JVMs predating Java 5, use either autoboxing or themethod when creating instances ofand."
        },
        "DM_CONVERT_CASE": {
            "ShortDescription": "Consider using Locale parameterized version of invoked method",
            "LongDescription": "Use of non-localized String.toUpperCase() or String.toLowerCase() in {1}",
            "Details": "A String is being converted to upper or lowercase, using the platform's default encoding. This may result in improper conversions when used with international characters. Use theString.toUpperCase( Locale l )String.toLowerCase( Locale l )versions instead."
        },
        "BX_UNBOXED_AND_COERCED_FOR_TERNARY_OPERATOR": {
            "ShortDescription": "Primitive value is unboxed and coerced for ternary operator",
            "LongDescription": "Primitive value is unboxed and coerced for ternary operator in {1}",
            "Details": "A wrapped primitive value is unboxed and converted to another primitive type as part of the\nevaluation of a conditional ternary operator (theb ? e1 : e2operator). The\nsemantics of Java mandate that ifandare wrapped\nnumeric values, the values are unboxed and converted/coerced to their common type (e.g,\nifis of type\nandis of type, thenis unboxed,\nconverted to a floating point value, and boxed. See JLS Section 15.25.\n"
        },
        "BX_BOXING_IMMEDIATELY_UNBOXED": {
            "ShortDescription": "Primitive value is boxed and then immediately unboxed",
            "LongDescription": "Primitive value is boxed and then immediately unboxed in {1}",
            "Details": "A primitive is boxed, and then immediately unboxed. This probably is due to a manual boxing in a place where an unboxed value is required, thus forcing the compiler\nto immediately undo the work of the boxing.\n"
        },
        "BX_UNBOXING_IMMEDIATELY_REBOXED": {
            "ShortDescription": "Boxed value is unboxed and then immediately reboxed",
            "LongDescription": "Boxed value is unboxed and then immediately reboxed in {1}",
            "Details": "A boxed value is unboxed and then immediately reboxed.\n"
        },
        "BX_BOXING_IMMEDIATELY_UNBOXED_TO_PERFORM_COERCION": {
            "ShortDescription": "Primitive value is boxed then unboxed to perform primitive coercion",
            "LongDescription": "Primitive value is boxed then unboxed to perform primitive coercion in {1}",
            "Details": "A primitive boxed value constructed and then immediately converted into a different primitive type\n(e.g.,new Double(d).intValue()). Just perform direct primitive coercion (e.g.,(int) d"
        },
        "DM_BOXED_PRIMITIVE_TOSTRING": {
            "ShortDescription": "Method allocates a boxed primitive just to call toString",
            "LongDescription": "Primitive boxed just to call toString in {1}",
            "Details": "A boxed primitive is allocated just to call toString(). It is more effective to just use the static form of toString which takes the primitive value. So,With this...new Integer(1).toString()new Long(1).toString()new Float(1.0).toString()new Double(1.0).toString()new Byte(1).toString()new Short(1).toString()new Boolean(true).toString()"
        },
        "DM_BOXED_PRIMITIVE_FOR_PARSING": {
            "ShortDescription": "Boxing/unboxing to parse a primitive",
            "LongDescription": "Boxing/unboxing to parse a primitive {1}",
            "Details": "A boxed primitive is created from a String, just to extract the unboxed primitive value. It is more efficient to just call the static parseXXX method."
        },
        "DM_BOXED_PRIMITIVE_FOR_COMPARE": {
            "ShortDescription": "Boxing a primitive to compare",
            "LongDescription": "Primitive is boxed to call {2}: use {3} instead",
            "Details": "A boxed primitive is created just to callmethod. It's more efficient to use static compare method (for double and float since Java 1.4, for other primitive types since Java 7) which works on primitives directly."
        },
        "DM_NEW_FOR_GETCLASS": {
            "ShortDescription": "Method allocates an object, only to get the class object",
            "LongDescription": "{1} allocates an object, only to get the class object",
            "Details": "This method allocates an object just to call getClass() on it, in order to retrieve the Class object for it. It is simpler to just access the .class property of the class."
        },
        "DM_MONITOR_WAIT_ON_CONDITION": {
            "ShortDescription": "Monitor wait() called on Condition",
            "LongDescription": "Monitor wait() called on a Condition in {1}",
            "Details": "This method callson aobject.&nbsp; Waiting for ashould be done using one of themethods defined by theinterface."
        },
        "RV_01_TO_INT": {
            "ShortDescription": "Random value from 0 to 1 is coerced to the integer 0",
            "LongDescription": "{1} uses generates a random value from 0 to 1 and then coerces that value to the integer 0",
            "Details": "A random value from 0 to 1 is being coerced to the integer value 0. You probably\nwant to multiply the random value by something else before coercing it to an integer, or use themethod.\n"
        },
        "DM_INVALID_MIN_MAX": {
            "ShortDescription": "Incorrect combination of Math.max and Math.min",
            "LongDescription": "Incorrect combination of Math.max and Math.min: this code always returns {2}",
            "Details": "This code tries to limit the value bounds using the construct like Math.min(0, Math.max(100, value)). However the order of the constants is incorrect: it should be Math.min(100, Math.max(0, value)). As the result this code always produces the same result (or NaN if the value is NaN)."
        },
        "DM_NEXTINT_VIA_NEXTDOUBLE": {
            "ShortDescription": "Use the nextInt method of Random rather than nextDouble to generate a random integer",
            "LongDescription": "{1} uses the nextDouble method of Random to generate a random integer; using nextInt is more efficient",
            "Details": "Ifis a, you can generate a random number fromto\nusing, rather than using(int)(r.nextDouble() * n)The argument to nextInt must be positive. If, for example, you want to generate a random\nvalue from -99 to 0, use"
        },
        "SQL_NONCONSTANT_STRING_PASSED_TO_EXECUTE": {
            "ShortDescription": "Nonconstant string passed to execute or addBatch method on an SQL statement",
            "LongDescription": "{1} passes a nonconstant String to an execute or addBatch method on an SQL statement",
            "Details": "The method invokes the execute or addBatch method on an SQL statement with a String that seems\nto be dynamically generated. Consider using\na prepared statement instead. It is more efficient and less vulnerable to\nSQL injection attacks.\n"
        },
        "SQL_PREPARED_STATEMENT_GENERATED_FROM_NONCONSTANT_STRING": {
            "ShortDescription": "A prepared statement is generated from a nonconstant String",
            "LongDescription": "A prepared statement is generated from a nonconstant String in {1}",
            "Details": "The code creates an SQL prepared statement from a nonconstant String.\nIf unchecked, tainted data from a user is used in building this String, SQL injection could\nbe used to make the prepared statement do something unexpected and undesirable.\n"
        },
        "DM_USELESS_THREAD": {
            "ShortDescription": "A thread was created using the default empty run method",
            "LongDescription": "{1} creates a thread using the default empty run method",
            "Details": "This method creates a thread without specifying a run method either by deriving from the Thread class, or by passing a Runnable object. This thread, then, does nothing but waste time.\n"
        },
        "DC_DOUBLECHECK": {
            "ShortDescription": "Possible double-check of field",
            "LongDescription": "Possible double-check on {2} in {1}",
            "Details": "This method may contain an instance of double-checked locking.&nbsp; This idiom is not correct according to the semantics of the Java memory model.&nbsp; For more information, see the web page <a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html\" >http://www.cs.umd.edu/~pugh/java/memoryModel/DoubleCheckedLocking.html"
        },
        "DC_PARTIALLY_CONSTRUCTED": {
            "ShortDescription": "Possible exposure of partially initialized object",
            "LongDescription": "Possible exposure of partially initialized object in {1}",
            "Details": "Looks like this method uses lazy field initialization with double-checked locking. While the field is correctly declared as volatile, it's possible that the internal structure of the object is changed after the field assignment, thus another thread may see the partially initialized object.To fix this problem consider storing the object into the local variable first and save it to the volatile field only after it's fully constructed."
        },
        "FI_FINALIZER_NULLS_FIELDS": {
            "ShortDescription": "Finalizer nulls fields",
            "LongDescription": "{3} is set to null inside finalize method in {1.class}",
            "Details": "This finalizer nulls out fields.  This is usually an error, as it does not aid garbage collection, and the object is going to be garbage collected anyway."
        },
        "FI_FINALIZER_ONLY_NULLS_FIELDS": {
            "ShortDescription": "Finalizer only nulls fields",
            "LongDescription": "{1} only nulls fields",
            "Details": "This finalizer does nothing except null out fields. This is completely pointless, and requires that\nthe object be garbage collected, finalized, and then garbage collected again. You should just remove the finalize\nmethod."
        },
        "FI_PUBLIC_SHOULD_BE_PROTECTED": {
            "ShortDescription": "Finalizer should be protected, not public",
            "LongDescription": "{1} is public; should be protected",
            "Details": "A class'smethod should have protected access, not public."
        },
        "FI_EMPTY": {
            "ShortDescription": "Empty finalizer should be deleted",
            "LongDescription": "{1} is empty and should be deleted",
            "Details": "Emptymethods are useless, so they should be deleted."
        },
        "FI_NULLIFY_SUPER": {
            "ShortDescription": "Finalizer nullifies superclass finalizer",
            "LongDescription": "{1} is nullifying {2}.finalize(); is this intended?",
            "Details": "This emptymethod explicitly negates the effect of any finalizer defined by its superclass.&nbsp; Any finalizer actions defined for the superclass will not be performed.&nbsp; Unless this is intended, delete this method."
        },
        "FI_USELESS": {
            "ShortDescription": "Finalizer does nothing but call superclass finalizer",
            "LongDescription": "{1} does nothing except call super.finalize(); delete it",
            "Details": "The only thing thismethod does is call the superclass'smethod, making it redundant.&nbsp; Delete it."
        },
        "FI_MISSING_SUPER_CALL": {
            "ShortDescription": "Finalizer does not call superclass finalizer",
            "LongDescription": "{1} missing call to super.finalize(), so {2}.finalize() doesn't get called",
            "Details": "Thismethod does not make a call to its superclass'smethod.&nbsp; So, any finalizer actions defined for the superclass will not be performed.&nbsp; Add a call to"
        },
        "FI_EXPLICIT_INVOCATION": {
            "ShortDescription": "Explicit invocation of finalizer",
            "LongDescription": "Explicit invocation of {2} in {1}",
            "Details": "This method contains an explicit invocation of themethod on an object.&nbsp; Because finalizer methods are supposed to be executed once, and only by the VM, this is a bad idea.If a connected set of objects beings finalizable, then the VM will invoke the\nfinalize method on all the finalizable object, possibly at the same time in different threads.\nThus, it is a particularly bad idea, in the finalize method for a class X, invoke finalize\non objects referenced by X, because they may already be getting finalized in a separate thread."
        },
        "EQ_CHECK_FOR_OPERAND_NOT_COMPATIBLE_WITH_THIS": {
            "ShortDescription": "Equals checks for incompatible operand",
            "LongDescription": "{1} checks for operand being a {2.givenClass}",
            "Details": "This equals method is checking to see if the argument is some incompatible type\n(i.e., a class that is neither a supertype nor subtype of the class that defines\nthe equals method). For example, the Foo class might have an equals method\nthat looks like:\npublic boolean equals(Object o) { if (o instanceof Foo) return name.equals(((Foo)o).name); else if (o instanceof String) return name.equals(o); else return false;\n}\nThis is considered bad practice, as it makes it very hard to implement an equals method that\nis symmetric and transitive. Without those properties, very unexpected behaviors are possible.\n"
        },
        "EQ_DONT_DEFINE_EQUALS_FOR_ENUM": {
            "ShortDescription": "Covariant equals() method defined for enum",
            "LongDescription": "Enum {0} defines equals({0.givenClass})",
            "Details": "This class defines an enumeration, and equality on enumerations are defined\nusing object identity. Defining a covariant equals method for an enumeration\nvalue is exceptionally bad practice, since it would likely result\nin having two different enumeration values that compare as equals using\nthe covariant enum method, and as not equal when compared normally.\nDon't do it.\n"
        },
        "EQ_SELF_USE_OBJECT": {
            "ShortDescription": "Covariant equals() method defined, Object.equals(Object) inherited",
            "LongDescription": "{0} defines equals({0.givenClass}) method and uses Object.equals(Object)",
            "Details": "This class defines a covariant version of themethod, but inherits the normalmethod defined in the baseclass.&nbsp; The class should probably define aboolean equals(Object)method."
        },
        "EQ_OTHER_USE_OBJECT": {
            "ShortDescription": "equals() method defined that doesn't override Object.equals(Object)",
            "LongDescription": "{0} defines {1.givenClass} method and uses Object.equals(Object)",
            "Details": "This class defines anmethod, that doesn't override the normalmethod defined in the baseclass.&nbsp; The class should probably define aboolean equals(Object)method."
        },
        "EQ_OTHER_NO_OBJECT": {
            "ShortDescription": "equals() method defined that doesn't override equals(Object)",
            "LongDescription": "{0} defines {1.givenClass} method that doesn't override equals(Object)",
            "Details": "This class defines anmethod, that doesn't override the normalmethod defined in the baseclass.&nbsp; Instead, it inherits anmethod from a superclass. The class should probably define aboolean equals(Object)method."
        },
        "EQ_DOESNT_OVERRIDE_EQUALS": {
            "ShortDescription": "Class doesn't override equals in superclass",
            "LongDescription": "{0} doesn't override {2.givenClass}",
            "Details": "This class extends a class that defines an equals method and adds fields, but doesn't\ndefine an equals method itself. Thus, equality on instances of this class will\nignore the identity of the subclass and the added fields. Be sure this is what is intended,\nand that you don't need to override the equals method. Even if you don't need to override\nthe equals method, consider overriding it anyway to document the fact\nthat the equals method for the subclass just return the result of\ninvoking super.equals(o)."
        },
        "EQ_SELF_NO_OBJECT": {
            "ShortDescription": "Covariant equals() method defined",
            "LongDescription": "{0} defines equals({0.givenClass}) method but not equals(Object)",
            "Details": "This class defines a covariant version of.&nbsp; To correctly override themethod in, the parameter ofmust have type"
        },
        "EQ_OVERRIDING_EQUALS_NOT_SYMMETRIC": {
            "ShortDescription": "equals method overrides equals in superclass and may not be symmetric",
            "LongDescription": "{1.class} overrides equals in {2.class.givenClass} and may not be symmetric",
            "Details": "This class defines an equals method that overrides an equals method in a superclass. Both equals methods\nusein the determination of whether two objects are equal. This is fraught with peril,\nsince it is important that the equals method is symmetrical (in other words,a.equals(b) == b.equals(a)).\nIf B is a subtype of A, and A's equals method checks that the argument is an instanceof A, and B's equals method\nchecks that the argument is an instanceof B, it is quite likely that the equivalence relation defined by these\nmethods is not symmetric.\n"
        },
        "EQ_GETCLASS_AND_CLASS_CONSTANT": {
            "ShortDescription": "equals method fails for subtypes",
            "LongDescription": "{1} fails for subtypes",
            "Details": "This class has an equals method that will be broken if it is inherited by subclasses.\nIt compares a class literal with the class of the argument (e.g., in class\nit might check ifFoo.class == o.getClass()).\nIt is better to check ifthis.getClass() == o.getClass()"
        },
        "EQ_UNUSUAL": {
            "ShortDescription": "Unusual equals method",
            "LongDescription": "{1} is unusual",
            "Details": "This class doesn't do any of the patterns we recognize for checking that the type of the argument\nis compatible with the type of theobject. There might not be anything wrong with\nthis code, but it is worth reviewing.\n"
        },
        "EQ_COMPARING_CLASS_NAMES": {
            "ShortDescription": "equals method compares class names rather than class objects",
            "LongDescription": "{1} compares class names rather than class objects",
            "Details": "This class defines an equals method that checks to see if two objects are the same class by checking to see if the names\nof their classes are equal. You can have different classes with the same name if they are loaded by\ndifferent class loaders. Just check to see if the class objects are the same.\n"
        },
        "EQ_ALWAYS_TRUE": {
            "ShortDescription": "equals method always returns true",
            "LongDescription": "{1} always returns true",
            "Details": "This class defines an equals method that always returns true. This is imaginative, but not very smart.\nPlus, it means that the equals method is not symmetric.\n"
        },
        "EQ_ALWAYS_FALSE": {
            "ShortDescription": "equals method always returns false",
            "LongDescription": "{1} always returns false",
            "Details": "This class defines an equals method that always returns false. This means that an object is not equal to itself, and it is impossible to create useful Maps or Sets of this class. More fundamentally, it means\nthat equals is not reflexive, one of the requirements of the equals method.The likely intended semantics are object identity: that an object is equal to itself. This is the behavior inherited from class. If you need to override an equals inherited from a different\nsuperclass, you can use:public boolean equals(Object o) { return this == o;\n}\n"
        },
        "HSC_HUGE_SHARED_STRING_CONSTANT": {
            "ShortDescription": "Huge string constants is duplicated across multiple class files",
            "LongDescription": "{1} is initialized to a string constant {2} characters long that is duplicated in {3} other class files",
            "Details": "A large String constant is duplicated across multiple class files. This is likely because a final field is initialized to a String constant, and the Java language mandates that all references to a final field from other classes be inlined into\nthat classfile. See <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6447475\">JDK bug 6447475for a description of an occurrence of this bug in the JDK and how resolving it reduced the size of the JDK by 1 megabyte.\n"
        },
        "NP_ARGUMENT_MIGHT_BE_NULL": {
            "ShortDescription": "Method does not check for null argument",
            "LongDescription": "{1} does not check for null argument",
            "Details": "A parameter to this method has been identified as a value that should always be checked to see whether or not it is null, but it is being dereferenced without a preceding null check."
        },
        "NP_EQUALS_SHOULD_HANDLE_NULL_ARGUMENT": {
            "ShortDescription": "equals() method does not check for null argument",
            "LongDescription": "{1} does not check for null argument",
            "Details": "This implementation of equals(Object) violates the contract defined by java.lang.Object.equals() because it does not check for null being passed as the argument.  All equals() methods should return false if passed a null value."
        },
        "RV_NEGATING_RESULT_OF_COMPARETO": {
            "ShortDescription": "Negating the result of compareTo()/compare()",
            "LongDescription": "{1} negates the return value of {2}",
            "Details": "This code negates the return value of a compareTo or compare method.\nThis is a questionable or bad programming practice, since if the return\nvalue is Integer.MIN_VALUE, negating the return value won't\nnegate the sign of the result. You can achieve the same intended result\nby reversing the order of the operands rather than by negating the results.\n"
        },
        "CO_COMPARETO_RESULTS_MIN_VALUE": {
            "ShortDescription": "compareTo()/compare() returns Integer.MIN_VALUE",
            "LongDescription": "{1} returns Integer.MIN_VALUE, which cannot be negated",
            "Details": "In some situation, this compareTo or compare method returns\nthe  constant Integer.MIN_VALUE, which is an exceptionally bad practice. The only thing that matters about the return value of compareTo is the sign of the result. But people will sometimes negate the return value of compareTo, expecting that this will negate the sign of the result. And it will, except in the case where the value returned is Integer.MIN_VALUE. So just return -1 rather than Integer.MIN_VALUE."
        },
        "CO_COMPARETO_INCORRECT_FLOATING": {
            "ShortDescription": "compareTo()/compare() incorrectly handles float or double value",
            "LongDescription": "{1} incorrectly handles {2} value",
            "Details": "This method compares double or float values using pattern like this: val1 &gt; val2 ? 1 : val1 &lt; val2 ? -1 : 0.\nThis pattern works incorrectly for -0.0 and NaN values which may result in incorrect sorting result or broken collection\n(if compared values are used as keys). Consider using Double.compare or Float.compare static methods which handle all\nthe special cases correctly."
        },
        "CO_SELF_NO_OBJECT": {
            "ShortDescription": "Covariant compareTo() method defined",
            "LongDescription": "{0} defines compareTo({0.givenClass}) method but not compareTo(Object)",
            "Details": "This class defines a covariant version of.&nbsp; To correctly override themethod in theinterface, the parameter ofmust have type"
        },
        "HE_SIGNATURE_DECLARES_HASHING_OF_UNHASHABLE_CLASS": {
            "ShortDescription": "Signature declares use of unhashable class in hashed construct",
            "LongDescription": "{2} doesn't define a hashCode() method but it is used in a hashed context in {1}",
            "Details": "A method, field or class declares a generic signature where a non-hashable class\nis used in context where a hashable class is required.\nA class that declares an equals method but inherits a hashCode() method\nfrom Object is unhashable, since it doesn't fulfill the requirement that\nequal objects have equal hashCodes.\n"
        },
        "HE_USE_OF_UNHASHABLE_CLASS": {
            "ShortDescription": "Use of class without a hashCode() method in a hashed data structure",
            "LongDescription": "{2} doesn't define a hashCode() method but is used in a hashed data structure in {1}",
            "Details": "A class defines an equals(Object)  method but not a hashCode() method,\nand thus doesn't fulfill the requirement that equal objects have equal hashCodes.\nAn instance of this class is used in a hash data structure, making the need to\nfix this problem of highest importance."
        },
        "HE_HASHCODE_USE_OBJECT_EQUALS": {
            "ShortDescription": "Class defines hashCode() and uses Object.equals()",
            "LongDescription": "{0} defines hashCode and uses Object.equals()",
            "Details": "This class defines amethod but inherits itsmethod from(which defines equality by comparing object references).&nbsp; Although this will probably satisfy the contract that equal objects must have equal hashcodes, it is probably not what was intended by overriding themethod.&nbsp; (Overridingimplies that the object's identity is based on criteria more complicated than simple reference equality.)If you don't think instances of this class will ever be inserted into a HashMap/HashTable,\nthe recommendedimplementation to use is:public int hashCode() { assert false : \"hashCode not designed\"; return 42; // any arbitrary constant will do\n}\n"
        },
        "EQ_COMPARETO_USE_OBJECT_EQUALS": {
            "ShortDescription": "Class defines compareTo(...) and uses Object.equals()",
            "LongDescription": "{0} defines {1.givenClass} and uses Object.equals()",
            "Details": "This class defines amethod but inherits itsmethod from. Generally, the value of compareTo should return zero if and only if equals returns true. If this is violated, weird and unpredictable failures will occur in classes such as PriorityQueue. In Java 5 the PriorityQueue.remove method uses the compareTo method, while in Java 6 it uses the equals method.From the JavaDoc for the compareTo method in the Comparable interface:\n\nIt is strongly recommended, but not strictly required that(x.compareTo(y)==0) == (x.equals(y)).\nGenerally speaking, any class that implements the Comparable interface and violates this condition\nshould clearly indicate this fact. The recommended language\nis \"Note: this class has a natural ordering that is inconsistent with equals.\"\n"
        },
        "HE_HASHCODE_NO_EQUALS": {
            "ShortDescription": "Class defines hashCode() but not equals()",
            "LongDescription": "{0} defines hashCode but not equals",
            "Details": "This class defines amethod but not anmethod.&nbsp; Therefore, the class may violate the invariant that equal objects must have equal hashcodes."
        },
        "HE_EQUALS_USE_HASHCODE": {
            "ShortDescription": "Class defines equals() and uses Object.hashCode()",
            "LongDescription": "{0} defines equals and uses Object.hashCode()",
            "Details": "This class overrides, but does not override, and inherits the implementation offrom(which returns the identity hash code, an arbitrary value assigned to the object by the VM).&nbsp; Therefore, the class is very likely to violate the invariant that equal objects must have equal hashcodes.If you don't think instances of this class will ever be inserted into a HashMap/HashTable,\nthe recommendedimplementation to use is:public int hashCode() { assert false : \"hashCode not designed\"; return 42; // any arbitrary constant will do\n}\n"
        },
        "HE_INHERITS_EQUALS_USE_HASHCODE": {
            "ShortDescription": "Class inherits equals() and uses Object.hashCode()",
            "LongDescription": "{0} inherits equals and uses Object.hashCode()",
            "Details": "This class inheritsfrom an abstract superclass, andfrom\n(which returns the identity hash code, an arbitrary value assigned to the object by the VM).&nbsp; Therefore, the class is very likely to violate the invariant that equal objects must have equal hashcodes.\nIf you don't want to define a hashCode method, and/or don't believe the object will ever be put into a HashMap/Hashtable, define themethod to throw"
        },
        "HE_EQUALS_NO_HASHCODE": {
            "ShortDescription": "Class defines equals() but not hashCode()",
            "LongDescription": "{0} defines equals but not hashCode",
            "Details": "This class overrides, but does not override.&nbsp; Therefore, the class may violate the invariant that equal objects must have equal hashcodes."
        },
        "EQ_ABSTRACT_SELF": {
            "ShortDescription": "Abstract class defines covariant equals() method",
            "LongDescription": "Abstract {0} defines equals({0.givenClass}) method",
            "Details": "This class defines a covariant version of.&nbsp; To correctly override themethod in, the parameter ofmust have type"
        },
        "ES_COMPARING_STRINGS_WITH_EQ": {
            "ShortDescription": "Comparison of String objects using == or !=",
            "LongDescription": "Comparison of String objects using == or != in {1}",
            "Details": "This code comparesobjects for reference\nequality using the == or != operators.\nUnless both strings are either constants in a source file, or have been\ninterned using themethod, the same string\nvalue may be represented by two different String objects. Consider\nusing themethod instead."
        },
        "ES_COMPARING_PARAMETER_STRING_WITH_EQ": {
            "ShortDescription": "Comparison of String parameter using == or !=",
            "LongDescription": "Comparison of String parameter using == or != in {1}",
            "Details": "This code compares aparameter for reference\nequality using the == or != operators. Requiring callers to\npass only String constants or interned strings to a method is unnecessarily\nfragile, and rarely leads to measurable performance gains. Consider\nusing themethod instead."
        },
        "CO_ABSTRACT_SELF": {
            "ShortDescription": "Abstract class defines covariant compareTo() method",
            "LongDescription": "Abstract {0} defines compareTo({0.givenClass}) method",
            "Details": "This class defines a covariant version of.&nbsp; To correctly override themethod in theinterface, the parameter ofmust have type"
        },
        "IS_FIELD_NOT_GUARDED": {
            "ShortDescription": "Field not guarded against concurrent access",
            "LongDescription": "{1.givenClass} not guarded against concurrent access; locked {2}% of time",
            "Details": "This field is annotated with net.jcip.annotations.GuardedBy or javax.annotation.concurrent.GuardedBy,\nbut can be accessed in a way that seems to violate those annotations."
        },
        "MSF_MUTABLE_SERVLET_FIELD": {
            "ShortDescription": "Mutable servlet field",
            "LongDescription": "{1} is a mutable servlet field",
            "Details": "A web server generally only creates one instance of servlet or JSP class (i.e., treats\nthe class as a Singleton),\nand will\nhave multiple threads invoke methods on that instance to service multiple\nsimultaneous requests.\nThus, having a mutable instance field generally creates race conditions."
        },
        "IS2_INCONSISTENT_SYNC": {
            "ShortDescription": "Inconsistent synchronization",
            "LongDescription": "Inconsistent synchronization of {1}; locked {2}% of time",
            "Details": "The fields of this class appear to be accessed inconsistently with respect to synchronization.&nbsp; This bug report indicates that the bug pattern detector judged thatThe class contains a mix of locked and unlocked accesses,The class isannotated as javax.annotation.concurrent.NotThreadSafe,At least one locked access was performed by one of the class's own methods, andThe number of unsynchronized field accesses (reads and writes) was no more than one third of all accesses, with writes being weighed twice as high as reads\nA typical bug matching this bug pattern is forgetting to synchronize one of the methods in a class that is intended to be thread-safe.\nYou can select the nodes labeled \"Unsynchronized access\" to show the code locations where the detector believed that a field was accessed without synchronization.\nNote that there are various sources of inaccuracy in this detector; for example, the detector cannot statically detect all situations in which a lock is held.&nbsp; Also, even when the detector is accurate in distinguishing locked vs. unlocked accesses, the code in question may still be correct."
        },
        "NN_NAKED_NOTIFY": {
            "ShortDescription": "Naked notify",
            "LongDescription": "Naked notify in {1}",
            "Details": "A call toorwas made without any (apparent) accompanying modification to mutable object state.&nbsp; In general, calling a notify method on a monitor is done because some condition another thread is waiting for has become true.&nbsp; However, for the condition to be meaningful, it must involve a heap object that is visible to both threads.\nThis bug does not necessarily indicate an error, since the change to mutable object state may have taken place in a method which then called the method containing the notification."
        },
        "MS_EXPOSE_REP": {
            "ShortDescription": "Public static method may expose internal representation by returning a mutable object or array",
            "LongDescription": "Public static {1} may expose internal representation by returning {2.givenClass}",
            "Details": "A public static method returns a reference to a mutable object or an array that is part of the static state of the class. Any code that calls this method can freely modify the underlying array. One fix is to return a copy of the array."
        },
        "EI_EXPOSE_REP": {
            "ShortDescription": "May expose internal representation by returning reference to mutable object",
            "LongDescription": "{1} may expose internal representation by returning {2.givenClass}",
            "Details": "Returning a reference to a mutable object value stored in one of the object's fields exposes the internal representation of the object.&nbsp; If instances are accessed by untrusted code, and unchecked changes to the mutable object would compromise security or other important properties, you will need to do something different. Returning a new copy of the object is better approach in many situations."
        },
        "EI_EXPOSE_REP2": {
            "ShortDescription": "May expose internal representation by incorporating reference to mutable object",
            "LongDescription": "{1} may expose internal representation by storing an externally mutable object into {2.givenClass}",
            "Details": "This code stores a reference to an externally mutable object into the internal representation of the object.&nbsp; If instances are accessed by untrusted code, and unchecked changes to the mutable object would compromise security or other important properties, you will need to do something different. Storing a copy of the object is better approach in many situations."
        },
        "EI_EXPOSE_STATIC_REP2": {
            "ShortDescription": "May expose internal static state by storing a mutable object into a static field",
            "LongDescription": "{1} may expose internal static state by storing a mutable object into a static field {2}",
            "Details": "This code stores a reference to an externally mutable object into a static field. If unchecked changes to the mutable object would compromise security or other important properties, you will need to do something different. Storing a copy of the object is better approach in many situations."
        },
        "MS_EXPOSE_BUF": {
            "ShortDescription": "May expose internal representation by returning a buffer sharing non-public data",
            "LongDescription": "{1} may expose internal representation by returning {2.givenClass}",
            "Details": "A public static method either returns a buffer (java.nio.*Buffer) which wraps an array that is part of the static state of the class by holding a reference only to this same array or it returns a shallow-copy of a buffer that is part of the static stat of the class which shares its reference with the original buffer. Any code that calls this method can freely modify the underlying array. One fix is to return a read-only buffer or a new buffer with a copy of the array."
        },
        "EI_EXPOSE_BUF": {
            "ShortDescription": "May expose internal representation by returning a buffer sharing non-public data",
            "LongDescription": "{1} may expose internal representation by returning {2.givenClass}",
            "Details": "Returning a reference to a buffer (java.nio.*Buffer) which wraps an array stored in one of the object's fields exposes the internal representation of the array elements because the buffer only stores a reference to the array instead of copying its content. Similarly, returning a shallow-copy of such a buffer (using its duplicate() method) stored in one of the object's fields also exposes the internal representation of the buffer.&nbsp; If instances are accessed by untrusted code, and unchecked changes to the array would compromise security or other important properties, you will need to do something different. Returning a read-only buffer (using its asReadOnly() method) or copying the array to a new buffer (using its put() method) is a better approach in many situations."
        },
        "EI_EXPOSE_BUF2": {
            "ShortDescription": "May expose internal representation by creating a buffer which incorporates reference to array",
            "LongDescription": "{1} may expose internal representation by creating a buffer which contains an external array into {2.givenClass}",
            "Details": "This code creates a buffer which stores a reference to an external array or the array of an external buffer into the internal representation of the object.&nbsp; If instances are accessed by untrusted code, and unchecked changes to the array would compromise security or other important properties, you will need to do something different. Storing a copy of the array is a better approach in many situations."
        },
        "EI_EXPOSE_STATIC_BUF2": {
            "ShortDescription": "May expose internal static state by creating a buffer which stores an external array into a static field",
            "LongDescription": "{1} may expose internal static state by creating a buffer which stores an external array into static field {2}",
            "Details": "This code creates a buffer which stores a reference to an external array or the array of an external buffer into a static field. If unchecked changes to the array would compromise security or other important properties, you will need to do something different. Storing a copy of the array is a better approach in many situations."
        },
        "RU_INVOKE_RUN": {
            "ShortDescription": "Invokes run on a thread (did you mean to start it instead?)",
            "LongDescription": "{1} explicitly invokes run on a thread (did you mean to start it instead?)",
            "Details": "This method explicitly invokeson an object.&nbsp; In general, classes implement theinterface because they are going to have theirmethod invoked in a new thread, in which caseis the right method to call."
        },
        "SP_SPIN_ON_FIELD": {
            "ShortDescription": "Method spins on field",
            "LongDescription": "Spinning on {2.givenClass} in {1}",
            "Details": "This method spins in a loop which reads a field.&nbsp; The compiler may legally hoist the read out of the loop, turning the code into an infinite loop.&nbsp; The class should be changed so it uses proper synchronization (including wait and notify calls)."
        },
        "NS_DANGEROUS_NON_SHORT_CIRCUIT": {
            "ShortDescription": "Potentially dangerous use of non-short-circuit logic",
            "LongDescription": "Potentially dangerous use of non-short-circuit logic in {1}",
            "Details": "This code seems to be using non-short-circuit logic (e.g., &amp;\nor |)\nrather than short-circuit logic (&amp;&amp; or ||). In addition,\nit seems possible that, depending on the value of the left hand side, you might not\nwant to evaluate the right hand side (because it would have side effects, could cause an exception\nor could be expensive.\nNon-short-circuit logic causes both sides of the expression\nto be evaluated even when the result can be inferred from\nknowing the left-hand side. This can be less efficient and\ncan result in errors if the left-hand side guards cases\nwhen evaluating the right-hand side can generate an error.\nSee <a href=\"https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.22.2\">the Java\nLanguage Specificationfor details.\n\n"
        },
        "NS_NON_SHORT_CIRCUIT": {
            "ShortDescription": "Questionable use of non-short-circuit logic",
            "LongDescription": "Questionable use of non-short-circuit logic in {1}",
            "Details": "This code seems to be using non-short-circuit logic (e.g., &amp;\nor |)\nrather than short-circuit logic (&amp;&amp; or ||).\nNon-short-circuit logic causes both sides of the expression\nto be evaluated even when the result can be inferred from\nknowing the left-hand side. This can be less efficient and\ncan result in errors if the left-hand side guards cases\nwhen evaluating the right-hand side can generate an error.\n\nSee <a href=\"https://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.22.2\">the Java\nLanguage Specificationfor details.\n\n"
        },
        "TLW_TWO_LOCK_WAIT": {
            "ShortDescription": "Wait with two locks held",
            "LongDescription": "wait() with two locks held in {1}",
            "Details": "Waiting on a monitor while two locks are held may cause deadlock. Performing a wait only releases the lock on the object being waited on, not any other locks. This not necessarily a bug, but is worth examining closely."
        },
        "TLW_TWO_LOCK_NOTIFY": {
            "deprecated": "true",
            "ShortDescription": "Notify with two locks held",
            "LongDescription": "notify() or notifyAll*() with two locks held in {1}",
            "Details": "The code calls notify() or notifyAll() while two locks are held. If this notification is intended to wake up a wait() that is holding the same locks, it may deadlock, since the wait will only give up one lock and the notify will be unable to get both locks, and thus the notify will not succeed. &nbsp; If there is also a warning about a two lock wait, the probability of a bug is quite high.\n"
        },
        "UW_UNCOND_WAIT": {
            "ShortDescription": "Unconditional wait",
            "LongDescription": "Unconditional wait in {1}",
            "Details": "This method contains a call towhich is not guarded by conditional control flow. The code should verify that condition it intends to wait for is not already satisfied before calling wait; any previous notifications will be ignored."
        },
        "UR_UNINIT_READ": {
            "ShortDescription": "Uninitialized read of field in constructor",
            "LongDescription": "Uninitialized read of {2.name} in {1}",
            "Details": "This constructor reads a field which has not yet been assigned a value.&nbsp; This is often caused when the programmer mistakenly uses the field instead of one of the constructor's parameters."
        },
        "UR_UNINIT_READ_CALLED_FROM_SUPER_CONSTRUCTOR": {
            "ShortDescription": "Uninitialized read of field method called from constructor of superclass",
            "LongDescription": "{2.name} isn't initialized in {1} when invoked from constructor for superclass",
            "Details": "This method is invoked in the constructor of the superclass. At this point, the fields of the class have not yet initialized.To make this more concrete, consider the following classes:abstract class A { int hashCode; abstract Object getValue();\n A() { hashCode = getValue().hashCode(); }\n}\n\nclass B extends A { Object value;\n B(Object v) { this.value = v; }\n Object getValue() { return value; }\n}\nWhen ais constructed,\nthe constructor for theclass is invoked\nthe constructor forsets.\nThus, when the constructor forinvokes,\nan uninitialized value is read for"
        },
        "UG_SYNC_SET_UNSYNC_GET": {
            "ShortDescription": "Unsynchronized get method, synchronized set method",
            "LongDescription": "{1} is unsynchronized, {2} is synchronized",
            "Details": "This class contains similarly-named get and set methods where the set method is synchronized and the get method is not.&nbsp; This may result in incorrect behavior at runtime, as callers of the get method will not necessarily see a consistent state for the object.&nbsp; The get method should be made synchronized."
        },
        "IC_INIT_CIRCULARITY": {
            "ShortDescription": "Initialization circularity",
            "LongDescription": "Initialization circularity between {0} and {1}",
            "Details": "A circularity was detected in the static initializers of the two classes referenced by the bug instance.&nbsp; Many kinds of unexpected behavior may arise from such circularity."
        },
        "IC_SUPERCLASS_USES_SUBCLASS_DURING_INITIALIZATION": {
            "ShortDescription": "Superclass uses subclass during initialization",
            "LongDescription": "Initialization of {0} accesses class {2}, which isn't initialized yet",
            "Details": "During the initialization of a class, the class makes an active use of a subclass.\nThat subclass will not yet be initialized at the time of this use.\nFor example, in the following code,will be null.public class CircularClassInitialization { static class InnerClassSingleton extends CircularClassInitialization { static InnerClassSingleton singleton = new InnerClassSingleton(); }\n static CircularClassInitialization foo = InnerClassSingleton.singleton;\n}\n"
        },
        "IT_NO_SUCH_ELEMENT": {
            "ShortDescription": "Iterator next() method cannot throw NoSuchElementException",
            "LongDescription": "{1} cannot throw NoSuchElementException",
            "Details": "This class implements theinterface.&nbsp; However, itsmethod is not capable of throwing.&nbsp; Themethod should be changed so it throwsif is called when there are no more elements to return."
        },
        "DL_SYNCHRONIZATION_ON_SHARED_CONSTANT": {
            "ShortDescription": "Synchronization on String literal",
            "LongDescription": "Synchronization on String literal in {1}",
            "Details": "The code synchronizes on String literal.private static String LOCK = \"LOCK\";\n...\nsynchronized(LOCK) { ...\n}\n...\nConstant Strings are interned and shared across all other classes loaded by the JVM. Thus, this code\nis locking on something that other code might also be locking. This could result in very strange and hard to diagnose\nblocking and deadlock behavior. See <a href=\"http://www.javalobby.org/java/forums/t96352.html\">http://www.javalobby.org/java/forums/t96352.htmland <a href=\"http://jira.codehaus.org/browse/JETTY-352\">http://jira.codehaus.org/browse/JETTY-352See CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reusedfor more information."
        },
        "DL_SYNCHRONIZATION_ON_INTERNED_STRING": {
            "ShortDescription": "Synchronization on interned String",
            "LongDescription": "Synchronization on interned String in {1}",
            "Details": "The code synchronizes on interned String.private static String LOCK = new String(\"LOCK\").intern();\n...\nsynchronized(LOCK) { ...\n}\n...\nConstant Strings are interned and shared across all other classes loaded by the JVM. Thus, this code\nis locking on something that other code might also be locking. This could result in very strange and hard to diagnose\nblocking and deadlock behavior. See <a href=\"http://www.javalobby.org/java/forums/t96352.html\">http://www.javalobby.org/java/forums/t96352.htmland <a href=\"http://jira.codehaus.org/browse/JETTY-352\">http://jira.codehaus.org/browse/JETTY-352See CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reusedfor more information."
        },
        "DL_SYNCHRONIZATION_ON_BOOLEAN": {
            "ShortDescription": "Synchronization on Boolean",
            "LongDescription": "Synchronization on Boolean in {1}",
            "Details": "The code synchronizes on a boxed primitive constant, such as a Boolean.private static Boolean inited = Boolean.FALSE;\n...\nsynchronized(inited) { if (!inited) { init(); inited = Boolean.TRUE; }\n}\n...\nSince there normally exist only two Boolean objects, this code could be synchronizing on the same object as other, unrelated code, leading to unresponsiveness\nand possible deadlock.See CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reusedfor more information."
        },
        "DL_SYNCHRONIZATION_ON_UNSHARED_BOXED_PRIMITIVE": {
            "ShortDescription": "Synchronization on boxed primitive values",
            "LongDescription": "Synchronization on {2} in {1}",
            "Details": "The code synchronizes on an apparently unshared boxed primitive,\nsuch as an Integer.private static final Integer fileLock = new Integer(1);\n...\nsynchronized(fileLock) { .. do something ..\n}\n...\nIt would be much better, in this code, to redeclare fileLock asprivate static final Object fileLock = new Object();\n\nThe existing code might be OK, but it is confusing and a\nfuture refactoring, such as the \"Remove Boxing\" refactoring in IntelliJ,\nmight replace this with the use of an interned Integer object shared\nthroughout the JVM, leading to very confusing behavior and potential deadlock.\n"
        },
        "DL_SYNCHRONIZATION_ON_BOXED_PRIMITIVE": {
            "ShortDescription": "Synchronization on boxed primitive",
            "LongDescription": "Synchronization on {2} in {1}",
            "Details": "The code synchronizes on a boxed primitive constant, such as an Integer.private static Integer count = 0;\n...\nsynchronized(count) { count++;\n}\n...\nSince Integer objects can be cached and shared,\nthis code could be synchronizing on the same object as other, unrelated code, leading to unresponsiveness\nand possible deadlock.See CERT <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK01-J.+Do+not+synchronize+on+objects+that+may+be+reused\">LCK01-J. Do not synchronize on objects that may be reusedfor more information."
        },
        "ESync_EMPTY_SYNC": {
            "ShortDescription": "Empty synchronized block",
            "LongDescription": "Empty synchronized block in {1}",
            "Details": "The code contains an empty synchronized block:synchronized() {\n}\nEmpty synchronized blocks are far more subtle and hard to use correctly\nthan most people recognize, and empty synchronized blocks\nare almost never a better solution\nthan less contrived solutions.\n"
        },
        "IS_INCONSISTENT_SYNC": {
            "ShortDescription": "Inconsistent synchronization",
            "LongDescription": "Inconsistent synchronization of {1}; locked {2}% of the time",
            "Details": "The fields of this class appear to be accessed inconsistently with respect to synchronization.&nbsp; This bug report indicates that the bug pattern detector judged thatThe class contains a mix of locked and unlocked accesses,At least one locked access was performed by one of the class's own methods, andThe number of unsynchronized field accesses (reads and writes) was no more than one third of all accesses, with writes being weighed twice as high as reads\nA typical bug matching this bug pattern is forgetting to synchronize one of the methods in a class that is intended to be thread-safe.\nNote that there are various sources of inaccuracy in this detector; for example, the detector cannot statically detect all situations in which a lock is held.&nbsp; Also, even when the detector is accurate in distinguishing locked vs. unlocked accesses, the code in question may still be correct."
        },
        "ML_SYNC_ON_FIELD_TO_GUARD_CHANGING_THAT_FIELD": {
            "ShortDescription": "Synchronization on field in futile attempt to guard that field",
            "LongDescription": "Synchronization on {2.givenClass} in futile attempt to guard it",
            "Details": "This method synchronizes on a field in what appears to be an attempt\nto guard against simultaneous updates to that field. But guarding a field\ngets a lock on the referenced object, not on the field. This may not\nprovide the mutual exclusion you need, and other threads might\nbe obtaining locks on the referenced objects (for other purposes). An example\nof this pattern would be:private Long myNtfSeqNbrCounter = new Long(0);\nprivate Long getNotificationSequenceNumber() { Long result = null; synchronized(myNtfSeqNbrCounter) { result = new Long(myNtfSeqNbrCounter.longValue() + 1); myNtfSeqNbrCounter = new Long(result.longValue()); } return result;\n}\n"
        },
        "ML_SYNC_ON_UPDATED_FIELD": {
            "ShortDescription": "Method synchronizes on an updated field",
            "LongDescription": "{1} synchronizes on updated field {2.givenClass}",
            "Details": "This method synchronizes on an object referenced from a mutable field. This is unlikely to have useful semantics, since different\nthreads may be synchronizing on different objects."
        },
        "MS_OOI_PKGPROTECT": {
            "ShortDescription": "Field should be moved out of an interface and made package protected",
            "LongDescription": "{1} should be moved out of an interface and made package protected",
            "Details": "A final static field that is\ndefined in an interface references a mutable object such as an array or hashtable. This mutable object could be changed by malicious code or by accident from another package. To solve this, the field needs to be moved to a class and made package protected to avoid this vulnerability."
        },
        "MS_FINAL_PKGPROTECT": {
            "ShortDescription": "Field should be both final and package protected",
            "LongDescription": "{1} should be both final and package protected",
            "Details": "A mutable static field could be changed by malicious code or by accident from another package. The field could be made package protected and/or made final to avoid this vulnerability."
        },
        "MS_SHOULD_BE_REFACTORED_TO_BE_FINAL": {
            "ShortDescription": "Field isn't final but should be refactored to be so",
            "LongDescription": "{1} isn't final but should be refactored to be so",
            "Details": "\nThispublic staticorprotected staticfield is not final, and\ncould be changed by malicious code or\nby accident from another package.\nThe field could be made final to avoid\nthis vulnerability. However, the static initializer contains more than one write\nto the field, so doing so will require some refactoring.\n"
        },
        "MS_SHOULD_BE_FINAL": {
            "ShortDescription": "Field isn't final but should be",
            "LongDescription": "{1} isn't final but should be",
            "Details": "\nThispublic staticorprotected staticfield is not final, and\ncould be changed by malicious code or by accident from another package. The field could be made final to avoid this vulnerability."
        },
        "MS_PKGPROTECT": {
            "ShortDescription": "Field should be package protected",
            "LongDescription": "{1} should be package protected",
            "Details": "A mutable static field could be changed by malicious code or by accident. The field could be made package protected to avoid this vulnerability."
        },
        "MS_MUTABLE_HASHTABLE": {
            "ShortDescription": "Field is a mutable Hashtable",
            "LongDescription": "{1} is a mutable Hashtable",
            "Details": "A final static field references a Hashtable and can be accessed by malicious code or by accident from another package. This code can freely modify the contents of the Hashtable."
        },
        "MS_MUTABLE_COLLECTION": {
            "ShortDescription": "Field is a mutable collection",
            "LongDescription": "{1} is a mutable collection",
            "Details": "A mutable collection instance is assigned to a final static field, thus can be changed by malicious code or by accident from another package. Consider wrapping this field into Collections.unmodifiableSet/List/Map/etc. to avoid this vulnerability."
        },
        "MS_MUTABLE_COLLECTION_PKGPROTECT": {
            "ShortDescription": "Field is a mutable collection which should be package protected",
            "LongDescription": "{1} is a mutable collection which should be package protected",
            "Details": "A mutable collection instance is assigned to a final static field, thus can be changed by malicious code or by accident from another package. The field could be made package protected to avoid this vulnerability. Alternatively you may wrap this field into Collections.unmodifiableSet/List/Map/etc. to avoid this vulnerability."
        },
        "MS_MUTABLE_ARRAY": {
            "ShortDescription": "Field is a mutable array",
            "LongDescription": "{1} is a mutable array",
            "Details": "A final static field references an array and can be accessed by malicious code or by accident from another package. This code can freely modify the contents of the array."
        },
        "MS_CANNOT_BE_FINAL": {
            "ShortDescription": "Field isn't final and cannot be protected from malicious code",
            "LongDescription": "{1} isn't final and cannot be protected from malicious code",
            "Details": "A mutable static field could be changed by malicious code or by accident from another package. Unfortunately, the way the field is used doesn't allow any easy fix to this problem."
        },
        "ME_MUTABLE_ENUM_FIELD": {
            "ShortDescription": "Enum field is public and mutable",
            "LongDescription": "{1} field is public and mutable",
            "Details": "A mutable public field is defined inside a public enum, thus can be changed by malicious code or by accident from another package. Though mutable enum fields may be used for lazy initialization, it's a bad practice to expose them to the outer world. Consider declaring this field final and/or package-private."
        },
        "ME_ENUM_FIELD_SETTER": {
            "ShortDescription": "Public enum method unconditionally sets its field",
            "LongDescription": "{1} unconditionally sets the field {2.name}",
            "Details": "This public method declared in public enum unconditionally sets enum field, thus this field can be changed by malicious code or by accident from another package. Though mutable enum fields may be used for lazy initialization, it's a bad practice to expose them to the outer world. Consider removing this method or declaring it package-private."
        },
        "IA_AMBIGUOUS_INVOCATION_OF_INHERITED_OR_OUTER_METHOD": {
            "ShortDescription": "Potentially ambiguous invocation of either an inherited or outer method",
            "LongDescription": "Potentially ambiguous invocation of either an outer or inherited method {2} in {1}",
            "Details": "\nAn inner class is invoking a method that could be resolved to either an inherited method or a method defined in an outer class.\nFor example, you invoke, which is defined in both a superclass and in an outer method.\nBy the Java semantics,\nit will be resolved to invoke the inherited method, but this may not be what\nyou intend.\nIf you really intend to invoke the inherited method,\ninvoke it by invoking the method on super (e.g., invoke super.foo(17)), and\nthus it will be clear to other readers of your code and to SpotBugs\nthat you want to invoke the inherited method, not the method in the outer class.\nIf you call, then the inherited method will be invoked. However, since SpotBugs only looks at\nclassfiles, it\ncannot tell the difference between an invocation ofand, it will still\ncomplain about a potential ambiguous invocation.\n"
        },
        "NM_SAME_SIMPLE_NAME_AS_SUPERCLASS": {
            "ShortDescription": "Class names shouldn't shadow simple name of superclass",
            "LongDescription": "The class name {0} shadows the simple name of the superclass {1}",
            "Details": "This class has a simple name that is identical to that of its superclass, except\nthat its superclass is in a different package (e.g.,extends).\nThis can be exceptionally confusing, create lots of situations in which you have to look at import statements\nto resolve references and creates many\nopportunities to accidentally define methods that do not override methods in their superclasses.\n"
        },
        "NM_SAME_SIMPLE_NAME_AS_INTERFACE": {
            "ShortDescription": "Class names shouldn't shadow simple name of implemented interface",
            "LongDescription": "The class name {0} shadows the simple name of implemented interface {1}",
            "Details": "This class/interface has a simple name that is identical to that of an implemented/extended interface, except\nthat the interface is in a different package (e.g.,extends).\nThis can be exceptionally confusing, create lots of situations in which you have to look at import statements\nto resolve references and creates many\nopportunities to accidentally define methods that do not override methods in their superclasses.\n"
        },
        "NM_CLASS_NAMING_CONVENTION": {
            "ShortDescription": "Class names should start with an upper case letter",
            "LongDescription": "The class name {0} doesn't start with an upper case letter",
            "Details": "Class names should be nouns, in mixed case with the first letter of each internal word capitalized. Try to keep your class names simple and descriptive. Use whole words-avoid acronyms and abbreviations (unless the abbreviation is much more widely used than the long form, such as URL or HTML).\n"
        },
        "NM_METHOD_NAMING_CONVENTION": {
            "ShortDescription": "Method names should start with a lower case letter",
            "LongDescription": "The method name {1} doesn't start with a lower case letter",
            "Details": "\nMethods should be verbs, in mixed case with the first letter lowercase, with the first letter of each internal word capitalized.\n"
        },
        "NM_FIELD_NAMING_CONVENTION": {
            "ShortDescription": "Non-final field names should start with a lower case letter, final fields should be uppercase with words separated by underscores",
            "LongDescription": "The field name {1} is not conform to the naming convention. If final, it should be ALL_CAPS, otherwise lowerCamelCase.",
            "Details": "\nNames of fields that are not final should be in mixed case with a lowercase first letter and the first letters of subsequent words capitalized.\nNames of final fields should be all uppercase with words separated by underscores ('_').\n"
        },
        "NM_VERY_CONFUSING": {
            "ShortDescription": "Very confusing method names",
            "LongDescription": "VERY confusing to have methods {1} and {3}",
            "Details": "The referenced methods have names that differ only by capitalization.\nThis is very confusing because if the capitalization were\nidentical then one of the methods would override the other.\n"
        },
        "NM_VERY_CONFUSING_INTENTIONAL": {
            "ShortDescription": "Very confusing method names (but perhaps intentional)",
            "LongDescription": "VERY confusing (but perhaps intentional) to have methods {1} and {3}",
            "Details": "The referenced methods have names that differ only by capitalization.\nThis is very confusing because if the capitalization were\nidentical then one of the methods would override the other. From the existence of other methods, it\nseems that the existence of both of these methods is intentional, but is sure is confusing.\nYou should try hard to eliminate one of them, unless you are forced to have both due to frozen APIs.\n"
        },
        "NM_WRONG_PACKAGE": {
            "ShortDescription": "Method doesn't override method in superclass due to wrong package for parameter",
            "LongDescription": "{1} doesn't override method in superclass because parameter type {4} doesn't match superclass parameter type {5}",
            "Details": "The method in the subclass doesn't override a similar method in a superclass because the type of a parameter doesn't exactly match\nthe type of the corresponding parameter in the superclass. For example, if you have:import alpha.Foo;\n\npublic class A { public int f(Foo x) { return 17; }\n}\n----\nimport beta.Foo;\n\npublic class B extends A { public int f(Foo x) { return 42; }\n}\nThemethod defined in classdoesn't\noverride the\nmethod defined in class, because the argument\ntypes are's from different packages.\n"
        },
        "NM_WRONG_PACKAGE_INTENTIONAL": {
            "ShortDescription": "Method doesn't override method in superclass due to wrong package for parameter",
            "LongDescription": "{1} doesn't override method in superclass because parameter type {4} doesn't match superclass parameter type {5}",
            "Details": "The method in the subclass doesn't override a similar method in a superclass because the type of a parameter doesn't exactly match\nthe type of the corresponding parameter in the superclass. For example, if you have:import alpha.Foo;\n\npublic class A { public int f(Foo x) { return 17; }\n}\n----\nimport beta.Foo;\n\npublic class B extends A { public int f(Foo x) { return 42; } public int f(alpha.Foo x) { return 27; }\n}\nThemethod defined in classdoesn't\noverride the\nmethod defined in class, because the argument\ntypes are's from different packages.\nIn this case, the subclass does define a method with a signature identical to the method in the superclass,\nso this is presumably understood. However, such methods are exceptionally confusing. You should strongly consider\nremoving or deprecating the method with the similar but not identical signature.\n"
        },
        "NM_CONFUSING": {
            "ShortDescription": "Confusing method names",
            "LongDescription": "Confusing to have methods {1} and {3}",
            "Details": "The referenced methods have names that differ only by capitalization."
        },
        "NM_METHOD_CONSTRUCTOR_CONFUSION": {
            "ShortDescription": "Apparent method/constructor confusion",
            "LongDescription": "{1} was probably intended to be a constructor",
            "Details": "This regular method has the same name as the class it is defined in. It is likely that this was intended to be a constructor. If it was intended to be a constructor, remove the declaration of a void return value. If you had accidentally defined this method, realized the mistake, defined a proper constructor but cannot get rid of this method due to backwards compatibility, deprecate the method.\n"
        },
        "NM_LCASE_HASHCODE": {
            "ShortDescription": "Class defines hashcode(); should it be hashCode()?",
            "LongDescription": "Class {0} defines hashcode(); should it be hashCode()?",
            "Details": "This class defines a method called.&nbsp; This method does not override themethod in, which is probably what was intended."
        },
        "NM_LCASE_TOSTRING": {
            "ShortDescription": "Class defines tostring(); should it be toString()?",
            "LongDescription": "Class {0} defines tostring(); should it be toString()?",
            "Details": "This class defines a method called.&nbsp; This method does not override themethod in, which is probably what was intended."
        },
        "NM_BAD_EQUAL": {
            "ShortDescription": "Class defines equal(Object); should it be equals(Object)?",
            "LongDescription": "Class {0} defines equal(Object); should it be equals(Object)?",
            "Details": "This class defines a method.&nbsp; This method does\nnot override themethod in,\nwhich is probably what was intended."
        },
        "NM_CLASS_NOT_EXCEPTION": {
            "ShortDescription": "Class is not derived from an Exception, even though it is named as such",
            "LongDescription": "Class {0} is not derived from an Exception, even though it is named as such",
            "Details": "This class is not derived from another exception, but ends with 'Exception'. This will\nbe confusing to users of this class."
        },
        "RR_NOT_CHECKED": {
            "ShortDescription": "Method ignores results of InputStream.read()",
            "LongDescription": "{1} ignores result of {2}",
            "Details": "This method ignores the return value of one of the variants ofwhich can return multiple bytes.&nbsp; If the return value is not checked, the caller will not be able to correctly handle the case where fewer bytes were read than the caller requested.&nbsp; This is a particularly insidious kind of bug, because in many programs, reads from input streams usually do read the full amount of data requested, causing the program to fail only sporadically."
        },
        "SR_NOT_CHECKED": {
            "ShortDescription": "Method ignores results of InputStream.skip()",
            "LongDescription": "{1} ignores result of {2}",
            "Details": "This method ignores the return value ofwhich can skip multiple bytes.&nbsp; If the return value is not checked, the caller will not be able to correctly handle the case where fewer bytes were skipped than the caller requested.&nbsp; This is a particularly insidious kind of bug, because in many programs, skips from input streams usually do skip the full amount of data requested, causing the program to fail only sporadically. With Buffered streams, however, skip() will only skip data in the buffer, and will routinely fail to skip the requested number of bytes."
        },
        "SE_READ_RESOLVE_IS_STATIC": {
            "ShortDescription": "The readResolve method must not be declared as a static method.",
            "LongDescription": "{1} should be declared as an instance method rather than a static method",
            "Details": "In order for the readResolve method to be recognized by the serialization\nmechanism, it must not be declared as a static method.\n"
        },
        "SE_PRIVATE_READ_RESOLVE_NOT_INHERITED": {
            "ShortDescription": "Private readResolve method not inherited by subclasses",
            "LongDescription": "Private readResolve method in {0} not inherited by subclasses.",
            "Details": "This class defines a private readResolve method. Since it is private, it won't be inherited by subclasses.\nThis might be intentional and OK, but should be reviewed to ensure it is what is intended.\n"
        },
        "SE_READ_RESOLVE_MUST_RETURN_OBJECT": {
            "ShortDescription": "The readResolve method must be declared with a return type of Object.",
            "LongDescription": "The method {1} must be declared with a return type of Object rather than {1.returnType}",
            "Details": "In order for the readResolve method to be recognized by the serialization\nmechanism, it must be declared to have a return type of Object.\n"
        },
        "SE_TRANSIENT_FIELD_OF_NONSERIALIZABLE_CLASS": {
            "ShortDescription": "Transient field of class that isn't Serializable.",
            "LongDescription": "{1.givenClass} is transient but {0} isn't Serializable",
            "Details": "The field is marked as transient, but the class isn't Serializable, so marking it as transient\nhas absolutely no effect.\nThis may be leftover marking from a previous version of the code in which the class was Serializable, or\nit may indicate a misunderstanding of how serialization works.\nThis bug is reported only if special optionis set."
        },
        "SE_TRANSIENT_FIELD_NOT_RESTORED": {
            "ShortDescription": "Transient field that isn't set by deserialization.",
            "LongDescription": "The field {1} is transient but isn't set by deserialization",
            "Details": "This class contains a field that is updated at multiple places in the class, thus it seems to be part of the state of the class. However, since the field is marked as transient and not set in readObject or readResolve, it will contain the default value in any\ndeserialized instance of the class.\n"
        },
        "SE_PREVENT_EXT_OBJ_OVERWRITE": {
            "ShortDescription": "Prevent overwriting of externalizable objects",
            "LongDescription": "Any caller can reset the value of the object by using the readExternal() method.",
            "Details": "Themethod must be declared as public and is not protected from malicious callers, so the code permits any caller to reset the value of the object at any time.To prevent overwriting of externalizable objects, you can use a Boolean flag that is set after the instance fields have been populated. You can also protect against race conditions by synchronizing on a private lock object.\n"
        },
        "SE_METHOD_MUST_BE_PRIVATE": {
            "ShortDescription": "Method must be private in order for serialization to work",
            "LongDescription": "The method {1.givenClass} must be private to be invoked in serialization/deserialization of {0}",
            "Details": "This class implements theinterface, and defines a method for custom serialization/deserialization. But since that method isn't declared private, it will be silently ignored by the serialization/deserialization API."
        },
        "SE_NO_SUITABLE_CONSTRUCTOR_FOR_EXTERNALIZATION": {
            "ShortDescription": "Class is Externalizable but doesn't define a void constructor",
            "LongDescription": "{0} is Externalizable but doesn't define a void constructor",
            "Details": "This class implements theinterface, but does not define a public void constructor. When Externalizable objects are deserialized, they first need to be constructed by invoking the public void constructor. Since this class does not have one, serialization and deserialization will fail at runtime."
        },
        "SE_NO_SUITABLE_CONSTRUCTOR": {
            "ShortDescription": "Class is Serializable but its superclass doesn't define a void constructor",
            "LongDescription": "{0} is Serializable but its superclass doesn't define an accessible void constructor",
            "Details": "This class implements theinterface and its superclass does not. When such an object is deserialized, the fields of the superclass need to be initialized by invoking the void constructor of the superclass. Since the superclass does not have one, serialization and deserialization will fail at runtime."
        },
        "SE_NO_SERIALVERSIONID": {
            "ShortDescription": "Class is Serializable, but doesn't define serialVersionUID",
            "LongDescription": "{0} is Serializable; consider declaring a serialVersionUID",
            "Details": "This class implements theinterface, but does not define afield.&nbsp; A change as simple as adding a reference to a .class object will add synthetic fields to the class, which will unfortunately change the implicit serialVersionUID (e.g., adding a reference towill generate a static field). Also, different source code to bytecode compilers may use different naming conventions for synthetic variables generated for references to class objects or inner classes. To ensure interoperability of Serializable across versions, consider adding an explicit serialVersionUID."
        },
        "SE_COMPARATOR_SHOULD_BE_SERIALIZABLE": {
            "ShortDescription": "Comparator doesn't implement Serializable",
            "LongDescription": "{0} implements Comparator but not Serializable",
            "Details": "This class implements theinterface. You\nshould consider whether or not it should also implement the\ninterface. If a comparator is used to construct an ordered collection\nsuch as a, then the\nwill be serializable only if the comparator is also serializable.\nAs most comparators have little or no state, making them serializable\nis generally easy and good defensive programming.\n"
        },
        "SF_SWITCH_FALLTHROUGH": {
            "ShortDescription": "Switch statement found where one case falls through to the next case",
            "LongDescription": "Switch statement found in {1} where one case falls through to the next case",
            "Details": "This method contains a switch statement where one case branch will fall through to the next case. Usually you need to end this case with a break or return."
        },
        "SF_SWITCH_NO_DEFAULT": {
            "ShortDescription": "Switch statement found where default case is missing",
            "LongDescription": "Switch statement found in {1} where default case is missing",
            "Details": "This method contains a switch statement where default case is missing. Usually you need to provide a default case.Because the analysis only looks at the generated bytecode, this warning can be incorrect triggered if\nthe default case is at the end of the switch statement and the switch statement doesn't contain break statements for other\ncases."
        },
        "SF_DEAD_STORE_DUE_TO_SWITCH_FALLTHROUGH": {
            "ShortDescription": "Dead store due to switch statement fall through",
            "LongDescription": "Value of {2.givenClass} from previous case is overwritten here due to switch statement fall through",
            "Details": "A value stored in the previous switch case is overwritten here due to a switch fall through. It is likely that you forgot to put a break or return at the end of the previous case.\n"
        },
        "SF_DEAD_STORE_DUE_TO_SWITCH_FALLTHROUGH_TO_THROW": {
            "ShortDescription": "Dead store due to switch statement fall through to throw",
            "LongDescription": "Value of {2.givenClass} from previous case is lost here due to switch statement fall through to throw",
            "Details": "A value stored in the previous switch case is ignored here due to a switch fall through to a place where an exception is thrown. It is likely that you forgot to put a break or return at the end of the previous case.\n"
        },
        "WS_WRITEOBJECT_SYNC": {
            "ShortDescription": "Class's writeObject() method is synchronized but nothing else is",
            "LongDescription": "{0}'s writeObject method is synchronized but nothing else is",
            "Details": "This class has amethod which is synchronized; however, no other method of the class is synchronized."
        },
        "RS_READOBJECT_SYNC": {
            "ShortDescription": "Class's readObject() method is synchronized",
            "LongDescription": "{0}'s readObject method is synchronized",
            "Details": "This serializable class defines awhich is synchronized.&nbsp; By definition, an object created by deserialization is only reachable by one thread, and thus there is no need forto be synchronized.&nbsp; If themethod itself is causing the object to become visible to another thread, that is an example of very dubious coding style."
        },
        "SE_NONSTATIC_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID isn't static",
            "LongDescription": "{1} isn't static",
            "Details": "This class defines afield that is not static.&nbsp; The field should be made static if it is intended to specify the version UID for purposes of serialization."
        },
        "SE_NONFINAL_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID isn't final",
            "LongDescription": "{1} isn't final",
            "Details": "This class defines afield that is not final.&nbsp; The field should be made final if it is intended to specify the version UID for purposes of serialization."
        },
        "SE_NONLONG_SERIALVERSIONID": {
            "ShortDescription": "serialVersionUID isn't long",
            "LongDescription": "{1} isn't long",
            "Details": "This class defines afield that is not long.&nbsp; The field should be made long if it is intended to specify the version UID for purposes of serialization."
        },
        "SE_BAD_FIELD": {
            "ShortDescription": "Non-transient non-serializable instance field in serializable class",
            "LongDescription": "Class {0} defines non-transient non-serializable instance field {1.name}",
            "Details": "This Serializable class defines a non-primitive instance field which is neither transient,\nSerializable, or, and does not appear to implement\ntheinterface or the\nandmethods.&nbsp;\nObjects of this class will not be deserialized correctly if a non-Serializable\nobject is stored in this field."
        },
        "SE_BAD_FIELD_INNER_CLASS": {
            "ShortDescription": "Non-serializable class has a serializable inner class",
            "LongDescription": "{0} is serializable but also an inner class of a non-serializable class",
            "Details": "This Serializable class is an inner class of a non-serializable class.\nThus, attempts to serialize it will also attempt to associate instance of the outer\nclass with which it is associated, leading to a runtime error.\nIf possible, making the inner class a static inner class should solve the\nproblem. Making the outer class serializable might also work, but that would\nmean serializing an instance of the inner class would always also serialize the instance\nof the outer class, which it often not what you really want."
        },
        "SE_INNER_CLASS": {
            "ShortDescription": "Serializable inner class",
            "LongDescription": "{0} is serializable and an inner class",
            "Details": "This Serializable class is an inner class.  Any attempt to serialize\nit will also serialize the associated outer instance. The outer instance is serializable,\nso this won't fail, but it might serialize a lot more data than intended.\nIf possible, making the inner class a static inner class (also known as a nested class) should solve the\nproblem."
        },
        "SE_BAD_FIELD_STORE": {
            "ShortDescription": "Non-serializable value stored into instance field of a serializable class",
            "LongDescription": "{2} stored into non-transient field {1.givenClass}",
            "Details": "A non-serializable value is stored into a non-transient field\nof a serializable class."
        },
        "SC_START_IN_CTOR": {
            "ShortDescription": "Constructor invokes Thread.start()",
            "LongDescription": "{1} invokes {2}",
            "Details": "The constructor starts a thread. This is likely to be wrong if the class is ever extended/subclassed, since the thread will be started before the subclass constructor is started."
        },
        "SS_SHOULD_BE_STATIC": {
            "ShortDescription": "Unread field: should this field be static?",
            "LongDescription": "Unread field: {1}; should this field be static?",
            "Details": "This class contains an instance final field that is initialized to a compile-time static value. Consider making the field static."
        },
        "UUF_UNUSED_FIELD": {
            "ShortDescription": "Unused field",
            "LongDescription": "Unused field: {1}",
            "Details": "This field is never used.&nbsp; Consider removing it from the class."
        },
        "URF_UNREAD_FIELD": {
            "ShortDescription": "Unread field",
            "LongDescription": "Unread field: {1}",
            "Details": "This field is never read.&nbsp; Consider removing it from the class."
        },
        "UUF_UNUSED_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "Unused public or protected field",
            "LongDescription": "Unused public or protected field: {1}",
            "Details": "This field is never used.&nbsp;\nThe field is public or protected, so perhaps it is intended to be used with classes not seen as part of the analysis. If not,\nconsider removing it from the class."
        },
        "URF_UNREAD_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "Unread public/protected field",
            "LongDescription": "Unread public/protected field: {1}",
            "Details": "This field is never read.&nbsp;\nThe field is public or protected, so perhaps it is intended to be used with classes not seen as part of the analysis. If not,\nconsider removing it from the class."
        },
        "QF_QUESTIONABLE_FOR_LOOP": {
            "ShortDescription": "Complicated, subtle or wrong increment in for-loop",
            "LongDescription": "Complicated, subtle or wrong increment in for-loop {1}",
            "Details": "Are you sure this for loop is incrementing/decrementing the correct variable? It appears that another variable is being initialized and checked by the for loop.\n"
        },
        "UWF_NULL_FIELD": {
            "ShortDescription": "Field only ever set to null",
            "LongDescription": "Field only ever set to null: {1}",
            "Details": "All writes to this field are of the constant value null, and thus\nall reads of the field will return null.\nCheck for errors, or remove it if it is useless."
        },
        "UWF_UNWRITTEN_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "Unwritten public or protected field",
            "LongDescription": "Unwritten public or protected field: {1}",
            "Details": "No writes were seen to this public/protected field.&nbsp; All reads of it will return the default\nvalue. Check for errors (should it have been initialized?), or remove it if it is useless."
        },
        "UWF_UNWRITTEN_FIELD": {
            "ShortDescription": "Unwritten field",
            "LongDescription": "Unwritten field: {1}",
            "Details": "This field is never written.&nbsp; All reads of it will return the default\nvalue. Check for errors (should it have been initialized?), or remove it if it is useless."
        },
        "ST_WRITE_TO_STATIC_FROM_INSTANCE_METHOD": {
            "ShortDescription": "Write to static field from instance method",
            "LongDescription": "Write to static field {2} from instance method {1}",
            "Details": "This instance method writes to a static field. This is tricky to get\ncorrect if multiple instances are being manipulated,\nand generally bad practice.\n"
        },
        "NP_LOAD_OF_KNOWN_NULL_VALUE": {
            "ShortDescription": "Load of known null value",
            "LongDescription": "Load of known null value in {1}",
            "Details": "The variable referenced at this point is known to be null due to an earlier check against null. Although this is valid, it might be a mistake (perhaps you\nintended to refer to a different variable, or perhaps the earlier check to see if the\nvariable is null should have been a check to see if it was non-null).\n"
        },
        "NP_DEREFERENCE_OF_READLINE_VALUE": {
            "ShortDescription": "Dereference of the result of readLine() without nullcheck",
            "LongDescription": "Dereference of the result of readLine() without nullcheck in {1}",
            "Details": "The result of invoking readLine() is dereferenced without checking to see if the result is null. If there are no more lines of text\nto read, readLine() will return null and dereferencing that will generate a null pointer exception.\n"
        },
        "NP_IMMEDIATE_DEREFERENCE_OF_READLINE": {
            "ShortDescription": "Immediate dereference of the result of readLine()",
            "LongDescription": "Immediate dereference of the result of readLine() in {1}",
            "Details": "The result of invoking readLine() is immediately dereferenced. If there are no more lines of text\nto read, readLine() will return null and dereferencing that will generate a null pointer exception.\n"
        },
        "NP_UNWRITTEN_FIELD": {
            "ShortDescription": "Read of unwritten field",
            "LongDescription": "Read of unwritten field {2.name} in {1}",
            "Details": "The program is dereferencing a field that does not seem to ever have a non-null value written to it.\nUnless the field is initialized via some mechanism not seen by the analysis,\ndereferencing this value will generate a null pointer exception.\n"
        },
        "NP_UNWRITTEN_PUBLIC_OR_PROTECTED_FIELD": {
            "ShortDescription": "Read of unwritten public or protected field",
            "LongDescription": "Read of unwritten public or protected field {2.name} in {1}",
            "Details": "The program is dereferencing a public or protected\nfield that does not seem to ever have a non-null value written to it.\nUnless the field is initialized via some mechanism not seen by the analysis,\ndereferencing this value will generate a null pointer exception.\n"
        },
        "SIC_THREADLOCAL_DEADLY_EMBRACE": {
            "ShortDescription": "Deadly embrace of non-static inner class and thread local",
            "LongDescription": "{0} needs to be _static_ to avoid a deadly embrace with {1}",
            "Details": "This class is an inner class, but should probably be a static inner class. As it is, there is a serious danger of a deadly embrace between the inner class and the thread local in the outer class. Because the inner class isn't static, it retains a reference to the outer class. If the thread local contains a reference to an instance of the inner class, the inner and outer instance will both be reachable and not eligible for garbage collection.\n"
        },
        "SIC_INNER_SHOULD_BE_STATIC": {
            "ShortDescription": "Should be a static inner class",
            "LongDescription": "Should {0} be a _static_ inner class?",
            "Details": "This class is an inner class, but does not use its embedded reference to the object which created it.&nbsp; This reference makes the instances of the class larger, and may keep the reference to the creator object alive longer than necessary.&nbsp; If possible, the class should be made static.\n"
        },
        "UWF_FIELD_NOT_INITIALIZED_IN_CONSTRUCTOR": {
            "ShortDescription": "Field not initialized in constructor but dereferenced without null check",
            "LongDescription": "{1.givenClass} not initialized in constructor and dereferenced in {2}",
            "Details": "This field is never initialized within any constructor, and is therefore could be null after\nthe object is constructed. Elsewhere, it is loaded and dereferenced without a null check.\nThis could be either an error or a questionable design, since\nit means a null pointer exception will be generated if that field is dereferenced\nbefore being initialized.\n"
        },
        "SIC_INNER_SHOULD_BE_STATIC_ANON": {
            "ShortDescription": "Could be refactored into a named static inner class",
            "LongDescription": "The class {0} could be refactored into a named _static_ inner class",
            "Details": "This class is an inner class, but does not use its embedded reference to the object which created it.&nbsp; This reference makes the instances of the class larger, and may keep the reference to the creator object alive longer than necessary.&nbsp; If possible, the class should be made into ainner class. Since anonymous inner\nclasses cannot be marked as static, doing this will require refactoring\nthe inner class so that it is a named inner class."
        },
        "SIC_INNER_SHOULD_BE_STATIC_NEEDS_THIS": {
            "ShortDescription": "Could be refactored into a static inner class",
            "LongDescription": "The class {0} could be refactored into a _static_ inner class",
            "Details": "This class is an inner class, but does not use its embedded reference to the object which created it except during construction of the\ninner object.&nbsp; This reference makes the instances of the class larger, and may keep the reference to the creator object alive longer than necessary.&nbsp; If possible, the class should be made into ainner class. Since the reference to the outer object is required during construction of the inner instance, the inner class will need to be refactored so as to pass a reference to the outer instance to the constructor for the inner class."
        },
        "WA_NOT_IN_LOOP": {
            "ShortDescription": "Wait not in loop",
            "LongDescription": "Wait not in loop in {1}",
            "Details": "This method contains a call towhich is not in a loop.&nbsp; If the monitor is used for multiple conditions, the condition the caller intended to wait for might not be the one that actually occurred."
        },
        "WA_AWAIT_NOT_IN_LOOP": {
            "ShortDescription": "Condition.await() not in loop",
            "LongDescription": "Condition.await() not in loop in {1}",
            "Details": "This method contains a call to(or variants) which is not in a loop.&nbsp; If the object is used for multiple conditions, the condition the caller intended to wait for might not be the one that actually occurred."
        },
        "NO_NOTIFY_NOT_NOTIFYALL": {
            "ShortDescription": "Using notify() rather than notifyAll()",
            "LongDescription": "Using notify rather than notifyAll in {1}",
            "Details": "This method callsrather than.&nbsp; Java monitors are often used for multiple conditions.&nbsp; Callingonly wakes up one thread, meaning that the thread woken up might not be the one waiting for the condition that the caller just satisfied."
        },
        "UC_USELESS_VOID_METHOD": {
            "ShortDescription": "Useless non-empty void method",
            "LongDescription": "Method {1} seems to be useless",
            "Details": "Our analysis shows that this non-empty void method does not actually perform any useful work.\nPlease check it: probably there's a mistake in its code or its body can be fully removed.\nWe are trying to reduce the false positives as much as possible, but in some cases this warning might be wrong.\nCommon false-positive cases include:The method is intended to trigger loading of some class which may have a side effect.The method is intended to implicitly throw some obscure exception."
        },
        "UC_USELESS_CONDITION": {
            "ShortDescription": "Condition has no effect",
            "LongDescription": "Useless condition: it's known that {2} at this point",
            "Details": "This condition always produces the same result as the value of the involved variable that was narrowed before.\nProbably something else was meant or the condition can be removed."
        },
        "UC_USELESS_CONDITION_TYPE": {
            "ShortDescription": "Condition has no effect due to the variable type",
            "LongDescription": "Useless condition: it's always {2} because variable type is {3}",
            "Details": "This condition always produces the same result due to the type range of the involved variable.\nProbably something else was meant or the condition can be removed."
        },
        "UC_USELESS_OBJECT": {
            "ShortDescription": "Useless object created",
            "LongDescription": "Useless object stored in variable {2} of method {1}",
            "Details": "Our analysis shows that this object is useless.\nIt's created and modified, but its value never go outside of the method or produce any side-effect.\nEither there is a mistake and object was intended to be used or it can be removed.This analysis rarely produces false-positives. Common false-positive cases include:- This object used to implicitly throw some obscure exception.- This object used as a stub to generalize the code.- This object used to hold strong references to weak/soft-referenced objects."
        },
        "UC_USELESS_OBJECT_STACK": {
            "ShortDescription": "Useless object created on stack",
            "LongDescription": "Useless object created in method {1}",
            "Details": "This object is created just to perform some modifications which don't have any side-effect.\nProbably something else was meant or the object can be removed."
        },
        "RANGE_ARRAY_INDEX": {
            "ShortDescription": "Array index is out of bounds",
            "LongDescription": "Array index is out of bounds: {3}",
            "Details": "Array operation is performed, but array index is out of bounds, which will result in ArrayIndexOutOfBoundsException at runtime."
        },
        "RANGE_ARRAY_OFFSET": {
            "ShortDescription": "Array offset is out of bounds",
            "LongDescription": "Array offset is out of bounds: {3}",
            "Details": "Method is called with array parameter and offset parameter, but the offset is out of bounds. This will result in IndexOutOfBoundsException at runtime."
        },
        "RANGE_ARRAY_LENGTH": {
            "ShortDescription": "Array length is out of bounds",
            "LongDescription": "Array length is out of bounds: {3}",
            "Details": "Method is called with array parameter and length parameter, but the length is out of bounds. This will result in IndexOutOfBoundsException at runtime."
        },
        "RANGE_STRING_INDEX": {
            "ShortDescription": "String index is out of bounds",
            "LongDescription": "String index is out of bounds when calling {5}: {3}",
            "Details": "String method is called and specified string index is out of bounds. This will result in StringIndexOutOfBoundsException at runtime."
        },
        "RV_CHECK_FOR_POSITIVE_INDEXOF": {
            "ShortDescription": "Method checks to see if result of String.indexOf is positive",
            "LongDescription": "{1} checks to see if result of String.indexOf is positive",
            "Details": "The method invokes String.indexOf and checks to see if the result is positive or non-positive. It is much more typical to check to see if the result is negative or non-negative. It is positive only if the substring checked for occurs at some place other than at the beginning of the String."
        },
        "RV_DONT_JUST_NULL_CHECK_READLINE": {
            "ShortDescription": "Method discards result of readLine after checking if it is non-null",
            "LongDescription": "{1} discards result of readLine after checking if it is non-null",
            "Details": "The value returned by readLine is discarded after checking to see if the return\nvalue is non-null. In almost all situations, if the result is non-null, you will want\nto use that non-null value. Calling readLine again will give you a different line."
        },
        "RV_RETURN_VALUE_IGNORED_INFERRED": {
            "ShortDescription": "Method ignores return value, is this OK?",
            "LongDescription": "Return value of {2.givenClass} ignored, is this OK in {1}",
            "Details": "This code calls a method and ignores the return value. The return value\nis the same type as the type the method is invoked on, and from our analysis it looks\nlike the return value might be important (e.g., like ignoring the\nreturn value ofWe are guessing that ignoring the return value might be a bad idea just from\na simple analysis of the body of the method. You can use a @CheckReturnValue annotation\nto instruct SpotBugs as to whether ignoring the return value of this method\nis important or acceptable.\nPlease investigate this closely to decide whether it is OK to ignore the return value.\n"
        },
        "RV_RETURN_VALUE_IGNORED_NO_SIDE_EFFECT": {
            "ShortDescription": "Return value of method without side effect is ignored",
            "LongDescription": "Return value of {2.givenClass} ignored, but method has no side effect",
            "Details": "This code calls a method and ignores the return value. However, our analysis shows that\nthe method (including its implementations in subclasses if any) does not produce any effect\nother than return value. Thus, this call can be removed.\nWe are trying to reduce the false positives as much as possible, but in some cases this warning might be wrong.\nCommon false-positive cases include:- The method is designed to be overridden and produce a side effect in other projects which are out of the scope of the analysis.- The method is called to trigger the class loading which may have a side effect.- The method is called just to get some exception.If you feel that our assumption is incorrect, you can use a @CheckReturnValue annotation\nto instruct SpotBugs that ignoring the return value of this method is acceptable.\n"
        },
        "RV_RETURN_VALUE_IGNORED": {
            "ShortDescription": "Method ignores return value",
            "LongDescription": "Return value of {2.givenClass} ignored in {1}",
            "Details": "The return value of this method should be checked. One common\ncause of this warning is to invoke a method on an immutable object,\nthinking that it updates the object. For example, in the following code\nfragment,String dateString = getHeaderField(name);\ndateString.trim();\nthe programmer seems to be thinking that the trim() method will update\nthe String referenced by dateString. But since Strings are immutable, the trim()\nfunction returns a new String value, which is being ignored here. The code\nshould be corrected to:String dateString = getHeaderField(name);\ndateString = dateString.trim();\n"
        },
        "RV_RETURN_VALUE_IGNORED_BAD_PRACTICE": {
            "ShortDescription": "Method ignores exceptional return value",
            "LongDescription": "Exceptional return value of {2} ignored in {1}",
            "Details": "This method returns a value that is not checked. The return value should be checked\nsince it can indicate an unusual or unexpected function execution. For\nexample, themethod returns false\nif the file could not be successfully deleted (rather than\nthrowing an Exception).\nIf you don't check the result, you won't notice if the method invocation\nsignals unexpected behavior by returning an atypical return value.\n"
        },
        "RV_CHECK_COMPARETO_FOR_SPECIFIC_RETURN_VALUE": {
            "ShortDescription": "Code checks for specific values returned by compareTo",
            "LongDescription": "Check to see if return value of {2.givenClass} is equal to {3}",
            "Details": "This code invoked a compareTo or compare method, and checks to see if the return value is a specific value,\nsuch as 1 or -1. When invoking these methods, you should only check the sign of the result, not for any specific\nnon-zero value. While many or most compareTo and compare methods only return -1, 0 or 1, some of them\nwill return other values."
        },
        "RV_EXCEPTION_NOT_THROWN": {
            "ShortDescription": "Exception created and dropped rather than thrown",
            "LongDescription": "{2.givenClass} not thrown in {1}",
            "Details": "This code creates an exception (or error) object, but doesn't do anything with it. For example,\nsomething likeif (x &lt; 0) { new IllegalArgumentException(\"x must be nonnegative\");\n}\nIt was probably the intent of the programmer to throw the created exception:if (x &lt; 0) { throw new IllegalArgumentException(\"x must be nonnegative\");\n}\n"
        },
        "NP_ALWAYS_NULL": {
            "ShortDescription": "Null pointer dereference",
            "LongDescription": "Null pointer dereference of {2.givenClass} in {1}",
            "Details": "A null pointer is dereferenced here.&nbsp; This will lead to a\nwhen the code is executed."
        },
        "NP_CLOSING_NULL": {
            "ShortDescription": "close() invoked on a value that is always null",
            "LongDescription": "Cannot close {2.givenClass} since it is always null in {1}",
            "Details": "close() is being invoked on a value that is always null. If this statement is executed,\na null pointer exception will occur. But the big risk here you never close\nsomething that should be closed."
        },
        "NP_STORE_INTO_NONNULL_FIELD": {
            "ShortDescription": "Store of null value into field annotated @Nonnull",
            "LongDescription": "Store of null value into field {2.givenClass} annotated @Nonnull in {1}",
            "Details": "A value that could be null is stored into a field that has been annotated as @Nonnull."
        },
        "NP_ALWAYS_NULL_EXCEPTION": {
            "ShortDescription": "Null pointer dereference in method on exception path",
            "LongDescription": "Null pointer dereference of {2.givenClass} in {1} on exception path",
            "Details": "A pointer which is null on an exception path is dereferenced here.&nbsp;\nThis will lead to awhen the code is executed.&nbsp;\nNote that because SpotBugs currently does not prune infeasible exception paths,\nthis may be a false warning.Also note that SpotBugs considers the default case of a switch statement to\nbe an exception path, since the default case is often infeasible."
        },
        "NP_PARAMETER_MUST_BE_NONNULL_BUT_MARKED_AS_NULLABLE": {
            "ShortDescription": "Parameter must be non-null but is marked as nullable",
            "LongDescription": "{2} must be non-null but is marked as nullable",
            "Details": "This parameter is always used in a way that requires it to be non-null,\nbut the parameter is explicitly annotated as being Nullable. Either the use\nof the parameter or the annotation is wrong.\n"
        },
        "NP_NULL_ON_SOME_PATH": {
            "ShortDescription": "Possible null pointer dereference",
            "LongDescription": "Possible null pointer dereference of {2.givenClass} in {1}",
            "Details": "There is a branch of statement that,if executed,guarantees that\na null value will be dereferenced, which\nwould generate awhen the code is executed.\nOf course, the problem might be that the branch or statement is infeasible and that\nthe null pointer exception cannot ever be executed; deciding that is beyond the ability of SpotBugs.\n"
        },
        "NP_NULL_ON_SOME_PATH_MIGHT_BE_INFEASIBLE": {
            "ShortDescription": "Possible null pointer dereference on branch that might be infeasible",
            "LongDescription": "Possible null pointer dereference of {2.givenClass} on branch that might be infeasible in {1}",
            "Details": "There is a branch of statement that,if executed,guarantees that\na null value will be dereferenced, which\nwould generate awhen the code is executed.\nOf course, the problem might be that the branch or statement is infeasible and that\nthe null pointer exception cannot ever be executed; deciding that is beyond the ability of SpotBugs.\nDue to the fact that this value had been previously tested for nullness,\nthis is a definite possibility.\n"
        },
        "NP_NULL_ON_SOME_PATH_EXCEPTION": {
            "ShortDescription": "Possible null pointer dereference in method on exception path",
            "LongDescription": "Possible null pointer dereference of {2.givenClass} in {1} on exception path",
            "Details": "A reference value which is null on some exception control path is\ndereferenced here.&nbsp; This may lead to a\nwhen the code is executed.&nbsp;\nNote that because SpotBugs currently does not prune infeasible exception paths,\nthis may be a false warning.Also note that SpotBugs considers the default case of a switch statement to\nbe an exception path, since the default case is often infeasible."
        },
        "NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE": {
            "ShortDescription": "Possible null pointer dereference due to return value of called method",
            "LongDescription": "Possible null pointer dereference in {1} due to return value of called method",
            "Details": "The return value from a method is dereferenced without a null check,\nand the return value of that method is one that should generally be checked\nfor null.  This may lead to awhen the code is executed.\n"
        },
        "NP_NULL_PARAM_DEREF_NONVIRTUAL": {
            "ShortDescription": "Non-virtual method call passes null for non-null parameter",
            "LongDescription": "Non-virtual method call in {1} passes null for non-null parameter of {2.givenClass}",
            "Details": "A possibly-null value is passed to a non-null method parameter. Either the parameter is annotated as a parameter that should always be non-null, or analysis has shown that it will always be dereferenced."
        },
        "NP_NULL_PARAM_DEREF_ALL_TARGETS_DANGEROUS": {
            "ShortDescription": "Method call passes null for non-null parameter",
            "LongDescription": "Null passed for non-null parameter of {2.givenClass} in {1}",
            "Details": "A possibly-null value is passed at a call site where all known target methods require the parameter to be non-null. Either the parameter is annotated as a parameter that should always be non-null, or analysis has shown that it will always be dereferenced."
        },
        "NP_NULL_PARAM_DEREF": {
            "ShortDescription": "Method call passes null for non-null parameter",
            "LongDescription": "Null passed for non-null parameter of {2.givenClass} in {1}",
            "Details": "This method call passes a null value for a non-null method parameter. Either the parameter is annotated as a parameter that should always be non-null, or analysis has shown that it will always be dereferenced."
        },
        "NP_NONNULL_PARAM_VIOLATION": {
            "ShortDescription": "Method call passes null to a non-null parameter",
            "LongDescription": "Null passed for non-null parameter of {2.givenClass} in {1}",
            "Details": "This method passes a null value as the parameter of a method which must be non-null. Either this parameter has been explicitly marked as @Nonnull, or analysis has determined that this parameter is always dereferenced."
        },
        "NP_NONNULL_RETURN_VIOLATION": {
            "ShortDescription": "Method may return null, but is declared @Nonnull",
            "LongDescription": "{1} may return null, but is declared @Nonnull",
            "Details": "This method may return a null value, but the method (or a superclass method which it overrides) is declared to return @Nonnull."
        },
        "NP_CLONE_COULD_RETURN_NULL": {
            "ShortDescription": "Clone method may return null",
            "LongDescription": "{1} may return null",
            "Details": "This clone method seems to return null in some circumstances, but clone is never allowed to return a null value.  If you are convinced this path is unreachable, throw an AssertionError instead."
        },
        "NP_TOSTRING_COULD_RETURN_NULL": {
            "ShortDescription": "toString method may return null",
            "LongDescription": "{1} may return null",
            "Details": "This toString method seems to return null in some circumstances. A liberal reading of the spec could be interpreted as allowing this, but it is probably a bad idea and could cause other code to break. Return the empty string or some other appropriate string rather than null."
        },
        "NP_GUARANTEED_DEREF": {
            "ShortDescription": "Null value is guaranteed to be dereferenced",
            "LongDescription": "{2.givenClass} could be null and is guaranteed to be dereferenced in {1}",
            "Details": "There is a statement or branch that if executed guarantees that a value is null at this point, and that value that is guaranteed to be dereferenced (except on forward paths involving runtime exceptions).Note that a check such asif (x == null) throw new NullPointerException();is treated as a dereference of"
        },
        "NP_GUARANTEED_DEREF_ON_EXCEPTION_PATH": {
            "ShortDescription": "Value is null and guaranteed to be dereferenced on exception path",
            "LongDescription": "{2.name} is null guaranteed to be dereferenced in {1} on exception path",
            "Details": "There is a statement or branch on an exception path that if executed guarantees that a value is null at this point, and that value that is guaranteed to be dereferenced (except on forward paths involving runtime exceptions)."
        },
        "SI_INSTANCE_BEFORE_FINALS_ASSIGNED": {
            "ShortDescription": "Static initializer creates instance before all static final fields assigned",
            "LongDescription": "Static initializer for {0} creates instance before all static final fields assigned",
            "Details": "The class's static initializer creates an instance of the class\nbefore all of the static final fields are assigned."
        },
        "OS_OPEN_STREAM": {
            "ShortDescription": "Method may fail to close stream",
            "LongDescription": "{1} may fail to close stream",
            "Details": "The method creates an IO stream object, does not assign it to any\nfields, pass it to other methods that might close it,\nor return it, and does not appear to close\nthe stream on all paths out of the method.&nbsp; This may result in\na file descriptor leak.&nbsp; It is generally a good\nidea to use ablock to ensure that streams are\nclosed."
        },
        "OS_OPEN_STREAM_EXCEPTION_PATH": {
            "ShortDescription": "Method may fail to close stream on exception",
            "LongDescription": "{1} may fail to close stream on exception",
            "Details": "The method creates an IO stream object, does not assign it to any\nfields, pass it to other methods, or return it, and does not appear to close\nit on all possible exception paths out of the method.&nbsp;\nThis may result in a file descriptor leak.&nbsp; It is generally a good\nidea to use ablock to ensure that streams are\nclosed."
        },
        "PZLA_PREFER_ZERO_LENGTH_ARRAYS": {
            "ShortDescription": "Consider returning a zero length array rather than null",
            "LongDescription": "Should {1} return a zero length array rather than null?",
            "Details": "It is often a better design to\nreturn a length zero array rather than a null reference to indicate that there\nare no results (i.e., an empty list of results).\nThis way, no explicit check for null is needed by clients of the method.On the other hand, using null to indicate\n\"there is no answer to this question\" is probably appropriate.\nFor example,returns an empty list\nif given a directory containing no files, and returns null if the file\nis not a directory."
        },
        "UCF_USELESS_CONTROL_FLOW": {
            "ShortDescription": "Useless control flow",
            "LongDescription": "Useless control flow in {1}",
            "Details": "This method contains a useless control flow statement, where\ncontrol flow continues onto the same place regardless of whether or not\nthe branch is taken. For example,\nthis is caused by having an empty statement\nblock for anstatement:if (argv.length == 0) { // TODO: handle this case\n}\n"
        },
        "UCF_USELESS_CONTROL_FLOW_NEXT_LINE": {
            "ShortDescription": "Useless control flow to next line",
            "LongDescription": "Useless control flow to next line in {1}",
            "Details": "This method contains a useless control flow statement in which control\nflow follows to the same or following line regardless of whether or not\nthe branch is taken.\nOften, this is caused by inadvertently using an empty statement as the\nbody of anstatement, e.g.:if (argv.length == 1); System.out.println(\"Hello, \" + argv[0]);\n"
        },
        "RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE": {
            "ShortDescription": "Nullcheck of value previously dereferenced",
            "LongDescription": "Nullcheck of {2.givenClass} at {4.lineNumber} of value previously dereferenced in {1}",
            "Details": "A value is checked here to see whether it is null, but this value cannot\nbe null because it was previously dereferenced and if it were null a null pointer\nexception would have occurred at the earlier dereference.\nEssentially, this code and the previous dereference\ndisagree as to whether this value is allowed to be null. Either the check is redundant\nor the previous dereference is erroneous."
        },
        "RCN_REDUNDANT_NULLCHECK_OF_NULL_VALUE": {
            "ShortDescription": "Redundant nullcheck of value known to be null",
            "LongDescription": "Redundant nullcheck of {2} which is known to be null in {1}",
            "Details": "This method contains a redundant check of a known null value against\nthe constant null."
        },
        "RCN_REDUNDANT_NULLCHECK_OF_NONNULL_VALUE": {
            "ShortDescription": "Redundant nullcheck of value known to be non-null",
            "LongDescription": "Redundant nullcheck of {2}, which is known to be non-null in {1}",
            "Details": "This method contains a redundant check of a known non-null value against\nthe constant null."
        },
        "RCN_REDUNDANT_COMPARISON_TWO_NULL_VALUES": {
            "ShortDescription": "Redundant comparison of two null values",
            "LongDescription": "Redundant comparison of two null values in {1}",
            "Details": "This method contains a redundant comparison of two references known to\nboth be definitely null."
        },
        "RCN_REDUNDANT_COMPARISON_OF_NULL_AND_NONNULL_VALUE": {
            "ShortDescription": "Redundant comparison of non-null value to null",
            "LongDescription": "Redundant comparison of non-null value to null in {1}",
            "Details": "This method contains a reference known to be non-null with another reference\nknown to be null."
        },
        "RCN_REDUNDANT_CHECKED_NULL_COMPARISON": {
            "deprecated": "true",
            "ShortDescription": "Redundant comparison to null of previously checked value",
            "LongDescription": "Redundant comparison to null of previously checked {2} in {1}",
            "Details": "This method contains a redundant comparison of a reference value\nto null. Two types of redundant comparison are reported:\nBoth values compared are definitely nullOne value is definitely null and the other is definitely not nullThis particular warning generally indicates that a\nvalue known not to be null was checked against null.\nWhile the check is not necessary, it may simply be a case\nof defensive programming."
        },
        "UL_UNRELEASED_LOCK": {
            "ShortDescription": "Method does not release lock on all paths",
            "LongDescription": "{1} does not release lock on all paths",
            "Details": "This method acquires a JSR-166 () lock,\nbut does not release it on all paths out of the method.  In general, the correct idiom\nfor using a JSR-166 lock is:\nLock l = ...;\nl.lock();\ntry { // do something\n} finally { l.unlock();\n}\n"
        },
        "UL_UNRELEASED_LOCK_EXCEPTION_PATH": {
            "ShortDescription": "Method does not release lock on all exception paths",
            "LongDescription": "{1} does not release lock on all exception paths",
            "Details": "This method acquires a JSR-166 () lock,\nbut does not release it on all exception paths out of the method.  In general, the correct idiom\nfor using a JSR-166 lock is:\nLock l = ...;\nl.lock();\ntry { // do something\n} finally { l.unlock();\n}\n"
        },
        "RC_REF_COMPARISON": {
            "ShortDescription": "Suspicious reference comparison",
            "LongDescription": "Suspicious comparison of {2} references in {1}",
            "Details": "This method compares two reference values using the == or != operator,\nwhere the correct way to compare instances of this type is generally\nwith the equals() method.\nIt is possible to create distinct instances that are equal but do not compare as == since\nthey are different objects.\nExamples of classes which should generally\nnot be compared by reference are java.lang.Integer, java.lang.Float, etc. RC_REF_COMPARISON covers\nonly wrapper types for primitives. Suspicious types list can be extended by adding frc.suspicious\nsystem property with comma-separated classes:&lt;systemPropertyVariables&gt; &lt;frc.suspicious&gt;java.time.LocalDate,java.util.List&lt;/frc.suspicious&gt; &lt;/systemPropertyVariables&gt;\n"
        },
        "RC_REF_COMPARISON_BAD_PRACTICE": {
            "ShortDescription": "Suspicious reference comparison to constant",
            "LongDescription": "Suspicious comparison of a {2} reference to constant in {1}",
            "Details": "This method compares a reference value to a constant using the == or != operator,\nwhere the correct way to compare instances of this type is generally\nwith the equals() method.\nIt is possible to create distinct instances that are equal but do not compare as == since\nthey are different objects.\nExamples of classes which should generally\nnot be compared by reference are java.lang.Integer, java.lang.Float, etc."
        },
        "RC_REF_COMPARISON_BAD_PRACTICE_BOOLEAN": {
            "ShortDescription": "Suspicious reference comparison of Boolean values",
            "LongDescription": "Suspicious comparison of Boolean references in {1}",
            "Details": "This method compares two Boolean values using the == or != operator.\nNormally, there are only two Boolean values (Boolean.TRUE and Boolean.FALSE),\nbut it is possible to create other Boolean objects using thenew Boolean(b)\nconstructor. It is best to avoid such objects, but if they do exist,\nthen checking Boolean objects for equality using == or != will give results\nthan are different than you would get using"
        },
        "EC_UNRELATED_TYPES_USING_POINTER_EQUALITY": {
            "ShortDescription": "Using pointer equality to compare different types",
            "LongDescription": "Using pointer equality to compare a {2.givenClass} with a {3.givenClass} in {1}",
            "Details": "This method uses pointer equality to compare two references that seem to be of\ndifferent types. The result of this comparison will always be false at runtime.\n"
        },
        "EC_UNRELATED_TYPES": {
            "ShortDescription": "Call to equals() comparing different types",
            "LongDescription": "Call to {3.simpleClass}.equals({2.simpleClass}) in {1}",
            "Details": "This method calls equals(Object) on two references of different\nclass types and analysis suggests they will be to objects of different classes\nat runtime. Further, examination of the equals methods that would be invoked suggest that either\nthis call will always return false, or else the equals method is not symmetric (which is\na property required by the contract\nfor equals in class Object).\n"
        },
        "EC_UNRELATED_INTERFACES": {
            "ShortDescription": "Call to equals() comparing different interface types",
            "LongDescription": "Call to {3.simpleClass}.equals({2.simpleClass}) in {1}",
            "Details": "This method calls equals(Object) on two references of unrelated\ninterface types, where neither is a subtype of the other,\nand there are no known non-abstract classes which implement both interfaces.\nTherefore, the objects being compared\nare unlikely to be members of the same class at runtime\n(unless some application classes were not analyzed, or dynamic class\nloading can occur at runtime).\nAccording to the contract of equals(),\nobjects of different\nclasses should always compare as unequal; therefore, according to the\ncontract defined by java.lang.Object.equals(Object),\nthe result of this comparison will always be false at runtime.\n"
        },
        "EC_UNRELATED_CLASS_AND_INTERFACE": {
            "ShortDescription": "Call to equals() comparing unrelated class and interface",
            "LongDescription": "Call to {3.simpleClass}.equals({2.simpleClass}) in {1}",
            "Details": "\nThis method calls equals(Object) on two references,  one of which is a class\nand the other an interface, where neither the class nor any of its\nnon-abstract subclasses implement the interface.\nTherefore, the objects being compared\nare unlikely to be members of the same class at runtime\n(unless some application classes were not analyzed, or dynamic class\nloading can occur at runtime).\nAccording to the contract of equals(),\nobjects of different\nclasses should always compare as unequal; therefore, according to the\ncontract defined by java.lang.Object.equals(Object),\nthe result of this comparison will always be false at runtime.\n"
        },
        "EC_NULL_ARG": {
            "ShortDescription": "Call to equals(null)",
            "LongDescription": "Call to equals(null) in {1}",
            "Details": "This method calls equals(Object), passing a null value as\nthe argument. According to the contract of the equals() method,\nthis call should always return"
        },
        "MWN_MISMATCHED_WAIT": {
            "ShortDescription": "Mismatched wait()",
            "LongDescription": "Mismatched wait() in {1}",
            "Details": "This method calls Object.wait() without obviously holding a lock\non the object.&nbsp;  Calling wait() without a lock held will result in\nanbeing thrown."
        },
        "MWN_MISMATCHED_NOTIFY": {
            "ShortDescription": "Mismatched notify()",
            "LongDescription": "Mismatched notify() in {1}",
            "Details": "This method calls Object.notify() or Object.notifyAll() without obviously holding a lock\non the object.&nbsp;  Calling notify() or notifyAll() without a lock held will result in\nanbeing thrown."
        },
        "SA_LOCAL_SELF_ASSIGNMENT_INSTEAD_OF_FIELD": {
            "ShortDescription": "Self assignment of local rather than assignment to field",
            "LongDescription": "Self assignment of {2} rather than assigned to field in {1}",
            "Details": "This method contains a self assignment of a local variable, and there\nis a field with an identical name, e.g.:int foo; public void setFoo(int foo) { foo = foo; }\nThe assignment is useless. Did you mean to assign to the field instead?"
        },
        "SA_LOCAL_SELF_ASSIGNMENT": {
            "ShortDescription": "Self assignment of local variable",
            "LongDescription": "Self assignment of {2} in {1}",
            "Details": "This method contains a self assignment of a local variable; e.g.public void foo() { int x = 3; x = x;\n}\n\nSuch assignments are useless, and may indicate a logic error or typo.\n"
        },
        "SA_FIELD_SELF_ASSIGNMENT": {
            "ShortDescription": "Self assignment of field",
            "LongDescription": "Self assignment of field {2.givenClass} in {1}",
            "Details": "This method contains a self assignment of a field; e.g.\nint x;\npublic void foo() { x = x;\n}\nSuch assignments are useless, and may indicate a logic error or typo."
        },
        "SA_FIELD_DOUBLE_ASSIGNMENT": {
            "ShortDescription": "Double assignment of field",
            "LongDescription": "Double assignment of field {2.givenClass} in {1}",
            "Details": "This method contains a double assignment of a field; e.g.\nint x,y;\npublic void foo() { x = x = 17;\n}\nAssigning to a field twice is useless, and may indicate a logic error or typo."
        },
        "SA_LOCAL_DOUBLE_ASSIGNMENT": {
            "ShortDescription": "Double assignment of local variable",
            "LongDescription": "Double assignment of {2} in {1}",
            "Details": "This method contains a double assignment of a local variable; e.g.\npublic void foo() { int x,y; x = x = 17;\n}\nAssigning the same value to a variable twice is useless, and may indicate a logic error or typo."
        },
        "SA_FIELD_SELF_COMPUTATION": {
            "ShortDescription": "Nonsensical self computation involving a field (e.g., x & x)",
            "LongDescription": "Nonsensical self computation of {2.givenClass} with itself in {1}",
            "Details": "This method performs a nonsensical computation of a field with another\nreference to the same field (e.g., x&x or x-x). Because of the nature\nof the computation, this operation doesn't seem to make sense,\nand may indicate a typo or a logic error. Double-check the computation.\n"
        },
        "SA_LOCAL_SELF_COMPUTATION": {
            "ShortDescription": "Nonsensical self computation involving a variable (e.g., x & x)",
            "LongDescription": "Nonsensical self computation of {2} with itself in {1}",
            "Details": "This method performs a nonsensical computation of a local variable with another\nreference to the same variable (e.g., x&x or x-x). Because of the nature\nof the computation, this operation doesn't seem to make sense,\nand may indicate a typo or a logic error. Double-check the computation.\n"
        },
        "SA_FIELD_SELF_COMPARISON": {
            "ShortDescription": "Self comparison of field with itself",
            "LongDescription": "Self comparison of {2.givenClass} with itself in {1}",
            "Details": "This method compares a field with itself, and may indicate a typo or\na logic error.  Make sure that you are comparing the right things.\n"
        },
        "SA_LOCAL_SELF_COMPARISON": {
            "ShortDescription": "Self comparison of value with itself",
            "LongDescription": "Self comparison of {2} with itself {1}",
            "Details": "This method compares a local variable with itself, and may indicate a typo or\na logic error.  Make sure that you are comparing the right things.\n"
        },
        "DMI_LONG_BITS_TO_DOUBLE_INVOKED_ON_INT": {
            "ShortDescription": "Double.longBitsToDouble invoked on an int",
            "LongDescription": "Double.longBitsToDouble invoked on an int in {1}",
            "Details": "The Double.longBitsToDouble method is invoked, but a 32 bit int value is passed as an argument. This almost certainly is not intended and is unlikely to give the intended result.\n"
        },
        "DMI_ARGUMENTS_WRONG_ORDER": {
            "ShortDescription": "Reversed method arguments",
            "LongDescription": "Arguments in wrong order for invocation of {2.name} in {1}",
            "Details": "The arguments to this method call seem to be in the wrong order.\nFor example, a callPreconditions.checkNotNull(\"message\", message)\nhas reserved arguments: the value to be checked is the first argument.\n"
        },
        "DMI_RANDOM_USED_ONLY_ONCE": {
            "ShortDescription": "Random object created and used only once",
            "LongDescription": "Random object created and used only once in {1}",
            "Details": "This code creates a java.util.Random object, uses it to generate one random number, and then discards\nthe Random object. This produces mediocre quality random numbers and is inefficient.\nIf possible, rewrite the code so that the Random object is created once and saved, and each time a new random number\nis required invoke a method on the existing Random object to obtain it.\nIf it is important that the generated Random numbers not be guessable, younot create a new Random for each random\nnumber; the values are too easily guessable. You should strongly consider using a java.security.SecureRandom instead\n(and avoid allocating a new SecureRandom for each random number needed).\n"
        },
        "RV_ABSOLUTE_VALUE_OF_RANDOM_INT": {
            "ShortDescription": "Bad attempt to compute absolute value of signed random integer",
            "LongDescription": "Bad attempt to compute absolute value of signed random integer in {1}",
            "Details": "This code generates a random signed integer and then computes\nthe absolute value of that random integer.  If the number returned by the random number\ngenerator is, then the result will be negative as well (since\nMath.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE). (Same problem arises for long values as well).\n"
        },
        "RV_ABSOLUTE_VALUE_OF_HASHCODE": {
            "ShortDescription": "Bad attempt to compute absolute value of signed 32-bit hashcode",
            "LongDescription": "Bad attempt to compute absolute value of signed 32-bit hashcode in {1}",
            "Details": "This code generates a hashcode and then computes\nthe absolute value of that hashcode.  If the hashcode\nis, then the result will be negative as well (since\nMath.abs(Integer.MIN_VALUE) == Integer.MIN_VALUEOne out of 2^32 strings have a hashCode of Integer.MIN_VALUE,\nincluding \"polygenelubricants\" \"GydZG_\" and \"\"DESIGNING WORKHOUSES\".\n"
        },
        "RV_REM_OF_RANDOM_INT": {
            "ShortDescription": "Remainder of 32-bit signed random integer",
            "LongDescription": "Remainder of 32-bit signed random integer computed in {1}",
            "Details": "This code generates a random signed integer and then computes\nthe remainder of that value modulo another value. Since the random\nnumber can be negative, the result of the remainder operation\ncan also be negative. Be sure this is intended, and strongly\nconsider using the Random.nextInt(int) method instead.\n"
        },
        "RV_REM_OF_HASHCODE": {
            "ShortDescription": "Remainder of hashCode could be negative",
            "LongDescription": "Remainder of hashCode could be negative in {1}",
            "Details": "This code computes a hashCode, and then computes\nthe remainder of that value modulo another value. Since the hashCode\ncan be negative, the result of the remainder operation\ncan also be negative.Assuming you want to ensure that the result of your computation is nonnegative,\nyou may need to change your code.\nIf you know the divisor is a power of 2,\nyou can use a bitwise and operator instead (i.e., instead of\nusing, use).\nThis is probably faster than computing the remainder as well.\nIf you don't know that the divisor is a power of 2, take the absolute\nvalue of the result of the remainder operation (i.e., use\n"
        },
        "INT_BAD_COMPARISON_WITH_NONNEGATIVE_VALUE": {
            "ShortDescription": "Bad comparison of nonnegative value with negative constant or zero",
            "LongDescription": "Bad comparison of nonnegative value with {2} in {1}",
            "Details": "This code compares a value that is guaranteed to be non-negative with a negative constant or zero.\n"
        },
        "INT_BAD_COMPARISON_WITH_SIGNED_BYTE": {
            "ShortDescription": "Bad comparison of signed byte",
            "LongDescription": "Bad comparison of signed byte with {2} in {1}",
            "Details": "Signed bytes can only have a value in the range -128 to 127. Comparing\na signed byte with a value outside that range is vacuous and likely to be incorrect.\nTo convert a signed byteto an unsigned value in the range 0..255,\nuse0xff &amp; b"
        },
        "INT_BAD_COMPARISON_WITH_INT_VALUE": {
            "ShortDescription": "Bad comparison of int value with long constant",
            "LongDescription": "Bad comparison of int with {2} in {1}",
            "Details": "This code compares an int value with a long constant that is outside\nthe range of values that can be represented as an int value.\nThis comparison is vacuous and possibly incorrect.\n"
        },
        "INT_VACUOUS_BIT_OPERATION": {
            "ShortDescription": "Vacuous bit mask operation on integer value",
            "LongDescription": "Vacuous {2} operation on {3} in {1}",
            "Details": "This is an integer bit operation (and, or, or exclusive or) that doesn't do any useful work\n(e.g.,v & 0xffffffff"
        },
        "INT_VACUOUS_COMPARISON": {
            "ShortDescription": "Vacuous comparison of integer value",
            "LongDescription": "Vacuous comparison of integer value {1}",
            "Details": "There is an integer comparison that always returns\nthe same value (e.g., x &lt;= Integer.MAX_VALUE).\n"
        },
        "INT_BAD_REM_BY_1": {
            "ShortDescription": "Integer remainder modulo 1",
            "LongDescription": "Integer remainder modulo 1 computed in {1}",
            "Details": "Any expression (exp % 1) is guaranteed to always return zero.\nDid you mean (exp &amp; 1) or (exp % 2) instead?\n"
        },
        "BIT_IOR_OF_SIGNED_BYTE": {
            "ShortDescription": "Bitwise OR of signed byte value",
            "LongDescription": "Bitwise OR of signed byte value computed in {1}",
            "Details": "Loads a byte value (e.g., a value loaded from a byte array or returned by a method\nwith return type byte)  and performs a bitwise OR with\nthat value. Byte values are sign extended to 32 bits\nbefore any bitwise operations are performed on the value.\nThus, ifcontains the value, and\nis initially 0, then the code\n((x &lt;&lt; 8) | b[0])will sign extend\nto get, and thus give the value\nas the result.\nIn particular, the following code for packing a byte array into an int is badly wrong:int result = 0;\nfor (int i = 0; i &lt; 4; i++) { result = ((result &lt;&lt; 8) | b[i]);\n}\nThe following idiom will work instead:int result = 0;\nfor (int i = 0; i &lt; 4; i++) { result = ((result &lt;&lt; 8) | (b[i] &amp; 0xff));\n}\n"
        },
        "BIT_ADD_OF_SIGNED_BYTE": {
            "ShortDescription": "Bitwise add of signed byte value",
            "LongDescription": "Bitwise add of signed byte value computed in {1}",
            "Details": "Adds a byte value and a value which is known to have the 8 lower bits clear.\nValues loaded from a byte array are sign extended to 32 bits\nbefore any bitwise operations are performed on the value.\nThus, ifcontains the value, and\nis initially 0, then the code\n((x &lt;&lt; 8) + b[0])will sign extend\nto get, and thus give the value\nas the result.\nIn particular, the following code for packing a byte array into an int is badly wrong:int result = 0;\nfor (int i = 0; i &lt; 4; i++) result = ((result &lt;&lt; 8) + b[i]);\nThe following idiom will work instead:int result = 0;\nfor (int i = 0; i &lt; 4; i++) result = ((result &lt;&lt; 8) + (b[i] &amp; 0xff));\n"
        },
        "BIT_AND": {
            "ShortDescription": "Incompatible bit masks",
            "LongDescription": "Incompatible bit masks in (e & {2} == {3}) yields a constant result in {1}",
            "Details": "This method compares an expression of the form (e &amp; C) to D,\nwhich will always compare unequal\ndue to the specific values of constants C and D.\nThis may indicate a logic error or typo."
        },
        "BIT_SIGNED_CHECK": {
            "ShortDescription": "Check for sign of bitwise operation",
            "LongDescription": "Check for sign of bitwise operation in {1}",
            "Details": "This method compares an expression such as\n((event.detail &amp; SWT.SELECTED) &gt; 0).\nUsing bit arithmetic and then comparing with the greater than operator can\nlead to unexpected results (of course depending on the value of\nSWT.SELECTED). If SWT.SELECTED is a negative number, this is a candidate\nfor a bug. Even when SWT.SELECTED is not negative, it seems good practice\nto use '!= 0' instead of '&gt; 0'.\n"
        },
        "BIT_SIGNED_CHECK_HIGH_BIT": {
            "ShortDescription": "Check for sign of bitwise operation involving negative number",
            "LongDescription": "Check for sign of bitwise operation involving {2} in {1}",
            "Details": "This method compares a bitwise expression such as\n((val &amp; CONSTANT) &gt; 0)where CONSTANT is the negative number.\nUsing bit arithmetic and then comparing with the greater than operator can\nlead to unexpected results. This comparison is unlikely to work as expected. The good practice is\nto use '!= 0' instead of '&gt; 0'.\n"
        },
        "BIT_AND_ZZ": {
            "ShortDescription": "Check to see if ((...) & 0) == 0",
            "LongDescription": "Check to see if ((...) & 0) == 0 in {1}",
            "Details": "This method compares an expression of the form(e &amp; 0)to 0,\nwhich will always compare equal.\nThis may indicate a logic error or typo."
        },
        "BIT_IOR": {
            "ShortDescription": "Incompatible bit masks",
            "LongDescription": "Incompatible bit masks in (e | {2} == {3}) yields constant result in {1}",
            "Details": "This method compares an expression of the form(e | C)to D.\nwhich will always compare unequal\ndue to the specific values of constants C and D.\nThis may indicate a logic error or typo.Typically, this bug occurs because the code wants to perform\na membership test in a bit set, but uses the bitwise OR\noperator (\"|\") instead of bitwise AND (\"&amp;\").Also such bug may appear in expressions like(e &amp; A | B) == C\nwhich is parsed like((e &amp; A) | B) == Cwhile(e &amp; (A | B)) == Cwas intended."
        },
        "LI_LAZY_INIT_INSTANCE": {
            "deprecated": "true",
            "ShortDescription": "Incorrect lazy initialization of instance field",
            "LongDescription": "Incorrect lazy initialization of instance field {2} in {1}",
            "Details": "This method contains an unsynchronized lazy initialization of a non-volatile field.\nBecause the compiler or processor may reorder instructions,\nthreads are not guaranteed to see a completely initialized object,\nif the method can be called by multiple threads.\nYou can make the field volatile to correct the problem.\nFor more information, see the\n<a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/\">Java Memory Model web site"
        },
        "LI_LAZY_INIT_STATIC": {
            "ShortDescription": "Incorrect lazy initialization of static field",
            "LongDescription": "Incorrect lazy initialization of static field {2} in {1}",
            "Details": "This method contains an unsynchronized lazy initialization of a non-volatile static field.\nBecause the compiler or processor may reorder instructions,\nthreads are not guaranteed to see a completely initialized object,\nif the method can be called by multiple threads.\nYou can make the field volatile to correct the problem.\nFor more information, see the\n<a href=\"http://www.cs.umd.edu/~pugh/java/memoryModel/\">Java Memory Model web site"
        },
        "LI_LAZY_INIT_UPDATE_STATIC": {
            "ShortDescription": "Incorrect lazy initialization and update of static field",
            "LongDescription": "Incorrect lazy initialization and update of static field {2} in {1}",
            "Details": "This method contains an unsynchronized lazy initialization of a static field.\nAfter the field is set, the object stored into that location is further updated or accessed.\nThe setting of the field is visible to other threads as soon as it is set. If the\nfurther accesses in the method that set the field serve to initialize the object, then\nyou have avery seriousmultithreading bug, unless something else prevents\nany other thread from accessing the stored object until it is fully initialized.\nEven if you feel confident that the method is never called by multiple\nthreads, it might be better to not set the static field until the value\nyou are setting it to is fully populated/initialized."
        },
        "JLM_JSR166_LOCK_MONITORENTER": {
            "ShortDescription": "Synchronization performed on Lock",
            "LongDescription": "Synchronization performed on {2} in {1}",
            "Details": "This method performs synchronization on an object that implements\njava.util.concurrent.locks.Lock. Such an object is locked/unlocked\nusing\nrather\nthan using thesynchronized (...)construct.\n"
        },
        "JML_JSR166_CALLING_WAIT_RATHER_THAN_AWAIT": {
            "ShortDescription": "Using monitor style wait methods on util.concurrent abstraction",
            "LongDescription": "Calling {2.name} rather than {3.name} in {1}",
            "Details": "This method calls\nor\n\non an object that also provides an\nmethod (such as util.concurrent Condition objects).\nThis probably isn't what you want, and even if you do want it, you should consider changing\nyour design, as other developers will find it exceptionally confusing.\n"
        },
        "JLM_JSR166_UTILCONCURRENT_MONITORENTER": {
            "ShortDescription": "Synchronization performed on util.concurrent instance",
            "LongDescription": "Synchronization performed on {2} in {1}",
            "Details": "This method performs synchronization on an object that is an instance of\na class from the java.util.concurrent package (or its subclasses). Instances\nof these classes have their own concurrency control mechanisms that are orthogonal to\nthe synchronization provided by the Java keyword. For example,\nsynchronizing on anwill not prevent other threads\nfrom modifying theSuch code may be correct, but should be carefully reviewed and documented,\nand may confuse people who have to maintain the code at a later date.\n"
        },
        "UPM_UNCALLED_PRIVATE_METHOD": {
            "ShortDescription": "Private method is never called",
            "LongDescription": "Private method {1} is never called",
            "Details": "This private method is never called. Although it is\npossible that the method will be invoked through reflection,\nit is more likely that the method is never used, and should be\nremoved.\n"
        },
        "UMAC_UNCALLABLE_METHOD_OF_ANONYMOUS_CLASS": {
            "ShortDescription": "Uncallable method defined in anonymous class",
            "LongDescription": "Uncallable method {1} defined in anonymous class",
            "Details": "This anonymous class defines a method that is not directly invoked and does not override\na method in a superclass. Since methods in other classes cannot directly invoke methods\ndeclared in an anonymous class, it seems that this method is uncallable. The method\nmight simply be dead code, but it is also possible that the method is intended to\noverride a method declared in a superclass, and due to a typo or other error the method does not,\nin fact, override the method it is intended to.\n"
        },
        "ODR_OPEN_DATABASE_RESOURCE": {
            "ShortDescription": "Method may fail to close database resource",
            "LongDescription": "{1} may fail to close {2.excludingPackage}",
            "Details": "The method creates a database resource (such as a database connection\nor row set), does not assign it to any\nfields, pass it to other methods, or return it, and does not appear to close\nthe object on all paths out of the method.&nbsp; Failure to\nclose database resources on all paths out of a method may\nresult in poor performance, and could cause the application to\nhave problems communicating with the database.\n"
        },
        "ODR_OPEN_DATABASE_RESOURCE_EXCEPTION_PATH": {
            "ShortDescription": "Method may fail to close database resource on exception",
            "LongDescription": "{1} may fail to close database resource on exception",
            "Details": "The method creates a database resource (such as a database connection\nor row set), does not assign it to any\nfields, pass it to other methods, or return it, and does not appear to close\nthe object on all exception paths out of the method.&nbsp; Failure to\nclose database resources on all paths out of a method may\nresult in poor performance, and could cause the application to\nhave problems communicating with the database."
        },
        "SBSC_USE_STRINGBUFFER_CONCATENATION": {
            "ShortDescription": "Method concatenates strings using + in a loop",
            "LongDescription": "{1} concatenates strings using + in a loop",
            "Details": "The method seems to be building a String using concatenation in a loop.\nIn each iteration, the String is converted to a StringBuffer/StringBuilder, appended to, and converted back to a String. This can lead to a cost quadratic in the number of iterations, as the growing string is recopied in each iteration.Better performance can be obtained by using\na StringBuffer (or StringBuilder in Java 5) explicitly.For example:// This is bad\nString s = \"\";\nfor (int i = 0; i &lt; field.length; ++i) { s = s + field[i];\n}\n\n// This is better\nStringBuffer buf = new StringBuffer();\nfor (int i = 0; i &lt; field.length; ++i) { buf.append(field[i]);\n}\nString s = buf.toString();\n"
        },
        "IIL_PREPARE_STATEMENT_IN_LOOP": {
            "ShortDescription": "Method calls prepareStatement in a loop",
            "LongDescription": "{1} calls prepareStatement with the constant arguments in a loop",
            "Details": "The method calls Connection.prepareStatement inside the loop passing the constant arguments.\nIf the PreparedStatement should be executed several times there's no reason to recreate it for each loop iteration.\nMove this call outside of the loop."
        },
        "IIL_ELEMENTS_GET_LENGTH_IN_LOOP": {
            "ShortDescription": "NodeList.getLength() called in a loop",
            "LongDescription": "{1} calls NodeList.getLength() in a loop for getElementsByTagName return value",
            "Details": "The method calls NodeList.getLength() inside the loop and NodeList was produced by getElementsByTagName call.\nThis NodeList doesn't store its length, but computes it every time in not very optimal way.\nConsider storing the length to the variable before the loop.\n"
        },
        "IIL_PATTERN_COMPILE_IN_LOOP": {
            "ShortDescription": "Method calls Pattern.compile in a loop",
            "LongDescription": "{1} calls Pattern.compile with the constant arguments in a loop",
            "Details": "The method calls Pattern.compile inside the loop passing the constant arguments.\nIf the Pattern should be used several times there's no reason to compile it for each loop iteration.\nMove this call outside of the loop or even into static final field."
        },
        "IIL_PATTERN_COMPILE_IN_LOOP_INDIRECT": {
            "ShortDescription": "Method compiles the regular expression in a loop",
            "LongDescription": "{1} compiles the regular expression in a loop",
            "Details": "The method creates the same regular expression inside the loop, so it will be compiled every iteration.\nIt would be more optimal to precompile this regular expression using Pattern.compile outside of the loop."
        },
        "IIO_INEFFICIENT_INDEX_OF": {
            "ShortDescription": "Inefficient use of String.indexOf(String)",
            "LongDescription": "{1} uses String.indexOf(String) instead of String.indexOf(int)",
            "Details": "This code passes a constant string of length 1 to String.indexOf().\nIt is more efficient to use the integer implementations of String.indexOf().\nf. e. callinstead of"
        },
        "IIO_INEFFICIENT_LAST_INDEX_OF": {
            "ShortDescription": "Inefficient use of String.lastIndexOf(String)",
            "LongDescription": "{1} uses String.lastIndexOf(String) instead of String.lastIndexOf(int)",
            "Details": "This code passes a constant string of length 1 to String.lastIndexOf().\nIt is more efficient to use the integer implementations of String.lastIndexOf().\nf. e. callinstead of"
        },
        "ITA_INEFFICIENT_TO_ARRAY": {
            "ShortDescription": "Method uses toArray() with zero-length array argument",
            "LongDescription": "{1} uses Collection.toArray() with zero-length array argument",
            "Details": "This method uses the toArray() method of a collection derived class, and passes\nin a zero-length prototype array argument.  It is more efficient to use\nmyCollection.toArray(new Foo[myCollection.size()])\nIf the array passed in is big enough to store all of the\nelements of the collection, then it is populated and returned\ndirectly. This avoids the need to create a second array\n(by reflection) to return as the result."
        },
        "IJU_ASSERT_METHOD_INVOKED_FROM_RUN_METHOD": {
            "ShortDescription": "JUnit assertion in run method will not be noticed by JUnit",
            "LongDescription": "JUnit assertion in {1} will not be noticed by JUnit",
            "Details": "A JUnit assertion is performed in a run method. Failed JUnit assertions\njust result in exceptions being thrown.\nThus, if this exception occurs in a thread other than the thread that invokes\nthe test method, the exception will terminate the thread but not result\nin the test failing.\n"
        },
        "IJU_SETUP_NO_SUPER": {
            "ShortDescription": "TestCase defines setUp that doesn't call super.setUp()",
            "LongDescription": "TestCase {0} defines setUp that doesn't call super.setUp()",
            "Details": "Class is a JUnit TestCase and implements the setUp method. The setUp method should call\nsuper.setUp(), but doesn't."
        },
        "IJU_TEARDOWN_NO_SUPER": {
            "ShortDescription": "TestCase defines tearDown that doesn't call super.tearDown()",
            "LongDescription": "TestCase {0} defines tearDown that doesn't call super.tearDown()",
            "Details": "Class is a JUnit TestCase and implements the tearDown method. The tearDown method should call\nsuper.tearDown(), but doesn't."
        },
        "IJU_SUITE_NOT_STATIC": {
            "ShortDescription": "TestCase implements a non-static suite method",
            "LongDescription": "TestCase {0} implements a non-static suite method",
            "Details": "Class is a JUnit TestCase and implements the suite() method. The suite method should be declared as being static, but isn't."
        },
        "IJU_BAD_SUITE_METHOD": {
            "ShortDescription": "TestCase declares a bad suite method",
            "LongDescription": "Bad declaration for suite method in {0}",
            "Details": "Class is a JUnit TestCase and defines a suite() method.\nHowever, the suite method needs to be declared as eitherpublic static junit.framework.Test suite()\npublic static junit.framework.TestSuite suite()\n"
        },
        "IJU_NO_TESTS": {
            "ShortDescription": "TestCase has no tests",
            "LongDescription": "TestCase {0} has no tests",
            "Details": "Class is a JUnit TestCase but has not implemented any test methods."
        },
        "BOA_BADLY_OVERRIDDEN_ADAPTER": {
            "ShortDescription": "Class overrides a method implemented in super class Adapter wrongly",
            "LongDescription": "Class {0} overrides a method {1} implemented in super class Adapter wrongly",
            "Details": "This method overrides a method found in a parent class, where that class is an Adapter that implements\na listener defined in the java.awt.event or javax.swing.event package. As a result, this method will not\nget called when the event occurs."
        },
        "BRSA_BAD_RESULTSET_ACCESS": {
            "deprecated": "true",
            "ShortDescription": "Method attempts to access a result set field with index 0",
            "LongDescription": "{1} attempts to access a result set field with index 0",
            "Details": "A call to getXXX or updateXXX methods of a result set was made where the\nfield index is 0. As ResultSet fields start at index 1, this is always a mistake."
        },
        "SQL_BAD_RESULTSET_ACCESS": {
            "ShortDescription": "Method attempts to access a result set field with index 0",
            "LongDescription": "{1} attempts to access a result set field with index 0",
            "Details": "A call to getXXX or updateXXX methods of a result set was made where the\nfield index is 0. As ResultSet fields start at index 1, this is always a mistake."
        },
        "SQL_BAD_PREPARED_STATEMENT_ACCESS": {
            "ShortDescription": "Method attempts to access a prepared statement parameter with index 0",
            "LongDescription": "{1} attempts to access a prepared statement parameter with index 0",
            "Details": "A call to a setXXX method of a prepared statement was made where the\nparameter index is 0. As parameter indexes start at index 1, this is always a mistake."
        },
        "SIO_SUPERFLUOUS_INSTANCEOF": {
            "ShortDescription": "Unnecessary type check done using instanceof operator",
            "LongDescription": "{1} does an unnecessary type check using instanceof operator when it can be determined statically",
            "Details": "Type check performed using the instanceof operator where it can be statically determined whether the object\nis of the type requested."
        },
        "BAC_BAD_APPLET_CONSTRUCTOR": {
            "ShortDescription": "Bad Applet Constructor relies on uninitialized AppletStub",
            "LongDescription": "Bad Applet Constructor relies on uninitialized AppletStub",
            "Details": "\nThis constructor calls methods in the parent Applet that rely on the AppletStub. Since the AppletStub\nisn't initialized until the init() method of this applet is called, these methods will not perform\ncorrectly.\n"
        },
        "EC_ARRAY_AND_NONARRAY": {
            "ShortDescription": "equals() used to compare array and nonarray",
            "LongDescription": "Calling {3.simpleClass}.equals({2.simpleClass}) in {1}",
            "Details": "\nThis method invokes the .equals(Object o) to compare an array and a reference that doesn't seem\nto be an array. If things being compared are of different types, they are guaranteed to be unequal\nand the comparison is almost certainly an error. Even if they are both arrays, themethod\non arrays only determines if the two arrays are the same object.\nTo compare the contents of the arrays, usejava.util.Arrays.equals(Object[], Object[])"
        },
        "EC_BAD_ARRAY_COMPARE": {
            "ShortDescription": "Invocation of equals() on an array, which is equivalent to ==",
            "LongDescription": "Using .equals to compare two {2.simpleClass}'s, (equivalent to ==) in {1}",
            "Details": "\nThis method invokes the .equals(Object o) method on an array. Since arrays do not override the equals\nmethod of Object, calling equals on an array is the same as comparing their addresses. To compare the\ncontents of the arrays, usejava.util.Arrays.equals(Object[], Object[]).\nTo compare the addresses of the arrays, it would be\nless confusing to explicitly check pointer equality using"
        },
        "EC_INCOMPATIBLE_ARRAY_COMPARE": {
            "ShortDescription": "equals(...) used to compare incompatible arrays",
            "LongDescription": "Using equals to compare a {2.simpleClass} and a {3.simpleClass} in {1}",
            "Details": "\nThis method invokes the .equals(Object o) to compare two arrays, but the arrays\nof incompatible types (e.g., String[] and StringBuffer[], or String[] and int[]).\nThey will never be equal. In addition, when equals(...) is used to compare arrays it\nonly checks to see if they are the same array, and ignores the contents of the arrays.\n"
        },
        "STI_INTERRUPTED_ON_CURRENTTHREAD": {
            "ShortDescription": "Unneeded use of currentThread() call, to call interrupted()",
            "LongDescription": "{1} makes an unneeded call to currentThread() just to call interrupted()",
            "Details": "\nThis method invokes thecall, just to call the\nmethod. Asis a static method, it is more\nsimple and clear to use"
        },
        "STI_INTERRUPTED_ON_UNKNOWNTHREAD": {
            "ShortDescription": "Static Thread.interrupted() method invoked on thread instance",
            "LongDescription": "{1} invokes static Thread.interrupted() method on thread instance",
            "Details": "\nThis method invokes the Thread.interrupted() method on a Thread object that appears to be a Thread object that is\nnot the current thread. As the interrupted() method is static, the interrupted method will be called on a different\nobject than the one the author intended.\n"
        },
        "IP_PARAMETER_IS_DEAD_BUT_OVERWRITTEN": {
            "ShortDescription": "A parameter is dead upon entry to a method but overwritten",
            "LongDescription": "The parameter {2} to {1} is dead upon entry but overwritten",
            "Details": "\nThe initial value of this parameter is ignored, and the parameter\nis overwritten here. This often indicates a mistaken belief that\nthe write to the parameter will be conveyed back to\nthe caller.\n"
        },
        "DLS_DEAD_LOCAL_STORE_SHADOWS_FIELD": {
            "ShortDescription": "Dead store to local variable that shadows field",
            "LongDescription": "Dead store to {2} rather than field with same name in {1}",
            "Details": "\nThis instruction assigns a value to a local variable,\nbut the value is not read or used in any subsequent instruction.\nOften, this indicates an error, because the value computed is never\nused. There is a field with the same name as the local variable. Did you\nmean to assign to that variable instead?\n"
        },
        "DLS_DEAD_LOCAL_STORE": {
            "ShortDescription": "Dead store to local variable",
            "LongDescription": "Dead store to {2} in {1}",
            "Details": "\nThis instruction assigns a value to a local variable,\nbut the value is not read or used in any subsequent instruction.\nOften, this indicates an error, because the value computed is never\nused.\n\nNote that Sun's javac compiler often generates dead stores for\nfinal local variables. Because SpotBugs is a bytecode-based tool,\nthere is no easy way to eliminate these false positives.\n"
        },
        "DLS_DEAD_LOCAL_STORE_IN_RETURN": {
            "ShortDescription": "Useless assignment in return statement",
            "LongDescription": "Useless assignment in return from {1}",
            "Details": "\nThis statement assigns to a local variable in a return statement. This assignment\nhas no effect. Please verify that this statement does the right thing.\n"
        },
        "DLS_DEAD_LOCAL_INCREMENT_IN_RETURN": {
            "ShortDescription": "Useless increment in return statement",
            "LongDescription": "Useless increment in return from {1}",
            "Details": "This statement has a return such asreturn x++;/return x--;.\nA postfix increment/decrement does not impact the value of the expression,\nso this increment/decrement has no effect.\nPlease verify that this statement does the right thing.\n"
        },
        "DLS_DEAD_STORE_OF_CLASS_LITERAL": {
            "ShortDescription": "Dead store of class literal",
            "LongDescription": "Dead store of {3}.class in {1}",
            "Details": "\nThis instruction assigns a class literal to a variable and then never uses it.\n<a href=\"http://www.oracle.com/technetwork/java/javase/compatibility-137462.html#literal\">The behavior of this differs in Java 1.4 and in Java 5.\nIn Java 1.4 and earlier, a reference towould force the static initializer\nforto be executed, if it has not been executed already.\nIn Java 5 and later, it does not.\nSee Oracle's <a href=\"http://www.oracle.com/technetwork/java/javase/compatibility-137462.html#literal\">article on Java SE compatibility\nfor more details and examples, and suggestions on how to force class initialization in Java 5+.\n"
        },
        "DLS_DEAD_LOCAL_STORE_OF_NULL": {
            "ShortDescription": "Dead store of null to local variable",
            "LongDescription": "Dead store of null to {2} in {1}",
            "Details": "The code stores null into a local variable, and the stored value is not\nread. This store may have been introduced to assist the garbage collector, but\nas of Java SE 6.0, this is no longer needed or useful.\n"
        },
        "MF_METHOD_MASKS_FIELD": {
            "ShortDescription": "Method defines a variable that obscures a field",
            "LongDescription": "{1} defines a variable that obscures field {2.givenClass}",
            "Details": "This method defines a local variable with the same name as a field\nin this class or a superclass.  This may cause the method to\nread an uninitialized value from the field, leave the field uninitialized,\nor both."
        },
        "MF_CLASS_MASKS_FIELD": {
            "ShortDescription": "Class defines field that masks a superclass field",
            "LongDescription": "Field {1.givenClass} masks field in superclass {2.class}",
            "Details": "This class defines a field with the same name as a visible\ninstance field in a superclass.  This is confusing, and\nmay indicate an error if methods update or access one of\nthe fields when they wanted the other."
        },
        "WMI_WRONG_MAP_ITERATOR": {
            "ShortDescription": "Inefficient use of keySet iterator instead of entrySet iterator",
            "LongDescription": "{1} makes inefficient use of keySet iterator instead of entrySet iterator",
            "Details": "This method accesses the value of a Map entry, using a key that was retrieved from\na keySet iterator. It is more efficient to use an iterator on the entrySet of the map, to avoid the\nMap.get(key) lookup."
        },
        "ISC_INSTANTIATE_STATIC_CLASS": {
            "ShortDescription": "Needless instantiation of class that only supplies static methods",
            "LongDescription": "{1} needlessly instantiates a class that only supplies static methods",
            "Details": "This class allocates an object that is based on a class that only supplies static methods. This object\ndoes not need to be created, just access the static methods directly using the class name as a qualifier."
        },
        "REC_CATCH_EXCEPTION": {
            "ShortDescription": "Exception is caught when Exception is not thrown",
            "LongDescription": "Exception is caught when Exception is not thrown in {1}",
            "Details": "This method uses a try-catch block that catches Exception objects, but Exception is not thrown within the try block, and RuntimeException is not explicitly caught.  It is a common bug pattern to say try { ... } catch (Exception e) { something } as a shorthand for catching a number of types of exception each of whose catch blocks is identical, but this construct also accidentally catches RuntimeException as well, masking potential bugs.A better approach is to either explicitly catch the specific exceptions that are thrown, or to explicitly catch RuntimeException exception, rethrow it, and then catch all non-Runtime Exceptions, as shown below:try { ...\n} catch (RuntimeException e) { throw e;\n} catch (Exception e) { ... deal with all non-runtime exceptions ...\n}\n"
        },
        "DCN_NULLPOINTER_EXCEPTION": {
            "ShortDescription": "NullPointerException caught",
            "LongDescription": "Do not catch NullPointerException like in {1}",
            "Details": "\nAccording to SEI Cert rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR08-J.+Do+not+catch+NullPointerException+or+any+of+its+ancestors\">ERR08-JNullPointerException should not be caught. Handling NullPointerException is considered an inferior alternative to null-checking.\n\nThis non-compliant code catches a NullPointerException to see if an incoming parameter is null:\n\nboolean hasSpace(String m) { try { String ms[] = m.split(\" \"); return names.length != 1; } catch (NullPointerException e) { return false; }\n}\n\nA compliant solution would use a null-check as in the following example:\n\nboolean hasSpace(String m) { if (m == null) return false; String ms[] = m.split(\" \"); return names.length != 1;\n}\n"
        },
        "FE_TEST_IF_EQUAL_TO_NOT_A_NUMBER": {
            "ShortDescription": "Doomed test for equality to NaN",
            "LongDescription": "Doomed test for equality to NaN in {1}",
            "Details": "This code checks to see if a floating point value is equal to the special Not A Number value (e.g.,if (x == Double.NaN)). However, because of the special semantics of, no value is equal to, including. Thus,x == Double.NaNalways evaluates to false.\n To check to see if a value contained inis the special Not A Number value, use(orifis floating point precision)."
        },
        "FE_FLOATING_POINT_EQUALITY": {
            "ShortDescription": "Test for floating point equality",
            "LongDescription": "Test for floating point equality in {1}",
            "Details": "This operation compares two floating point values for equality. Because floating point calculations may involve rounding, calculated float and double values may not be accurate. For values that must be precise, such as monetary values, consider using a fixed-precision type such as BigDecimal. For values that need not be precise, consider comparing for equality within some range, for example:if ( Math.abs(x - y) &lt; .0000001 ). See the Java Language Specification, section 4.2.4."
        },
        "UM_UNNECESSARY_MATH": {
            "ShortDescription": "Method calls static Math class method on a constant value",
            "LongDescription": "Method calls static Math class method on a constant value",
            "Details": "This method uses a static method from java.lang.Math on a constant value. This method's\nresult in this case, can be determined statically, and is faster and sometimes more accurate to\njust use the constant. Methods detected are:\n0.0 or 1.00.0 or 1.00.0 or 1.00.0 or 1.00.0 or 1.00.0 or 1.00.0 or 1.00.0 or 1.00.0 or 1.0"
        },
        "CD_CIRCULAR_DEPENDENCY": {
            "ShortDescription": "Test for circular dependencies among classes",
            "LongDescription": "Class {0} has a circular dependency with other classes",
            "Details": "This class has a circular dependency with other classes. This makes building these classes difficult, as each is dependent on the other to build correctly. Consider using interfaces to break the hard dependency."
        },
        "RI_REDUNDANT_INTERFACES": {
            "ShortDescription": "Class implements same interface as superclass",
            "LongDescription": "Class {0} implements same interface as superclass",
            "Details": "This class declares that it implements an interface that is also implemented by a superclass. This is redundant because once a superclass implements an interface, all subclasses by default also implement this interface. It may point out that the inheritance hierarchy has changed since this class was created, and consideration should be given to the ownership of the interface's implementation."
        },
        "MTIA_SUSPECT_STRUTS_INSTANCE_FIELD": {
            "ShortDescription": "Class extends Struts Action class and uses instance variables",
            "LongDescription": "Class {0} extends Struts Action class and uses instance variables",
            "Details": "This class extends from a Struts Action class, and uses an instance member variable. Since only one instance of a struts Action class is created by the Struts framework, and used in a multithreaded way, this paradigm is highly discouraged and most likely problematic. Consider only using method local variables. Only instance fields that are written outside of a monitor are reported."
        },
        "MTIA_SUSPECT_SERVLET_INSTANCE_FIELD": {
            "ShortDescription": "Class extends Servlet class and uses instance variables",
            "LongDescription": "Class {0} extends Servlet class and uses instance variables",
            "Details": "This class extends from a Servlet class, and uses an instance member variable. Since only one instance of a Servlet class is created by the J2EE framework, and used in a multithreaded way, this paradigm is highly discouraged and most likely problematic. Consider only using method local variables."
        },
        "PS_PUBLIC_SEMAPHORES": {
            "ShortDescription": "Class exposes synchronization and semaphores in its public interface",
            "LongDescription": "Class {0} exposes synchronization and semaphores in its public interface",
            "Details": "This class uses synchronization along with wait(), notify() or notifyAll() on itself (the this reference). Client classes that use this class, may, in addition, use an instance of this class as a synchronizing object. Because two classes are using the same object for synchronization, Multithread correctness is suspect. You should not synchronize nor call semaphore methods on a public reference. Consider using an internal private member variable to control synchronization."
        },
        "ICAST_INTEGER_MULTIPLY_CAST_TO_LONG": {
            "ShortDescription": "Result of integer multiplication cast to long",
            "LongDescription": "Result of integer multiplication cast to long in {1}",
            "Details": "\nThis code performs integer multiply and then converts the result to a long,\nas in:long convertDaysToMilliseconds(int days) { return 1000*3600*24*days; }\n\nIf the multiplication is done using long arithmetic, you can avoid\nthe possibility that the result will overflow. For example, you\ncould fix the above code to:long convertDaysToMilliseconds(int days) { return 1000L*3600*24*days; }\nstatic final long MILLISECONDS_PER_DAY = 24L*3600*1000;\nlong convertDaysToMilliseconds(int days) { return days * MILLISECONDS_PER_DAY; }\n"
        },
        "ICAST_INT_2_LONG_AS_INSTANT": {
            "ShortDescription": "int value converted to long and used as absolute time",
            "LongDescription": "int converted to long and passed as absolute time to {2} in {1}",
            "Details": "\nThis code converts a 32-bit int value to a 64-bit long value, and then\npasses that value for a method parameter that requires an absolute time value.\nAn absolute time value is the number\nof milliseconds since the standard base time known as \"the epoch\", namely January 1, 1970, 00:00:00 GMT.\nFor example, the following method, intended to convert seconds since the epoch into a Date, is badly\nbroken:Date getDate(int seconds) { return new Date(seconds * 1000); }\nThe multiplication is done using 32-bit arithmetic, and then converted to a 64-bit value.\nWhen a 32-bit value is converted to 64-bits and used to express an absolute time\nvalue, only dates in December 1969 and January 1970 can be represented.Correct implementations for the above method are:// Fails for dates after 2037\nDate getDate(int seconds) { return new Date(seconds * 1000L); }\n\n// better, works for all dates\nDate getDate(long seconds) { return new Date(seconds * 1000); }\n"
        },
        "ICAST_INT_CAST_TO_FLOAT_PASSED_TO_ROUND": {
            "ShortDescription": "int value cast to float and then passed to Math.round",
            "LongDescription": "int value cast to float and then passed to Math.round in {1}",
            "Details": "\nThis code converts an int value to a float precision\nfloating point number and then\npassing the result to the Math.round() function, which returns the int/long closest\nto the argument. This operation should always be a no-op,\nsince converting an integer to a float should give a number with no fractional part.\nIt is likely that the operation that generated the value to be passed\nto Math.round was intended to be performed using\nfloating point arithmetic.\n"
        },
        "ICAST_INT_CAST_TO_DOUBLE_PASSED_TO_CEIL": {
            "ShortDescription": "Integral value cast to double and then passed to Math.ceil",
            "LongDescription": "Integral value cast to double and then passed to Math.ceil in {1}",
            "Details": "\nThis code converts an integral value (e.g., int or long)\nto a double precision\nfloating point number and then\npassing the result to the Math.ceil() function, which rounds a double to\nthe next higher integer value. This operation should always be a no-op,\nsince converting an integer to a double should give a number with no fractional part.\nIt is likely that the operation that generated the value to be passed\nto Math.ceil was intended to be performed using double precision\nfloating point arithmetic.\n"
        },
        "ICAST_IDIV_CAST_TO_DOUBLE": {
            "ShortDescription": "Integral division result cast to double or float",
            "LongDescription": "Integral division result cast to double or float in {1}",
            "Details": "\nThis code casts the result of an integral division (e.g., int or long division)\noperation to double or float.\nDoing division on integers truncates the result\nto the integer value closest to zero. The fact that the result\nwas cast to double suggests that this precision should have been retained.\nWhat was probably meant was to cast one or both of the operands to\ndoubleperforming the division.  Here is an example:\nint x = 2;\nint y = 5;\n// Wrong: yields result 0.0\ndouble value1 = x / y;\n\n// Right: yields result 0.4\ndouble value2 = x / (double) y;\n"
        },
        "J2EE_STORE_OF_NON_SERIALIZABLE_OBJECT_INTO_SESSION": {
            "ShortDescription": "Store of non serializable object into HttpSession",
            "LongDescription": "Store of non serializable {2} into HttpSession in {1}",
            "Details": "\nThis code seems to be storing a non-serializable object into an HttpSession.\nIf this session is passivated or migrated, an error will result.\n"
        },
        "DMI_NONSERIALIZABLE_OBJECT_WRITTEN": {
            "ShortDescription": "Non serializable object written to ObjectOutput",
            "LongDescription": "Non serializable {2} written to ObjectOutput in {1}",
            "Details": "\nThis code seems to be passing a non-serializable object to the ObjectOutput.writeObject method.\nIf the object is, indeed, non-serializable, an error will result.\n"
        },
        "VA_FORMAT_STRING_USES_NEWLINE": {
            "ShortDescription": "Format string should use %n rather than \\n",
            "LongDescription": "Format string should use %n rather than in {1}",
            "Details": "\nThis format string includes a newline character (\\n). In format strings, it is generally preferable to use %n, which will produce the platform-specific line separator.  When using text blocks introduced in Java 15, use theescape sequence:\n\t \nString value = \"\"\" first line%n\\ second line%n\\ \"\"\";"
        },
        "FS_BAD_DATE_FORMAT_FLAG_COMBO": {
            "ShortDescription": "Date-format strings may lead to unexpected behavior",
            "LongDescription": "The '{3}' date format string may lead to unexpected behavior used in {1.nameAndSignature}",
            "Details": "This format string includes a bad combination of flags which may lead to unexpected behavior. Potential bad combinations include the following:using a week year (\"Y\") with month in year (\"M\") and day in month (\"d\") without specifying week in year (\"w\"). Flag (\"y\") may be preferable here insteadusing an AM/PM hour (\"h\" or \"K\") without specifying an AM/PM marker (\"a\") or period of day marker (\"B\")using a 24-hour format hour (\"H\" or \"k\") with specifying AM/PM or period of day markersusing a milli of day (\"A\") together with hours (\"H\", \"h\", \"K\", \"k\") and/or minutes (\"m\") and/or seconds (\"s\")use of milli of day (\"A\") and nano of day (\"N\") togetheruse of fraction of second (\"S\") nano of second together (\"n\")use of AM/PM markers (\"a\") and period of day (\"B\") togetheruse of year (\"y\") and year of era (\"u\") together"
        },
        "VA_PRIMITIVE_ARRAY_PASSED_TO_OBJECT_VARARG": {
            "ShortDescription": "Primitive array passed to function expecting a variable number of object arguments",
            "LongDescription": "{2} passed to varargs method {3} in {1}",
            "Details": "\nThis code passes a primitive array to a function that takes a variable number of object arguments.\nThis creates an array of length one to hold the primitive array and passes it to the function.\n"
        },
        "BC_EQUALS_METHOD_SHOULD_WORK_FOR_ALL_OBJECTS": {
            "ShortDescription": "Equals method should not assume anything about the type of its argument",
            "LongDescription": "Equals method for {0} assumes the argument is of type {0.givenClass}",
            "Details": "\nTheequals(Object o)method shouldn't make any assumptions\nabout the type of. It should simply return\nfalse ifis not the same type as"
        },
        "BC_BAD_CAST_TO_ABSTRACT_COLLECTION": {
            "ShortDescription": "Questionable cast to abstract collection",
            "LongDescription": "Questionable cast from Collection to abstract class {3} in {1}",
            "Details": "\nThis code casts a Collection to an abstract collection\n(such as,, or).\nEnsure that you are guaranteed that the object is of the type\nyou are casting to. If all you need is to be able\nto iterate through a collection, you don't need to cast it to a Set or List.\n"
        },
        "BC_IMPOSSIBLE_CAST_PRIMITIVE_ARRAY": {
            "ShortDescription": "Impossible cast involving primitive array",
            "LongDescription": "Impossible cast involving primitive array in {1}",
            "Details": "\nThis cast will always throw a ClassCastException.\n"
        },
        "BC_IMPOSSIBLE_CAST": {
            "ShortDescription": "Impossible cast",
            "LongDescription": "Impossible cast from {2} to {3} in {1}",
            "Details": "\nThis cast will always throw a ClassCastException.\nSpotBugs tracks type information from instanceof checks,\nand also uses more precise information about the types\nof values returned from methods and loaded from fields.\nThus, it may have more precise information than just\nthe declared type of a variable, and can use this to determine\nthat a cast will always throw an exception at runtime.\n"
        },
        "BC_IMPOSSIBLE_DOWNCAST": {
            "ShortDescription": "Impossible downcast",
            "LongDescription": "Impossible downcast from {2} to {3} in {1}",
            "Details": "\nThis cast will always throw a ClassCastException.\nThe analysis believes it knows\nthe precise type of the value being cast, and the attempt to\ndowncast it to a subtype will always fail by throwing a ClassCastException.\n"
        },
        "BC_IMPOSSIBLE_DOWNCAST_OF_TOARRAY": {
            "ShortDescription": "Impossible downcast of toArray() result",
            "LongDescription": "Impossible downcast of toArray() result to {3} in {1}",
            "Details": "\nThis code is casting the result of callingon a collection\nto a type more specific than, as in:String[] getAsArray(Collection&lt;String&gt; c) { return (String[]) c.toArray();\n}\nThis will usually fail by throwing a ClassCastException. The\nof almost all collections return an. They cannot really do anything else,\nsince the Collection object has no reference to the declared generic type of the collection.\nThe correct way to do get an array of a specific type from a collection is to usec.toArray(new String[0]);orc.toArray(new String[c.size()]);(the former is <a href=\"https://shipilev.net/blog/2016/arrays-wisdom-ancients/#_historical_perspective\">slightly more efficientsince late Java 6 updates).\nThere is one common/known exception to this. The\nmethod of lists returned bywill return a covariantly\ntyped array. For example,Arrays.asArray(new String[] { \"a\" }).toArray()\nwill return aString []. SpotBugs attempts to detect and suppress\nsuch cases, but may miss some.\n"
        },
        "NP_NULL_INSTANCEOF": {
            "ShortDescription": "A known null value is checked to see if it is an instance of a type",
            "LongDescription": "A known null value is checked to see if it is an instance of {2} in {1}",
            "Details": "\nThis instanceof test will always return false, since the value being checked is guaranteed to be null.\nAlthough this is safe, make sure it isn't\nan indication of some misunderstanding or some other logic error.\n"
        },
        "BC_NULL_INSTANCEOF": {
            "deprecated": "true",
            "ShortDescription": "A known null value is checked to see if it is an instance of a type",
            "LongDescription": "A known null value is checked to see if it is an instance of {2} in {1}",
            "Details": "\nThis instanceof test will always return false, since the value being checked is guaranteed to be null.\nAlthough this is safe, make sure it isn't\nan indication of some misunderstanding or some other logic error.\n"
        },
        "BC_IMPOSSIBLE_INSTANCEOF": {
            "ShortDescription": "instanceof will always return false",
            "LongDescription": "instanceof will always return false in {1}, since a {2} cannot be a {3}",
            "Details": "\nThis instanceof test will always return false. Although this is safe, make sure it isn't\nan indication of some misunderstanding or some other logic error.\n"
        },
        "BC_VACUOUS_INSTANCEOF": {
            "ShortDescription": "instanceof will always return true",
            "LongDescription": "instanceof will always return true for all non-null values in {1}, since all {2} are instances of {3}",
            "Details": "\nThis instanceof test will always return true (unless the value being tested is null).\nAlthough this is safe, make sure it isn't\nan indication of some misunderstanding or some other logic error.\nIf you really want to test the value for being null, perhaps it would be clearer to do\nbetter to do a null test rather than an instanceof test.\n"
        },
        "BC_UNCONFIRMED_CAST": {
            "ShortDescription": "Unchecked/unconfirmed cast",
            "LongDescription": "Unchecked/unconfirmed cast from {2} to {3} in {1}",
            "Details": "\nThis cast is unchecked, and not all instances of the type cast from can be cast to\nthe type it is being cast to. Check that your program logic ensures that this\ncast will not fail.\n"
        },
        "BC_UNCONFIRMED_CAST_OF_RETURN_VALUE": {
            "ShortDescription": "Unchecked/unconfirmed cast of return value from method",
            "LongDescription": "Unchecked/unconfirmed cast from {2} to {3} of return value in {1}",
            "Details": "\nThis code performs an unchecked cast of the return value of a method.\nThe code might be calling the method in such a way that the cast is guaranteed to be\nsafe, but SpotBugs is unable to verify that the cast is safe.  Check that your program logic ensures that this\ncast will not fail.\n"
        },
        "BC_BAD_CAST_TO_CONCRETE_COLLECTION": {
            "ShortDescription": "Questionable cast to concrete collection",
            "LongDescription": "Questionable cast from {2} to {3} in {1}",
            "Details": "\nThis code casts an abstract collection (such as a Collection, List, or Set)\nto a specific concrete implementation (such as an ArrayList or HashSet).\nThis might not be correct, and it may make your code fragile, since\nit makes it harder to switch to other concrete implementations at a future\npoint. Unless you have a particular reason to do so, just use the abstract\ncollection class.\n"
        },
        "RE_POSSIBLE_UNINTENDED_PATTERN": {
            "ShortDescription": "\".\" or \"|\" used for regular expression",
            "LongDescription": "\".\" or \"|\" used for regular expression in {1}",
            "Details": "\nA String function is being invoked and \".\" or \"|\" is being passed\nto a parameter that takes a regular expression as an argument. Is this what you intended?\nFor example\ns.replaceAll(\".\", \"/\") will return a String in whichcharacter has been replaced by a '/' characters.split(\".\")returns a zero length array of String\"ab|cd\".replaceAll(\"|\", \"/\") will return \"/a/b/|/c/d/\"\"ab|cd\".split(\"|\") will return array with six (!) elements: [, a, b, |, c, d]\nConsider usings.replace(\".\", \"/\")orinstead.\n"
        },
        "RE_BAD_SYNTAX_FOR_REGULAR_EXPRESSION": {
            "ShortDescription": "Invalid syntax for regular expression",
            "LongDescription": "Invalid syntax for regular expression in {1}",
            "Details": "\nThe code here uses a regular expression that is invalid according to the syntax\nfor regular expressions. This statement will throw a PatternSyntaxException when\nexecuted.\n"
        },
        "RE_CANT_USE_FILE_SEPARATOR_AS_REGULAR_EXPRESSION": {
            "ShortDescription": "File.separator used for regular expression",
            "LongDescription": "File.separator used for regular expression in {1}",
            "Details": "\nThe code here uses\nwhere a regular expression is required. This will fail on Windows\nplatforms, where theis a backslash, which is interpreted in a\nregular expression as an escape character. Among other options, you can just use\nFile.separatorChar=='\\\\' ? \"\\\\\\\\\" : File.separatorinstead of\n"
        },
        "DLS_OVERWRITTEN_INCREMENT": {
            "ShortDescription": "Overwritten increment",
            "LongDescription": "Overwritten increment in {1}",
            "Details": "\nThe code performs an increment/decrement operation (e.g.,/) and then\nimmediately overwrites it. For example,i = i++/i = i--immediately\noverwrites the incremented/decremented value with the original value.\n"
        },
        "ICAST_QUESTIONABLE_UNSIGNED_RIGHT_SHIFT": {
            "ShortDescription": "Unsigned right shift cast to short/byte",
            "LongDescription": "Unsigned right shift cast to short/byte in {1}",
            "Details": "\nThe code performs an unsigned right shift, whose result is then\ncast to a short or byte, which discards the upper bits of the result.\nSince the upper bits are discarded, there may be no difference between\na signed and unsigned right shift (depending upon the size of the shift).\n"
        },
        "BSHIFT_WRONG_ADD_PRIORITY": {
            "ShortDescription": "Possible bad parsing of shift operation",
            "LongDescription": "Possible bad parsing of shift operation in {1}",
            "Details": "\nThe code performs an operation like (x &lt;&lt; 8 + y). Although this might be correct, probably it was meant\nto perform (x &lt;&lt; 8) + y, but shift operation has\na lower precedence, so it's actually parsed as x &lt;&lt; (8 + y).\n"
        },
        "ICAST_BAD_SHIFT_AMOUNT": {
            "ShortDescription": "32 bit int shifted by an amount not in the range -31..31",
            "LongDescription": "32 bit int shifted by {2} bits in {1}",
            "Details": "\nThe code performs shift of a 32 bit int by a constant amount outside\nthe range -31..31.\nThe effect of this is to use the lower 5 bits of the integer\nvalue to decide how much to shift by (e.g., shifting by 40 bits is the same as shifting by 8 bits,\nand shifting by 32 bits is the same as shifting by zero bits). This probably isn't what was expected,\nand it is at least confusing.\n"
        },
        "IM_MULTIPLYING_RESULT_OF_IREM": {
            "ShortDescription": "Integer multiply of result of integer remainder",
            "LongDescription": "Integer multiple of result of integer remainder in {1}",
            "Details": "\nThe code multiplies the result of an integer remaining by an integer constant.\nBe sure you don't have your operator precedence confused. For example\ni % 60 * 1000 is (i % 60) * 1000, not i % (60 * 1000).\n"
        },
        "DMI_INVOKING_HASHCODE_ON_ARRAY": {
            "ShortDescription": "Invocation of hashCode on an array",
            "LongDescription": "Invocation of hashCode on array in {1}",
            "Details": "\nThe code invokes hashCode on an array. Calling hashCode on\nan array returns the same value as System.identityHashCode, and ignores\nthe contents and length of the array. If you need a hashCode that\ndepends on the contents of an array,\nuse"
        },
        "DMI_INVOKING_TOSTRING_ON_ARRAY": {
            "ShortDescription": "Invocation of toString on an array",
            "LongDescription": "Invocation of toString on {2.givenClass} in {1}",
            "Details": "\nThe code invokes toString on an array, which will generate a fairly useless result\nsuch as [C@16f0472. Consider using Arrays.toString to convert the array into a readable\nString that gives the contents of the array. See Programming Puzzlers, chapter 3, puzzle 12.\n"
        },
        "DMI_INVOKING_TOSTRING_ON_ANONYMOUS_ARRAY": {
            "ShortDescription": "Invocation of toString on an unnamed array",
            "LongDescription": "Invocation of toString on an unnamed array in {1}",
            "Details": "\nThe code invokes toString on an (anonymous) array.  Calling toString on an array generates a fairly useless result\nsuch as [C@16f0472. Consider using Arrays.toString to convert the array into a readable\nString that gives the contents of the array. See Programming Puzzlers, chapter 3, puzzle 12.\n"
        },
        "IM_AVERAGE_COMPUTATION_COULD_OVERFLOW": {
            "ShortDescription": "Computation of average could overflow",
            "LongDescription": "Computation of average could overflow in {1}",
            "Details": "The code computes the average of two integers using either division or signed right shift,\nand then uses the result as the index of an array.\nIf the values being averaged are very large, this can overflow (resulting in the computation\nof a negative average).  Assuming that the result is intended to be nonnegative, you\ncan use an unsigned right shift instead. In other words, rather that using,\nuse(low+high) &gt;&gt;&gt; 1This bug exists in many earlier implementations of binary search and merge sort.\nMartin Buchholz <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6412541\">found and fixed it\nin the JDK libraries, and Joshua Bloch\n<a href=\"http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html\">widely\npublicized the bug pattern"
        },
        "IM_BAD_CHECK_FOR_ODD": {
            "ShortDescription": "Check for oddness that won't work for negative numbers",
            "LongDescription": "Check for oddness that won't work for negative numbers in {1}",
            "Details": "\nThe code uses x % 2 == 1 to check to see if a value is odd, but this won't work\nfor negative numbers (e.g., (-5) % 2 == -1). If this code is intending to check\nfor oddness, consider using (x &amp; 1) == 1, or x % 2 != 0.\n"
        },
        "DMI_HARDCODED_ABSOLUTE_FILENAME": {
            "ShortDescription": "Code contains a hard coded reference to an absolute pathname",
            "LongDescription": "Hard coded reference to an absolute pathname in {1}",
            "Details": "This code constructs a File object using a hard coded to an absolute pathname\n(e.g.,new File(\"/home/dannyc/workspace/j2ee/src/share/com/sun/enterprise/deployment\");"
        },
        "DMI_BAD_MONTH": {
            "ShortDescription": "Bad constant value for month",
            "LongDescription": "Bad month value of {2} passed to {3} in {1}",
            "Details": "\nThis code passes a constant month\nvalue outside the expected range of 0..11 to a method.\n"
        },
        "DMI_USELESS_SUBSTRING": {
            "ShortDescription": "Invocation of substring(0), which returns the original value",
            "LongDescription": "{1} invokes substring(0), which returns the original value",
            "Details": "\nThis code invokes substring(0) on a String, which returns the original value.\n"
        },
        "DMI_CALLING_NEXT_FROM_HASNEXT": {
            "ShortDescription": "hasNext method invokes next",
            "LongDescription": "{1} invokes {2.givenClass}",
            "Details": "\nThe hasNext() method invokes the next() method. This is almost certainly wrong,\nsince the hasNext() method is not supposed to change the state of the iterator,\nand the next method is supposed to change the state of the iterator.\n"
        },
        "SWL_SLEEP_WITH_LOCK_HELD": {
            "ShortDescription": "Method calls Thread.sleep() with a lock held",
            "LongDescription": "{1} calls Thread.sleep() with a lock held",
            "Details": "This method calls Thread.sleep() with a lock held.  This may result in very poor performance and scalability, or a deadlock, since other threads may be waiting to acquire the lock.  It is a much better idea to call wait() on the lock, which releases the lock and allows other threads to run."
        },
        "DB_DUPLICATE_BRANCHES": {
            "ShortDescription": "Method uses the same code for two branches",
            "LongDescription": "{1} uses the same code for two branches",
            "Details": "This method uses the same code to implement two branches of a conditional branch. Check to ensure that this isn't a coding mistake."
        },
        "DB_DUPLICATE_SWITCH_CLAUSES": {
            "ShortDescription": "Method uses the same code for two switch clauses",
            "LongDescription": "{1} uses the same code for two switch clauses",
            "Details": "This method uses the same code to implement two clauses of a switch statement. This could be a case of duplicate code, but it might also indicate a coding mistake."
        },
        "IMA_INEFFICIENT_MEMBER_ACCESS": {
            "ShortDescription": "Method accesses a private member variable of owning class",
            "LongDescription": "{1} accesses to a private member variable of owning class",
            "Details": "This method of an inner class reads from or writes to a private member variable of the owning class, or calls a private method of the owning class. The compiler must generate a special method to access this private member, causing this to be less efficient. Relaxing the protection of the member variable or method will allow the compiler to treat this as a normal access."
        },
        "XFB_XML_FACTORY_BYPASS": {
            "ShortDescription": "Method directly allocates a specific implementation of xml interfaces",
            "LongDescription": "{1} directly allocates a specific implementation of xml interfaces",
            "Details": "This method allocates a specific implementation of an xml interface. It is preferable to use the supplied factory classes to create these objects so that the implementation can be changed at runtime. Seefor details."
        },
        "USM_USELESS_SUBCLASS_METHOD": {
            "ShortDescription": "Method superfluously delegates to parent class method",
            "LongDescription": "{1} superfluously delegates to parent class method",
            "Details": "This derived method merely calls the same superclass method passing in the exact parameters received. This method can be removed, as it provides no additional value."
        },
        "USM_USELESS_ABSTRACT_METHOD": {
            "ShortDescription": "Abstract Method is already defined in implemented interface",
            "LongDescription": "Abstract Method {1} is already defined in implemented interface",
            "Details": "This abstract method is already defined in an interface that is implemented by this abstract class. This method can be removed, as it provides no additional value."
        },
        "CI_CONFUSED_INHERITANCE": {
            "ShortDescription": "Class is final but declares protected field",
            "LongDescription": "Class {0} is final but declares protected field {1}",
            "Details": "This class is declared to be final, but declares fields to be protected. Since the class is final, it cannot be derived from, and the use of protected is confusing. The access modifier for the field should be changed to private or public to represent the true use for the field."
        },
        "QBA_QUESTIONABLE_BOOLEAN_ASSIGNMENT": {
            "ShortDescription": "Method assigns boolean literal in boolean expression",
            "LongDescription": "{1} assigns boolean literal in boolean expression",
            "Details": "This method assigns a literal boolean value (true or false) to a boolean variable inside an if or while expression. Most probably this was supposed to be a boolean comparison using ==, not an assignment using =."
        },
        "VR_UNRESOLVABLE_REFERENCE": {
            "ShortDescription": "Class makes reference to unresolvable class or method",
            "LongDescription": "Unresolvable reference to {1} by {0}",
            "Details": "This class makes a reference to a class or method that cannot be resolved using against the libraries it is being analyzed with."
        },
        "GC_UNCHECKED_TYPE_IN_GENERIC_CALL": {
            "ShortDescription": "Unchecked type in generic call",
            "LongDescription": "Unchecked argument of type Object provided where type {3.givenClass} is expected in {1}",
            "Details": "This call to a generic collection method passes an argument while compile type Object where a specific type from the generic type parameters is expected. Thus, neither the standard Java type system nor static analysis can provide useful information on whether the object being passed as a parameter is of an appropriate type."
        },
        "GC_UNRELATED_TYPES": {
            "ShortDescription": "No relationship between generic parameter and method argument",
            "LongDescription": "{2.givenClass} is incompatible with expected argument type {3.givenClass} in {1}",
            "Details": "This call to a generic collection method contains an argument with an incompatible class from that of the collection's parameter (i.e., the type of the argument is neither a supertype nor a subtype of the corresponding generic type argument). Therefore, it is unlikely that the collection contains any objects that are equal to the method argument used here. Most likely, the wrong value is being passed to the method.In general, instances of two unrelated classes are not equal. For example, if theandclasses are not related by subtyping, then an instance ofshould not be equal to an instance of. Among other issues, doing so will likely result in an equals method that is not symmetrical. For example, if you define theclass so that acan be equal to a, your equals method isn't symmetrical since acan only be equal to a.In rare cases, people do define nonsymmetrical equals methods and still manage to make their code work. Although none of the APIs document or guarantee it, it is typically the case that if you check if acontains a, the equals method of argument (e.g., the equals method of theclass) used to perform the equality checks."
        },
        "DMI_COLLECTIONS_SHOULD_NOT_CONTAIN_THEMSELVES": {
            "ShortDescription": "Collections should not contain themselves",
            "LongDescription": "Collections should not contain themselves in call to {2.givenClass}",
            "Details": "This call to a generic collection's method would only make sense if a collection contained\nitself (e.g., ifwere true). This is unlikely to be true and would cause\nproblems if it were true (such as the computation of the hash code resulting in infinite recursion).\nIt is likely that the wrong value is being passed as a parameter."
        },
        "DMI_VACUOUS_SELF_COLLECTION_CALL": {
            "ShortDescription": "Vacuous call to collections",
            "LongDescription": "For any collection c, calling c.{2.name}(c) doesn't make sense",
            "Details": "This call doesn't make sense. For any collection, callingshould\nalways be true, andshould have no effect."
        },
        "PZ_DONT_REUSE_ENTRY_OBJECTS_IN_ITERATORS": {
            "ShortDescription": "Don't reuse entry objects in iterators",
            "LongDescription": "{0} is both an Iterator and a Map.Entry",
            "Details": "The entrySet() method is allowed to return a view of the underlying Map in which an Iterator and Map.Entry. This clever idea was used in several Map implementations, but introduces the possibility of nasty coding mistakes. If a mapreturns such an iterator for an entrySet, thenwill go badly wrong. All of the Map implementations in OpenJDK 7 have been rewritten to avoid this, you should too."
        },
        "DMI_ENTRY_SETS_MAY_REUSE_ENTRY_OBJECTS": {
            "ShortDescription": "Adding elements of an entry set may fail due to reuse of Entry objects",
            "LongDescription": "Adding elements of an entry set may fail due to reuse of {2.simpleClass}.Entry object in {1}",
            "Details": "The entrySet() method is allowed to return a view of the underlying Map in which a single Entry object is reused and returned during the iteration. As of Java 6, both IdentityHashMap and EnumMap did so. When iterating through such a Map, the Entry value is only valid until you advance to the next iteration. If, for example, you try to pass such an entrySet to an addAll method, things will go badly wrong."
        },
        "DMI_USING_REMOVEALL_TO_CLEAR_COLLECTION": {
            "ShortDescription": "Don't use removeAll to clear a collection",
            "LongDescription": "removeAll used to clear a collection in {1}",
            "Details": "If you want to remove all elements from a collection, use,\nnot. Callingto clear a collection\nis less clear, susceptible to errors from typos, less efficient and\nfor some collections, might throw a."
        },
        "STCAL_STATIC_CALENDAR_INSTANCE": {
            "ShortDescription": "Static Calendar field",
            "LongDescription": "{1} is static field of type java.util.Calendar, which isn't thread safe",
            "Details": "Even though the JavaDoc does not contain a hint about it, Calendars are inherently unsafe for multithreaded use.\nSharing a single instance across thread boundaries without proper synchronization will result in erratic behavior of the\napplication. Under 1.4 problems seem to surface less often than under Java 5 where you will probably see\nrandom ArrayIndexOutOfBoundsExceptions or IndexOutOfBoundsExceptions in sun.util.calendar.BaseCalendar.getCalendarDateFromFixedDate().You may also experience serialization problems.Using an instance field is recommended.For more information on this see <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\nand <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "STCAL_INVOKE_ON_STATIC_CALENDAR_INSTANCE": {
            "ShortDescription": "Call to static Calendar",
            "LongDescription": "Call to method of static java.util.Calendar in {1}",
            "Details": "Even though the JavaDoc does not contain a hint about it, Calendars are inherently unsafe for multithreaded use.\nThe detector has found a call to an instance of Calendar that has been obtained via a static\nfield. This looks suspicious.For more information on this see <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\nand <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "STCAL_STATIC_SIMPLE_DATE_FORMAT_INSTANCE": {
            "ShortDescription": "Static DateFormat",
            "LongDescription": "{1} is a static field of type java.text.DateFormat, which isn't thread safe",
            "Details": "As the JavaDoc states, DateFormats are inherently unsafe for multithreaded use.\nSharing a single instance across thread boundaries without proper synchronization will result in erratic behavior of the\napplication.You may also experience serialization problems.Using an instance field is recommended.For more information on this see <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\nand <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "STCAL_INVOKE_ON_STATIC_DATE_FORMAT_INSTANCE": {
            "ShortDescription": "Call to static DateFormat",
            "LongDescription": "Call to method of static java.text.DateFormat in {1}",
            "Details": "As the JavaDoc states, DateFormats are inherently unsafe for multithreaded use.\nThe detector has found a call to an instance of DateFormat that has been obtained via a static\nfield. This looks suspicious.For more information on this see <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6231579\">JDK Bug #6231579\nand <a href=\"http://bugs.java.com/bugdatabase/view_bug.do?bug_id=6178997\">JDK Bug #6178997"
        },
        "TQ_COMPARING_VALUES_WITH_INCOMPATIBLE_TYPE_QUALIFIERS": {
            "ShortDescription": "Comparing values with incompatible type qualifiers",
            "LongDescription": "Value annotated as having the type qualifier {2.simpleName} is compared for equality with a value that never has that qualifier",
            "Details": "A value specified as carrying a type qualifier annotation is compared with a value that doesn't ever carry that qualifier.\nMore precisely, a value annotated with a type qualifier specifying when=ALWAYS is compared with a value that where the same type qualifier specifies when=NEVER.\nFor example, say that @NonNegative is a nickname for the type qualifier annotation @Negative(when=When.NEVER). The following code will generate this warning because the return statement requires a @NonNegative value, but receives one that is marked as @Negative.public boolean example(@Negative Integer value1, @NonNegative Integer value2) { return value1.equals(value2);\n}\n"
        },
        "TQ_ALWAYS_VALUE_USED_WHERE_NEVER_REQUIRED": {
            "ShortDescription": "Value annotated as carrying a type qualifier used where a value that must not carry that qualifier is required",
            "LongDescription": "Value annotated as carrying type qualifier {2.simpleName} used where a value that must not carry that qualifier is required",
            "Details": "A value specified as carrying a type qualifier annotation is consumed in a location or locations requiring that the value not carry that annotation.\nMore precisely, a value annotated with a type qualifier specifying when=ALWAYS is guaranteed to reach a use or uses where the same type qualifier specifies when=NEVER.\nFor example, say that @NonNegative is a nickname for the type qualifier annotation @Negative(when=When.NEVER). The following code will generate this warning because the return statement requires a @NonNegative value, but receives one that is marked as @Negative.public @NonNegative Integer example(@Negative Integer value) { return value;\n}\n"
        },
        "TQ_UNKNOWN_VALUE_USED_WHERE_ALWAYS_STRICTLY_REQUIRED": {
            "ShortDescription": "Value without a type qualifier used where a value is required to have that qualifier",
            "LongDescription": "Value without a type qualifier is used in a place that requires a {2.simpleName} annotation",
            "Details": "A value is being used in a way that requires the value to be annotated with a type qualifier. The type qualifier is strict, so the tool rejects any values that do not have the appropriate annotation.\nTo coerce a value to have a strict annotation, define an identity function where the return value is annotated with the strict annotation. This is the only way to turn a non-annotated value into a value with a strict type qualifier annotation."
        },
        "TQ_NEVER_VALUE_USED_WHERE_ALWAYS_REQUIRED": {
            "ShortDescription": "Value annotated as never carrying a type qualifier used where value carrying that qualifier is required",
            "LongDescription": "Value annotated as never carrying type qualifier {2.simpleName} used where value carrying that qualifier is required",
            "Details": "A value specified as not carrying a type qualifier annotation is guaranteed to be consumed in a location or locations requiring that the value does carry that annotation.\nMore precisely, a value annotated with a type qualifier specifying when=NEVER is guaranteed to reach a use or uses where the same type qualifier specifies when=ALWAYS.\nTODO: example"
        },
        "TQ_MAYBE_SOURCE_VALUE_REACHES_ALWAYS_SINK": {
            "ShortDescription": "Value that might not carry a type qualifier is always used in a way requires that type qualifier",
            "LongDescription": "Value that might not carry the {2.simpleName} annotation is always used in a way that requires that type qualifier",
            "Details": "A value that is annotated as possibly not being an instance of the values denoted by the type qualifier, and the value is guaranteed to be used in a way that requires values denoted by that type qualifier."
        },
        "TQ_MAYBE_SOURCE_VALUE_REACHES_NEVER_SINK": {
            "ShortDescription": "Value that might carry a type qualifier is always used in a way prohibits it from having that type qualifier",
            "LongDescription": "Value that might carry the {2.simpleName} annotation is always used in a way that prohibits it from having that type qualifier",
            "Details": "A value that is annotated as possibly being an instance of the values denoted by the type qualifier, and the value is guaranteed to be used in a way that prohibits values denoted by that type qualifier."
        },
        "TQ_EXPLICIT_UNKNOWN_SOURCE_VALUE_REACHES_NEVER_SINK": {
            "ShortDescription": "Value required to not have type qualifier, but marked as unknown",
            "LongDescription": "Value is required never be {2.simpleName}, but is explicitly annotated as unknown with regards to {2.simpleName}",
            "Details": "A value is used in a way that requires it to be never be a value denoted by a type qualifier, but there is an explicit annotation stating that it is not known where the value is prohibited from having that type qualifier. Either the usage or the annotation is incorrect."
        },
        "TQ_EXPLICIT_UNKNOWN_SOURCE_VALUE_REACHES_ALWAYS_SINK": {
            "ShortDescription": "Value required to have type qualifier, but marked as unknown",
            "LongDescription": "Value is required to always be {2.simpleName}, but is explicitly annotated as unknown with regards to {2.simpleName}",
            "Details": "A value is used in a way that requires it to be always be a value denoted by a type qualifier, but there is an explicit annotation stating that it is not known where the value is required to have that type qualifier. Either the usage or the annotation is incorrect."
        },
        "IO_APPENDING_TO_OBJECT_OUTPUT_STREAM": {
            "ShortDescription": "Doomed attempt to append to an object output stream",
            "LongDescription": "Doomed attempt to append to an object output stream in {1}",
            "Details": "This code opens a file in append mode and then wraps the result in an object output stream like as follows:OutputStream out = new FileOutputStream(anyFile, true); new ObjectOutputStream(out);This won't allow you to append to an existing object output stream stored in a file. If you want to be able to append to an object output stream, you need to keep the object output stream open.The only situation in which opening a file in append mode and the writing an object output stream could work is if on reading the file you plan to open it in random access mode and seek to the byte offset where the append started."
        },
        "WL_USING_GETCLASS_RATHER_THAN_CLASS_LITERAL": {
            "ShortDescription": "Synchronization on getClass rather than class literal",
            "LongDescription": "Synchronization on getClass rather than class literal in {1}",
            "Details": "This instance method synchronizes on. If this class is subclassed, subclasses will synchronize on the class object for the subclass, which isn't likely what was intended. For example, consider this code from java.awt.Label:private static final String base = \"label\";\nprivate static int nameCounter = 0;\n\nString constructComponentName() { synchronized (getClass()) { return base + nameCounter++; }\n}\nSubclasses ofwon't synchronize on the same subclass, giving rise to a datarace. Instead, this code should be synchronizing onprivate static final String base = \"label\";\nprivate static int nameCounter = 0;\n\nString constructComponentName() { synchronized (Label.class) { return base + nameCounter++; }\n}\nBug pattern contributed by Jason Mehrens."
        },
        "OBL_UNSATISFIED_OBLIGATION": {
            "ShortDescription": "Method may fail to clean up stream or resource",
            "LongDescription": "{1} may fail to clean up {2}",
            "Details": "This method may fail to clean up (close, dispose of) a stream, database object, or other resource requiring an explicit cleanup operation.\nIn general, if a method opens a stream or other resource, the method should use a try/finally block to ensure that the stream or resource is cleaned up before the method returns.\nThis bug pattern is essentially the same as the OS_OPEN_STREAM and ODR_OPEN_DATABASE_RESOURCE bug patterns, but is based on a different (and hopefully better) static analysis technique. We are interested is getting feedback about the usefulness of this bug pattern. For sending feedback, check:<a href=\"https://github.com/spotbugs/spotbugs/blob/master/.github/CONTRIBUTING.md\">contributing guideline<a href=\"https://github.com/spotbugs/discuss/issues?q=\">mailinglist\nIn particular, the false-positive suppression heuristics for this bug pattern have not been extensively tuned, so reports about false positives are helpful to us.\nSee Weimer and Necula,Finding and Preventing Run-Time Error Handling Mistakes(<a href=\"https://people.eecs.berkeley.edu/~necula/Papers/rte_oopsla04.pdf\">PDF), for a description of the analysis technique."
        },
        "OBL_UNSATISFIED_OBLIGATION_EXCEPTION_EDGE": {
            "ShortDescription": "Method may fail to clean up stream or resource on checked exception",
            "LongDescription": "{1} may fail to clean up {2} on checked exception",
            "Details": "This method may fail to clean up (close, dispose of) a stream, database object, or other resource requiring an explicit cleanup operation.\nIn general, if a method opens a stream or other resource, the method should use a try/finally block to ensure that the stream or resource is cleaned up before the method returns.\nThis bug pattern is essentially the same as the OS_OPEN_STREAM and ODR_OPEN_DATABASE_RESOURCE bug patterns, but is based on a different (and hopefully better) static analysis technique. We are interested is getting feedback about the usefulness of this bug pattern. For sending feedback, check:<a href=\"https://github.com/spotbugs/spotbugs/blob/master/.github/CONTRIBUTING.md\">contributing guideline<a href=\"https://github.com/spotbugs/discuss/issues?q=\">mailinglist\nIn particular, the false-positive suppression heuristics for this bug pattern have not been extensively tuned, so reports about false positives are helpful to us.\nSee Weimer and Necula,Finding and Preventing Run-Time Error Handling Mistakes(<a href=\"https://people.eecs.berkeley.edu/~necula/Papers/rte_oopsla04.pdf\">PDF), for a description of the analysis technique."
        },
        "FB_UNEXPECTED_WARNING": {
            "ShortDescription": "Unexpected/undesired warning from SpotBugs",
            "LongDescription": "Unexpected/undesired {2} SpotBugs warning in {1}",
            "Details": "SpotBugs generated a warning that, according to aannotation, is unexpected or undesired."
        },
        "FB_MISSING_EXPECTED_WARNING": {
            "ShortDescription": "Missing expected or desired warning from SpotBugs",
            "LongDescription": "Missing expected or desired {2} SpotBugs warning in {1}",
            "Details": "SpotBugs didn't generate a warning that, according to anannotation, is expected or desired."
        },
        "RV_RETURN_VALUE_OF_PUTIFABSENT_IGNORED": {
            "ShortDescription": "Return value of putIfAbsent ignored, value passed to putIfAbsent reused",
            "LongDescription": "Return value of putIfAbsent is ignored, but {4} is reused in {1}",
            "Details": "Themethod is typically used to ensure that a single value is associated with a given key (the first value for which put if absent succeeds). If you ignore the return value and retain a reference to the value passed in, you run the risk of retaining a value that is not the one that is associated with the key in the map. If it matters which one you use and you use the one that isn't stored in the map, your program will behave incorrectly."
        },
        "LG_LOST_LOGGER_DUE_TO_WEAK_REFERENCE": {
            "ShortDescription": "Potential lost logger changes due to weak reference in OpenJDK",
            "LongDescription": "Changes to logger could be lost in {1}",
            "Details": "OpenJDK introduces a potential incompatibility. In particular, the java.util.logging.Logger behavior has changed. Instead of using strong references, it now uses weak references internally. That's a reasonable change, but unfortunately some code relies on the old behavior - when changing logger configuration, it simply drops the logger reference. That means that the garbage collector is free to reclaim that memory, which means that the logger configuration is lost. For example,\nconsider:\npublic static void initLogging() throws Exception { Logger logger = Logger.getLogger(\"edu.umd.cs\"); logger.addHandler(new FileHandler()); // call to change logger configuration logger.setUseParentHandlers(false); // another call to change logger configuration\n}\nThe logger reference is lost at the end of the method (it doesn't\nescape the method), so if you have a garbage collection cycle just\nafter the call to initLogging, the logger configuration is lost\n(because Logger only keeps weak references).public static void main(String[] args) throws Exception { initLogging(); // adds a file handler to the logger System.gc(); // logger configuration lost Logger.getLogger(\"edu.umd.cs\").info(\"Some message\"); // this isn't logged to the file as expected\n}\nUlf Ochsenfahrt and Eric Fellheimer"
        },
        "AT_OPERATION_SEQUENCE_ON_CONCURRENT_ABSTRACTION": {
            "ShortDescription": "Sequence of calls to concurrent abstraction may not be atomic",
            "LongDescription": "Sequence of calls to {2} may not be atomic in {1}",
            "Details": "This code contains a sequence of calls to a concurrent  abstraction (such as a concurrent hash map). These calls will not be executed atomically."
        },
        "AT_UNSAFE_RESOURCE_ACCESS_IN_THREAD": {
            "ShortDescription": "Operation on resource is not safe in a multithreaded context",
            "LongDescription": "Operation on resource {3} is not safe in a multithreaded context in {1}",
            "Details": "This code contains an operation on a resource that is not safe in a multithreaded context. The resource may be accessed by multiple threads concurrently without proper synchronization. This may lead to data corruption. Use synchronization or other concurrency control mechanisms to ensure that the resource is accessed safely.See the related SEI CERT rule, but the detector is not restricted to chained methods: <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/VNA04-J.+Ensure+that+calls+to+chained+methods+are+atomic\"> VNA04-J. Ensure that calls to chained methods are atomic."
        },
        "DM_DEFAULT_ENCODING": {
            "ShortDescription": "Reliance on default encoding",
            "LongDescription": "Found reliance on default encoding in {1}: {2}",
            "Details": "Found a call to a method which will perform a byte to String (or String to byte) conversion,\nand will assume that the default platform encoding is suitable. This will cause the application\nbehavior to vary between platforms. Use an alternative API and specify a charset name or Charset\nobject explicitly."
        },
        "NP_METHOD_PARAMETER_RELAXING_ANNOTATION": {
            "ShortDescription": "Method tightens nullness annotation on parameter",
            "LongDescription": "Method {1} overrides the nullness annotation relaxing the ancestor method requirements on parameter.",
            "Details": "A method should always implement the contract of a method it overrides. Thus, if a method takes a parameter that is marked as @Nullable, you shouldn't override that method in a subclass with a method where that parameter is @Nonnull. Doing so violates the contract that the method should handle a null parameter."
        },
        "NP_METHOD_PARAMETER_TIGHTENS_ANNOTATION": {
            "ShortDescription": "Method tightens nullness annotation on parameter",
            "LongDescription": "Method {1} overrides the nullness annotation of parameter {2} in an incompatible way",
            "Details": "A method should always implement the contract of a method it overrides. Thus, if a method takes a parameter that is marked as @Nullable, you shouldn't override that method in a subclass with a method where that parameter is @Nonnull. Doing so violates the contract that the method should handle a null parameter."
        },
        "NP_METHOD_RETURN_RELAXING_ANNOTATION": {
            "ShortDescription": "Method relaxes nullness annotation on return value",
            "LongDescription": "Method {1} overrides the return value nullness annotation in an incompatible way.",
            "Details": "A method should always implement the contract of a method it overrides. Thus, if a method takes is annotated as returning a @Nonnull value, you shouldn't override that method in a subclass with a method annotated as returning a @Nullable or @CheckForNull value. Doing so violates the contract that the method shouldn't return null."
        },
        "EOS_BAD_END_OF_STREAM_CHECK": {
            "ShortDescription": "Data read is converted before comparison to -1",
            "LongDescription": "The return value of {2} in method {1} is converted to {3} before comparison to {4}.",
            "Details": "The method java.io.FileInputStream.read() returns an int. If this int is converted to a byte then -1 (which indicates an EOF) and the byte 0xFF become indistinguishable, this comparing the (converted) result to -1 causes the read (probably in a loop) to end prematurely if the character 0xFF is met. Similarly, the method java.io.FileReader.read() also returns an int. If it is converted to a char then -1 becomes 0xFFFF which is Character.MAX_VALUE. Comparing the result to -1 is pointless, since characters are unsigned in Java. If the checking for EOF is the condition of a loop then this loop is infinite.See SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/FIO08-J.+Distinguish+between+characters+or+bytes+read+from+a+stream+and+-1\">FIO08-J. Distinguish between characters or bytes read from a stream and -1."
        },
        "REFLC_REFLECTION_MAY_INCREASE_ACCESSIBILITY_OF_CLASS": {
            "ShortDescription": "Public method uses reflection to create a class it gets in its parameter which could increase the accessibility of any class",
            "LongDescription": "Public method {1} uses reflection to create a class it gets in its parameter which could increase the accessibility of any class",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC05-J.+Do+not+use+reflection+to+increase+accessibility+of+classes%2C+methods%2C+or+fields\">SEI CERT SEC05-Jrule forbids the use of reflection to increase accessibility of classes, methods or fields. If a class in a package provides a public method which takes an instance of java.lang.Class as its parameter and calls its newInstance() method then it increases accessibility of classes in the same package without public constructors. An attacker code may call this method and pass such class to create an instance of it. This should be avoided by either making the method non-public or by checking for package access permission on the package. A third possibility is to use the java.beans.Beans.instantiate() method instead of java.lang.Class.newInstance() which checks whether the Class object being received has any public constructors."
        },
        "REFLF_REFLECTION_MAY_INCREASE_ACCESSIBILITY_OF_FIELD": {
            "ShortDescription": "Public method uses reflection to modify a field it gets in its parameter which could increase the accessibility of any class",
            "LongDescription": "Public method {1} uses reflection to modify a field it gets in its parameter which could increase the accessibility of any class.",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC05-J.+Do+not+use+reflection+to+increase+accessibility+of+classes%2C+methods%2C+or+fields\">SEI CERT SEC05-Jrule forbids the use of reflection to increase accessibility of classes, methods or fields. If a class in a package provides a public method which takes an instance of java.lang.reflect.Field as its parameter and calls a setter (or setAccessible()) method then it increases accessibility of fields in the same package which are private, protected or package private. An attacker code may call this method and pass such field to change it. This should be avoided by either making the method non-public or by checking for package access permission on the package."
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_CONSTRUCTOR": {
            "ShortDescription": "An overridable method is called from a constructor",
            "LongDescription": "Overridable method {2} is called from constructor {1}.",
            "Details": "Calling an overridable method during in a constructor may result in the use of uninitialized data. It may also leak the this reference of the partially constructed object. Only static, final or private methods should be invoked from a constructor.See SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET05-J.+Ensure+that+constructors+do+not+call+overridable+methods\">MET05-J. Ensure that constructors do not call overridable methods."
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_CLONE": {
            "ShortDescription": "An overridable method is called from the clone() method.",
            "LongDescription": "Overridable method {2} is called from method clone() in class {0}.",
            "Details": "Calling overridable methods from the clone() method is insecure because a subclass could override the method, affecting the behavior of clone(). It can also observe or modify the clone object in a partially initialized state. Only static, final or private methods should be invoked from the clone() method.See SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88487921\">MET06-J. Do not invoke overridable methods in clone()."
        },
        "MC_OVERRIDABLE_METHOD_CALL_IN_READ_OBJECT": {
            "ShortDescription": "An overridable method is called from the readObject method.",
            "LongDescription": "Overridable method {2} is called from readObject.",
            "Details": "The readObject() method must not call any overridable methods. Invoking overridable methods from the readObject() method can provide the overriding method with access to the object's state before it is fully initialized. This premature access is possible because, in deserialization, readObject plays the role of object constructor and therefore object initialization is not complete until readObject exits.See SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SER09-J.+Do+not+invoke+overridable+methods+from+the+readObject%28%29+method\"> SER09-J. Do not invoke overridable methods from the readObject() method."
        },
        "SING_SINGLETON_IMPLEMENTS_CLONEABLE": {
            "ShortDescription": "Class using singleton design pattern directly implements Cloneable interface.",
            "LongDescription": "Class ({0}) using singleton design pattern directly implements Cloneable interface.",
            "Details": "If a class using singleton design pattern directly implements the Cloneable interface, it is possible to create a copy of the object, thus violating the singleton pattern.Therefore, implementing the Cloneable interface should be avoided.\n For more information, see: <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_INDIRECTLY_IMPLEMENTS_CLONEABLE": {
            "ShortDescription": "Class using singleton design pattern indirectly implements Cloneable interface.",
            "LongDescription": "Class ({0}) using singleton design pattern indirectly implements Cloneable interface.",
            "Details": "If a class using singleton design pattern indirectly implements the Cloneable interface, it is possible to create a copy of the object, thus violating the singleton pattern.Therefore, implementing the Cloneable interface should be avoided. If that's not possible because of an extended super-class, the solution would be overriding the clone method to unconditionally throw CloneNotSupportedException.\n For more information, see: <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_IMPLEMENTS_CLONE_METHOD": {
            "ShortDescription": "Class using singleton design pattern implements clone() method without being an unconditional CloneNotSupportedException-thrower.",
            "LongDescription": "Class ({0}) using singleton design pattern implements clone() method without being an unconditional CloneNotSupportedException-thrower.",
            "Details": "This class is using singleton design pattern and does not implement the Cloneable interface, but implements the clone() method without being an unconditional CloneNotSupportedException-thrower.  With that, it is possible to create a copy of the object, thus violating the singleton pattern.Therefore, implementing the clone method should be avoided, otherwise the solution would be overriding the clone method to unconditionally throw CloneNotSupportedException.\n For more information, see: <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-J."
        },
        "SING_SINGLETON_HAS_NONPRIVATE_CONSTRUCTOR": {
            "ShortDescription": "Class using singleton design pattern has non-private constructor.",
            "LongDescription": "Class ({0}) using singleton design pattern has non-private constructor.",
            "Details": "This class is using singleton design pattern and has non-private constructor (please note that a default constructor might exist which is not private). Given that, it is possible to create a copy of the object, thus violating the singleton pattern.The easier solution would be making the constructor private.\n <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-Jrule"
        },
        "SING_SINGLETON_IMPLEMENTS_SERIALIZABLE": {
            "ShortDescription": "Class using singleton design pattern directly or indirectly implements Serializable interface.",
            "LongDescription": "Class ({0}) using singleton design pattern directly or indirectly implements Serializable interface.",
            "Details": "This class (using singleton design pattern) directly or indirectly implements the Serializable interface, which allows the class to be serialized.Deserialization makes multiple instantiation of a singleton class possible, and therefore should be avoided.\n <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-Jrule"
        },
        "SING_SINGLETON_GETTER_NOT_SYNCHRONIZED": {
            "ShortDescription": "Instance-getter method of class using singleton design pattern is not synchronized.",
            "LongDescription": "Instance-getter method of class using singleton design pattern ({0}) is not synchronized.",
            "Details": "Instance-getter method of class using singleton design pattern is not synchronized. When this method is invoked by two or more threads simultaneously,  multiple instantiation of a singleton class becomes possible.<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MSC07-J.+Prevent+multiple+instantiations+of+singleton+objects\">SEI CERT MSC07-Jrule"
        },
        "SSD_DO_NOT_USE_INSTANCE_LOCK_ON_SHARED_STATIC_DATA": {
            "ShortDescription": "Instance level lock was used on a shared static data",
            "LongDescription": "Static field \"{2}\" is modified by an instance level {3}.",
            "Details": "If the lock or the synchronized method is not static, that modifies the static field, that could leave the shared static data unprotected against concurrent access. This could occur in two ways, if a synchronization method uses a non-static lock object, or a synchronized method is declared as non-static. Both ways are ineffective. Best solution is to use a private static final lock object to secure the shared static data.See SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/LCK06-J.+Do+not+use+an+instance+lock+to+protect+shared+static+data\"> LCK06-J. Do not use an instance lock to protect shared static data."
        },
        "FL_FLOATS_AS_LOOP_COUNTERS": {
            "ShortDescription": "Do not use floating-point variables as loop counters",
            "LongDescription": "Using floating-point loop counters can lead to unexpected behavior.",
            "Details": "\nUsing floating-point variables should not be used as loop counters, as they are not precise, which may result in incorrect loops. A loop counter is a variable that is changed with each iteration and controls when the loop should terminate. It is decreased or increased by a fixed amount each iteration.See rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/NUM09-J.+Do+not+use+floating-point+variables+as+loop+counters\">NUM09-J"
        },
        "THROWS_METHOD_THROWS_RUNTIMEEXCEPTION": {
            "ShortDescription": "Method intentionally throws RuntimeException.",
            "LongDescription": "Method intentionally throws RuntimeException.",
            "Details": "Method intentionally throws RuntimeException.According to the <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J rule,  throwing a RuntimeException may cause errors, like the caller not being able to examine the exception and therefore cannot properly recover from it.\n Moreover, throwing a RuntimeException would force the caller to catch RuntimeException and therefore violate the  <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR08-J.+Do+not+catch+NullPointerException+or+any+of+its+ancestors\">SEI CERT ERR08-J rulePlease note that you can derive from Exception or RuntimeException and may throw a new instance of that exception."
        },
        "THROWS_METHOD_THROWS_CLAUSE_BASIC_EXCEPTION": {
            "ShortDescription": "Method lists Exception in its throws clause.",
            "LongDescription": "Method lists Exception in its throws clause.",
            "Details": "Method lists Exception in its throws clause.\n\n When declaring a method, the types of exceptions in the throws clause should be the most specific. Therefore, using Exception in the throws clause would force the caller to either use it in its own throws clause, or use it in a try-catch block (when it does not necessarily  contain any meaningful information about the thrown exception).For more information, see the <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J rule."
        },
        "THROWS_METHOD_THROWS_CLAUSE_THROWABLE": {
            "ShortDescription": "Method lists Throwable in its throws clause.",
            "LongDescription": "Method lists Throwable in its throws clause.",
            "Details": "Method lists Throwable in its throws clause.\n When declaring a method, the types of exceptions in the throws clause should be the most specific. Therefore, using Throwable in the throws clause would force the caller to either use it in its own throws clause, or use it in a try-catch block (when it does not necessarily  contain any meaningful information about the thrown exception).Furthermore, using Throwable like that is semantically a bad practice, considered that Throwables include Errors as well, but by definition they occur in unrecoverable scenarios.For more information, see the <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable\">SEI CERT ERR07-J rule."
        },
        "PERM_SUPER_NOT_CALLED_IN_GETPERMISSIONS": {
            "ShortDescription": "Custom class loader does not call its superclass's getPermissions()",
            "LongDescription": "Custom class loader {1} does not call its superclass's getPermissions()",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC07-J.+Call+the+superclass%27s+getPermissions%28%29+method+when+writing+a+custom+class+loader\">SEI CERT rule SEC07-Jrequires that custom class loaders must always call their superclass's getPermissions() method in their own getPermissions() method to initialize the object they return at the end. Omitting it means that a class defined using this custom class loader has permissions that are completely independent of those specified in the systemwide policy file. In effect, the class's permissions override them."
        },
        "USC_POTENTIAL_SECURITY_CHECK_BASED_ON_UNTRUSTED_SOURCE": {
            "ShortDescription": "Potential security check based on untrusted source.",
            "LongDescription": "Non-final method {4} was called at {5} before entering a doPrivileged block and was also called inside the block at {6} on a non-final class instance of {3} in public method {1}. If this call is a check before entering the doPrivileged() block then it may be unreliable since the method may receive an instance of a malicious descendant of the class which has this overridden to behave differently than expected.",
            "Details": "A public method of a public class may be called from outside the package which means that untrusted data may be passed to it. Calling a method before the doPrivileged to check its return value and then calling the same method inside the class is dangerous if the method or its enclosing class is not final. An attacker may pass an instance of a malicious descendant of the class instead of an instance of the expected one where this method is overridden in a way that it returns different values upon different invocations. For example, a method returning a file path may return a harmless path to check before entering the doPrivileged block and then a sensitive file upon the call inside the doPrivileged block. To avoid such scenario defensively copy the object received in the parameter, e.g. by using the copy constructor of the class used as the type of the formal parameter. This ensures that the method behaves exactly as expected.See SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/SEC02-J.+Do+not+base+security+checks+on+untrusted+sources\">SEC02-J. Do not base security checks on untrusted sources."
        },
        "ASE_ASSERTION_WITH_SIDE_EFFECT": {
            "ShortDescription": "Expression in assertion may produce a side effect",
            "LongDescription": "The expression used in assertion at {1} may produce a side effect. If assertions are disabled, the expression won't get executed and the result of the method might change.",
            "Details": "Expressions used in assertions must not produce side effects.\nSeeSEI CERT Rule EXP06for more information."
        },
        "ASE_ASSERTION_WITH_SIDE_EFFECT_METHOD": {
            "ShortDescription": "Method invoked in assertion may produce a side effect",
            "LongDescription": "The method called in assertion at {1} may produce a side effect. If assertions are disabled, the method invocation won't get executed and the result of the method might change.",
            "Details": "Expressions used in assertions must not produce side effects.\nSeeSEI CERT Rule EXP06for more information."
        },
        "PA_PUBLIC_PRIMITIVE_ATTRIBUTE": {
            "ShortDescription": "Primitive field is public",
            "LongDescription": "Primitive field {1} is public and set from inside the class, which makes it too exposed. Consider making it private to limit external accessibility.",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT rule OBJ01-Jrequires that accessibility to fields must be limited. Otherwise, the values of the fields may be manipulated from outside the class, which may be unexpected or undesired behaviour. In general, requiring that no fields are allowed to be public is overkill and unrealistic. Even the rule mentions that final fields may be public. Besides final fields, there may be other usages for public fields: some public fields may serve as \"flags\" that affect the behavior of the class. Such flag fields are expected to be read by the current instance (or the current class, in case of static fields), but written by others. If a field is both written by the methods of the current instance (or the current class, in case of static fields) and from the outside, the code is suspicious. Consider making these fields private and provide appropriate setters, if necessary. Please note that constructors, initializers and finalizers are exceptions, if only they write the field inside the class, the field is not considered as written by the class itself."
        },
        "PA_PUBLIC_ARRAY_ATTRIBUTE": {
            "ShortDescription": "Array-type field is public",
            "LongDescription": "Array-type field {1} is public, which makes it too exposed. Consider making it private to limit external accessibility.",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT rule OBJ01-Jrequires that accessibility of fields must be limited. Making an array-type field final does not prevent other classes from modifying the contents of the array. However, in general, requiring that no fields are allowed to be public is overkill and unrealistic. There may be usages for public fields: some public fields may serve as \"flags\" that affect the behavior of the class. Such flag fields are expected to be read by the current instance (or the current class, in case of static fields), but written by others. If a field is both written by the methods of the current instance (or the current class, in case of static fields) and from the outside, the code is suspicious. Consider making these fields private and provide appropriate setters, if necessary. Please note that constructors, initializers and finalizers are exceptions, if only they write the field inside the class, the field is not considered as written by the class itself."
        },
        "PA_PUBLIC_MUTABLE_OBJECT_ATTRIBUTE": {
            "ShortDescription": "Mutable object-type field is public",
            "LongDescription": "Mutable object-type field {1} is public, which makes it too exposed. Consider making it private to limit external accessibility.",
            "Details": "<a href=\"https://wiki.sei.cmu.edu/confluence/display/java/OBJ01-J.+Limit+accessibility+of+fields\">SEI CERT rule OBJ01-Jrequires that accessibility of fields must be limited. Making a mutable object-type field final does not prevent other classes from modifying the contents of the object. However, in general, requiring that no fields are allowed to be public is overkill and unrealistic. There may be usages for public fields: some public fields may serve as \"flags\" that affect the behavior of the class. Such flag fields are expected to be read by the current instance (or the current class, in case of static fields), but written by others. If a field is both written by the methods of the current instance (or the current class, in case of static fields) and from the outside, the code is suspicious. Consider making these fields private and provide appropriate setters, if necessary. Please note that constructors, initializers and finalizers are exceptions, if only they write the field inside the class, the field is not considered as written by the class itself. In case of object-type fields \"writing\" means calling methods whose name suggest modification."
        },
        "VSC_VULNERABLE_SECURITY_CHECK_METHODS": {
            "ShortDescription": "Non-Private and non-final security check methods are vulnerable",
            "LongDescription": "The method '{1}' performs security check by using '{2}' method of Security Manager Class, but is overridable. Declare the method final or private in order to resolve the issue.",
            "Details": "Methods that perform security checks should be prevented from being overridden, so they must be declared as private or final. Otherwise, these methods can be compromised when a malicious subclass overrides them and omits the checks.See SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET03-J.+Methods+that+perform+a+security+check+must+be+declared+private+or+final\">MET03-J. Methods that perform a security check must be declared private or final."
        },
        "AA_ASSERTION_OF_ARGUMENTS": {
            "ShortDescription": "Assertion is used to validate an argument of a public method",
            "LongDescription": "Assertion validates method argument at {1}. If assertions are disabled, there won't be any argument validation.",
            "Details": "Assertions must not be used to validate arguments of public methods because the validations are not performed if assertions are disabled.\nSee SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/MET01-J.+Never+use+assertions+to+validate+method+arguments\">MET01-J. Never use assertions to validate method argumentsfor more information."
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_CLASS_NAMES": {
            "ShortDescription": "Do not reuse public identifiers from JSL as class name",
            "LongDescription": "The name of the class {0} shadows the publicly available identifier from the Java Standard Library.",
            "Details": "It's a good practice to avoid reusing public identifiers from the Java Standard Library as class names. This is because the Java Standard Library is a part of the Java platform and is expected to be available in all Java environments. Doing so can lead to naming conflicts and confusion, making it harder to understand and maintain the code. It's best practice to choose unique and descriptive class names that accurately represent the purpose and functionality of your own code. To provide an example, let's say you want to create a class for handling dates in your application. Instead of using a common name like \"Date\", which conflicts with the existing java.util.Date class, you could choose a more specific and unique name like or \"AppDate\" or \"DisplayDate\".\n A few key points to keep in mind when choosing names as identifier:Use meaningful prefixes or namespaces: Prepend a project-specific prefix or namespace to your class names to make them distinct. For example, if your project is named \"MyApp\", you could use \"MyAppDate\" as your class name.Use descriptive names: Opt for descriptive class names that clearly indicate their purpose and functionality. This helps avoid shadowing existing Java Standard Library identifiers. For instance, instead of \"List\", consider using \"CustomAppList\".Follow naming conventions: Adhere to Java's naming conventions, such as using camel case (e.g., MyClass) for class names. This promotes code readability and reduces the chances of conflicts.\nSee SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. Do not reuse public identifiers from the Java Standard Library"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_FIELD_NAMES": {
            "ShortDescription": "Do not reuse public identifiers from JSL as field name",
            "LongDescription": "Name of the field {1.name} in class {0} shadows the publicly available identifier from the Java Standard Library.",
            "Details": "It is a good practice to avoid reusing public identifiers from the Java Standard Library as field names in your code. Doing so can lead to confusion and potential conflicts, making it harder to understand and maintain your codebase. Instead, it is recommended to choose unique and descriptive names for your fields that accurately represent their purpose and differentiate them from Standard Library identifiers.\n To provide an example, let's say you want to create a class for handling dates in your application. Instead of using a common name like \"Date\", which conflicts with the existing java.util.Date class, you could choose a more specific and unique name like or \"AppDate\" or \"DisplayDate\".\n For example, let's say you're creating a class to represent a car in your application. Instead of using a common name like \"Component\" as a field, which conflicts with the existing java.awt.Component class, you should opt for a more specific and distinct name, such as \"VehiclePart\" or \"CarComponent\".\n A few key points to keep in mind when choosing names as identifier:Use descriptive names: Opt for descriptive field names that clearly indicate their purpose and functionality. This helps avoid shadowing existing Java Standard Library identifiers. For instance, instead of \"list\", consider using \"myFancyList\"Follow naming conventions: Adhere to Java's naming conventions, such as using mixed case for field names. Start with a lowercase first letter and the internal words should start with capital letters (e.g., myFieldUsesMixedCase). This promotes code readability and reduces the chances of conflicts.\nSee SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. Do not reuse public identifiers from the Java Standard Library"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_METHOD_NAMES": {
            "ShortDescription": "Do not reuse public identifiers from JSL as method name",
            "LongDescription": "The name of the method {1} shadows the publicly available identifier from the Java Standard Library.",
            "Details": "\n It is a good practice to avoid reusing public identifiers from the Java Standard Library as method names in your code. Doing so can lead to confusion, potential conflicts, and unexpected behavior. To maintain code clarity and ensure proper functionality, it is recommended to choose unique and descriptive names for your methods that accurately represent their purpose and differentiate them from standard library identifiers.\n To provide an example, let's say you want to create a method that handles creation of a custom file in your application. Instead of using a common name like \"File\" for the method, which conflicts with the existing java.io.File class, you could choose a more specific and unique name like or \"generateFile\" or \"createOutPutFile\".\n A few key points to keep in mind when choosing names as identifier:Use descriptive names: Opt for descriptive method names that clearly indicate their purpose and functionality. This helps avoid shadowing existing Java Standard Library identifiers. For instance, instead of \"abs()\",  consider using \"calculateAbsoluteValue()\".Follow naming conventions: Adhere to Java's naming conventions, such as using mixed case for method names. Method names should be verbs, with the first letter lowercase and the first letter of each internal word capitalized (e.g. runFast()). This promotes code readability and reduces the chances of conflicts.\nSee SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. Do not reuse public identifiers from the Java Standard Library"
        },
        "PI_DO_NOT_REUSE_PUBLIC_IDENTIFIERS_LOCAL_VARIABLE_NAMES": {
            "ShortDescription": "Do not reuse public identifiers from JSL as method name",
            "LongDescription": "Variable name {2} in method {1} shadows the publicly available identifier from the Java Standard Library.",
            "Details": "When declaring local variables in Java, it is a good practice to refrain from reusing public identifiers from the Java Standard Library. Reusing these identifiers as local variable names can lead to confusion, hinder code comprehension, and potentially cause conflicts with existing publicly available identifier names from the Java Standard Library. To maintain code clarity and avoid such issues, it is best practice to select unique and descriptive names for your local variables.\n To provide an example, let's say you want to store a custom font value in a variable. Instead of using a common name like \"Font\" for the variable name, which conflicts with the existing java.awt.Font class, you could choose a more specific and unique name like or \"customFont\" or \"loadedFontName\".\n A few key points to keep in mind when choosing names as identifier:Use descriptive names: Opt for descriptive variable names that clearly indicate their purpose and functionality. This helps avoid shadowing existing Java Standard Library identifiers. For instance, instead of \"variable\", consider using \"myVariableName\".Follow naming conventions: Adhere to Java's naming conventions, such as using mixed case for variable names. Start with a lowercase first letter and the internal words should start with capital letters (e.g. myVariableName). This promotes code readability and reduces the chances of conflicts.\nSee SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library\">DCL01-J. Do not reuse public identifiers from the Java Standard Library"
        },
        "ENV_USE_PROPERTY_INSTEAD_OF_ENV": {
            "ShortDescription": "It is preferable to use portable Java property instead of environment variable.",
            "LongDescription": "It is preferable to use portable Java property '{3}' instead of environment variable '{2}' in method {1}.",
            "Details": "Environment variables are not portable, the variable name itself (not only the value) may be different depending on the running OS. Not only the names of the specific environment variables can differ (e.g. `USERNAME` in Windows and `USER` in Unix systems), but even the semantics differ, e.g. the case sensitivity (Windows being case-insensitive and Unix case-sensitive). Moreover, the Map of the environment variables returned byand its collection views may not obey the general contract of theandmethods. Consequently, using environment variables may have unintended side effects. Also, the visibility of environment variables is less restricted compared to Java Properties: they are visible to all descendants of the defining process, not just the immediate Java subprocess. For these reasons, even the Java API ofadvises to use Java properties () instead of environment variables () where possible.If a value can be accessed through both System.getProperty() and System.getenv(), it should be accessed using the former.Mapping of corresponding Java System properties:Environment variableSee SEI CERT rule <a href=\"https://wiki.sei.cmu.edu/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables\">ENV02-J. Do not trust the values of environment variables."
        }
    },

    "bugCodes": {
        "FS": {
            "text": "Format string problem"
        },
        "SKIPPED": {
            "text": "Analysis skipped"
        },
        "IL": {
            "text": "Infinite Loop"
        },
        "VO": {
            "text": "Use of volatile"
        },
        "UI": {
            "text": "Unsafe inheritance"
        },
        "FL": {
            "text": "Use of floating point precision"
        },
        "TEST": {
            "text": "Testing prototype and incomplete bug pattern"
        },
        "IMSE": {
            "text": "Dubious catching of IllegalMonitorStateException"
        },
        "CN": {
            "text": "Bad implementation of cloneable idiom"
        },
        "CAA": {
            "text": "Covariant array assignment"
        },
        "AT": {
            "text": "Possible atomicity violation"
        },
        "FI": {
            "text": "Incorrect use of finalizers"
        },
        "ES": {
            "text": "Checking String equality using == or !="
        },
        "ML": {
            "text": "Synchronization on updated field (Mutable Lock)"
        },
        "UG": {
            "text": "Unsynchronized get method, synchronized set method"
        },
        "IO": {
            "text": "Input/Output problem"
        },
        "IC": {
            "text": "Initialization circularity"
        },
        "SI": {
            "text": "Suspicious static initializer"
        },
        "MSF": {
            "text": "Mutable servlet field"
        },
        "IS": {
            "text": "Inconsistent synchronization"
        },
        "Eq": {
            "text": "Problems with implementation of equals()"
        },
        "Co": {
            "text": "Problems with implementation of compareTo()"
        },
        "HE": {
            "text": "Equal objects must have equal hashcodes"
        },
        "AM": {
            "text": "API misuse"
        },
        "Dm": {
            "text": "Dubious method used"
        },
        "Bx": {
            "text": "Questionable Boxing of primitive value"
        },
        "UR": {
            "text": "Uninitialized read of field in constructor"
        },
        "RR": {
            "text": "Method ignores results of InputStream.read()"
        },
        "NN": {
            "text": "Naked notify"
        },
        "UW": {
            "text": "Unconditional wait"
        },
        "SP": {
            "text": "Method spins on field"
        },
        "DC": {
            "text": "Double-check pattern"
        },
        "Wa": {
            "text": "Wait not in loop"
        },
        "No": {
            "text": "Using notify() rather than notifyAll()"
        },
        "DE": {
            "text": "Dropped or ignored exception"
        },
        "Ru": {
            "text": "Method invokes run()"
        },
        "It": {
            "text": "Incorrect definition of Iterator"
        },
        "SnVI": {
            "text": "Serializable class with no Version ID"
        },
        "Se": {
            "text": "Incorrect definition of Serializable class"
        },
        "WS": {
            "text": "Class's writeObject() method is synchronized but nothing else is"
        },
        "RS": {
            "text": "Class's readObject() method is synchronized"
        },
        "SC": {
            "text": "Constructor invokes Thread.start()"
        },
        "MS": {
            "text": "Mutable static field"
        },
        "ME": {
            "text": "Mutable enum field"
        },
        "EI": {
            "text": "Method returning array may expose internal representation"
        },
        "Nm": {
            "text": "Confusing method name"
        },
        "SS": {
            "text": "Unread field should be static"
        },
        "UuF": {
            "text": "Unused field"
        },
        "UrF": {
            "text": "Unread field"
        },
        "UwF": {
            "text": "Unwritten field"
        },
        "SIC": {
            "text": "Inner class could be made static"
        },
        "TLW": {
            "text": "Wait with two locks held"
        },
        "RANGE": {
            "text": "Range checks"
        },
        "RV": {
            "text": "Bad use of return value from method"
        },
        "LG": {
            "text": "Logger problem"
        },
        "IA": {
            "text": "Ambiguous invocation"
        },
        "HSC": {
            "text": "Huge String constants"
        },
        "HRS": {
            "text": "HTTP Response splitting vulnerability"
        },
        "PT": {
            "text": "Path traversal"
        },
        "XSS": {
            "text": "Cross site scripting vulnerability"
        },
        "NP": {
            "text": "Null pointer dereference"
        },
        "NOISE": {
            "text": "Bogus random warning"
        },
        "RpC": {
            "text": "Repeated conditional test"
        },
        "OS": {
            "text": "Stream not closed on all paths"
        },
        "PZLA": {
            "text": "Prefer zero length arrays to null to indicate no results"
        },
        "UCF": {
            "text": "Useless control flow"
        },
        "RCN": {
            "text": "Redundant comparison to null"
        },
        "UL": {
            "text": "Lock not released on all paths"
        },
        "RC": {
            "text": "Questionable use of reference equality rather than calling equals"
        },
        "EC": {
            "text": "Comparing incompatible types for equality"
        },
        "MWN": {
            "text": "Mismatched wait() or notify()"
        },
        "SA": {
            "text": "Useless self-operation"
        },
        "INT": {
            "text": "Suspicious integer expression"
        },
        "BIT": {
            "text": "Suspicious bitwise logical expression"
        },
        "LI": {
            "text": "Unsynchronized Lazy Initialization"
        },
        "JLM": {
            "text": "Synchronization on java.util.concurrent objects"
        },
        "UPM": {
            "text": "Private method is never called"
        },
        "UMAC": {
            "text": "Uncallable method of anonymous class"
        },
        "EI2": {
            "text": "Storing reference to mutable object"
        },
        "NS": {
            "text": "Suspicious use of non-short-circuit boolean operator"
        },
        "ODR": {
            "text": "Database resource not closed on all paths"
        },
        "SBSC": {
            "text": "String concatenation in loop using + operator"
        },
        "IIL": {
            "text": "Inefficient code which can be moved outside of the loop"
        },
        "IIO": {
            "text": "Inefficient use of String.indexOf(String) or String.lastIndexOf(String)"
        },
        "ITA": {
            "text": "Inefficient use of collection.toArray(new Foo[0])"
        },
        "SW": {
            "text": "Swing coding rules"
        },
        "IJU": {
            "text": "Improperly implemented JUnit TestCase"
        },
        "BOA": {
            "text": "Badly Overridden Adapter"
        },
        "SF": {
            "text": "Switch case falls through"
        },
        "SIO": {
            "text": "Superfluous instanceof"
        },
        "BAC": {
            "text": "Bad Applet Constructor"
        },
        "UOE": {
            "text": "Use Object Equals"
        },
        "STI": {
            "text": "Suspicious Thread Interrupted"
        },
        "DLS": {
            "text": "Dead local store"
        },
        "IP": {
            "text": "Ignored parameter"
        },
        "MF": {
            "text": "Masked Field"
        },
        "WMI": {
            "text": "Inefficient Map Iterator"
        },
        "ISC": {
            "text": "Instantiated Static Class"
        },
        "DCN": {
            "text": "Don't Catch NullPointer Exception"
        },
        "REC": {
            "text": "RuntimeException capture"
        },
        "FE": {
            "text": "Test for floating point equality"
        },
        "UM": {
            "text": "Unnecessary Math on constants"
        },
        "UC": {
            "text": "Useless code"
        },
        "CNT": {
            "text": "Rough value of known constant"
        },
        "CD": {
            "text": "Circular Dependencies"
        },
        "RI": {
            "text": "Redundant Interfaces"
        },
        "MTIA": {
            "text": "Multithreaded Instance Access"
        },
        "PS": {
            "text": "Public Semaphores"
        },
        "BSHIFT": {
            "text": "Bad shift"
        },
        "ICAST": {
            "text": "Casting from integer values"
        },
        "RE": {
            "text": "Regular expressions"
        },
        "SQL": {
            "text": "Potential SQL Problem"
        },
        "WL": {
            "text": "Possible locking on wrong object"
        },
        "ESync": {
            "text": "Empty Synchronized blocks"
        },
        "QF": {
            "text": "Questionable for loops"
        },
        "VA": {
            "text": "Vararg problems"
        },
        "BC": {
            "text": "Bad casts of object references"
        },
        "IM": {
            "text": "Questionable integer math"
        },
        "ST": {
            "text": "Misuse of static fields"
        },
        "JCIP": {
            "text": "Violation of net.jcip annotations"
        },
        "USELESS_STRING": {
            "text": "Useless/non-informative string generated"
        },
        "DMI": {
            "text": "Dubious method invocation"
        },
        "PZ": {
            "text": "Warning inspired by Joshua Bloch's and Neal Gafter's Programming Puzzlers"
        },
        "SWL": {
            "text": "Sleep with lock held"
        },
        "J2EE": {
            "text": "J2EE error"
        },
        "DB": {
            "text": "Duplicate Branches"
        },
        "IMA": {
            "text": "Inefficient Member Access"
        },
        "XFB": {
            "text": "XML Factory Bypass"
        },
        "USM": {
            "text": "Useless Subclass Method"
        },
        "CI": {
            "text": "Confused Inheritance"
        },
        "QBA": {
            "text": "Questionable Boolean Assignment"
        },
        "VR": {
            "text": "Version compatibility issue"
        },
        "DP": {
            "text": "Use doPrivileged"
        },
        "GC": {
            "text": "Suspicious calls to generic collection methods"
        },
        "STCAL": {
            "text": "Static use of type Calendar or DateFormat"
        },
        "TQ": {
            "text": "Inconsistent use of type qualifier annotations"
        },
        "OBL": {
            "text": "Unsatisfied obligation to clean up stream or resource"
        },
        "FB": {
            "text": "SpotBugs did not produce the expected warnings on a method"
        },
        "DL": {
            "text": "Unintended contention or possible deadlock due to locking on shared objects"
        },
        "JUA": {
            "text": "Problems in JUnit Assertions"
        },
        "EOS": {
            "text": "Bad End of Stream check"
        },
        "REFLC": {
            "text": "Reflection increasing accessibility of classes"
        },
        "REFLF": {
            "text": "Reflection increasing accessibility of fields"
        },
        "MC": {
            "text": "Dangerous call to overridable method"
        },
        "CT": {
            "text": "Constructor throws"
        },
        "SSD": {
            "text": "Do not use an instance lock to protect shared static data"
        },
        "SING": {
            "text": "Singleton problems"
        },
        "THROWS": {
            "text": "Exception throwing related problems"
        },
        "PERM": {
            "text": "Custom class loader does not call its superclass's getPermissions()"
        },
        "USC": {
            "text": "Potential security check based on untrusted source"
        },
        "ASE": {
            "text": "Assertion with side effect"
        },
        "PA": {
            "text": "Public Attribute"
        },
        "VSC": {
            "text": "Vulnerable security check performing methods"
        },
        "AA": {
            "text": "Misuse of assertions for checking arguments of public methods"
        },
        "PI": {
            "text": "Do not reuse public identifiers from Java Standard Library"
        },
        "ENV": {
            "text": "Environment variable is used instead of the corresponding Java property"
        }
    }
};
