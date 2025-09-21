# Software System White Paper  

## 1. Introduction  

With the popularity of software development and open-source software, security and compliance have become increasingly important concerns for enterprises and developers. This system aims to provide detailed software component analysis through automated parsing of source code, binary components, and firmware, ensuring the identification and management of security risks to enhance the security of software products.  

## 2. System Overview  

This software system employs advanced parsing and analysis technologies, with key functionalities including:  

- **Software Component Analysis**: Automatically parses input source code, binary packages, and firmware to generate lists of open-source software and publicly available vulnerability information.  
- **Risk Detection**: Utilizes various detection techniques to identify risks in software, such as information leaks, weak passwords, and misconfigurations.  
- **Deep Computing and Virtual Runtime Analysis**: Through deep computing and simulated runtime environments, it uncovers undisclosed security risks in binary software, such as null pointer dereferences, stack overflows, and double frees.  

## 3. Detailed Functionality Description  

### 3.1 Software Component Analysis  

The system can automatically parse source code and binary files to extract the following information:  

- **Open Source Component List**: Identifies and lists all used open-source software components along with their license information.  
- **Public Vulnerability Information**: Based on current common vulnerability disclosure databases (such as the CVE database), provides a list of known vulnerabilities and their related information, including risk levels and remediation suggestions.  

### 3.2 Risk Detection  

Using various technical methods, the system can detect and report multiple types of potential risks:  

- **Information Leakage**: Identifies parts of the code that may leak sensitive information.  
- **Weak Passwords**: Detects weak passwords or encryption mechanisms that may be used in the application.  
- **Misconfigurations**: Analyzes software configuration files to identify security configuration issues and provide improvement suggestions.  

### 3.3 Deep Computing and Virtual Runtime  

To identify undisclosed security risks, this system employs advanced technologies for in-depth analysis:  

- **Dynamic Analysis**: Runs applications in an isolated environment to monitor their behavior and capture anomalies.  
- **Static Analysis**: Performs static checks on source code and binaries to identify potential code defects and logical errors.  
- **Vulnerability Exploration**: Utilizes techniques such as fuzz testing to discover potential security vulnerabilities.  

## 4. System Architecture  

This software system adopts a modular design, primarily consisting of the following components:  

- **Parsing Module**: Responsible for parsing source code and binary files.  
- **Analysis Module**: Conducts code component analysis and risk detection.  
- **Report Generation Module**: Produces detailed analysis reports and provides visual results.  
- **Database Module**: Stores information on known vulnerabilities and open-source components.  

## 5. Security and Compliance  

During the design and development process, the system adheres to security best practices to ensure:  

- **Data Privacy**: Strictly controls data access permissions and complies with data protection regulations such as GDPR.  
- **Compliance Review**: The system ensures the compliant use of open-source software and provides the necessary documentation support.

## 6. Supported File Formats  

This system supports extraction and analysis of the following file formats:  

- **Image Formats**:  
  
  - WebP  
  - BMP (requires PIL)  
  - PNG/APNG (requires PIL)  
  - GIF (requires PIL)  
  - ICO (MS Windows Icon)  
  - SGI Image Files (requires PIL)  
  - JPG/JPEG (requires PIL)  
  - Sun Raster Files (standard type)  

- **Audio Formats**:  
  
  - WAV  
  - AIFF/AIFF-C  
  - AU (Sun/NeXT audio)  
  - FLV (Macromedia Flash Video)  
  - MIDI  
  - Ogg  

- **Compression Formats**:  
  
  - Gzip  
  - Bzip2  
  - LZMA  
  - XZ  
  - Lzip  
  - LZ4 (requires LZ4 Python bindings)  
  - Zstd (requires zstd package)  
  - RZIP (requires rzip)  
  - LZOP  
  - 7z (requires external tools)  

- **Archive Formats**:  
  
  - ZIP (store, extract, bzip2, but LZMA requires further testing), including JAR, APK, and other ZIP-based formats (invalid central directory hanging entries)  
  - tar  
  - CPIO (various styles, little-endian)  
  - RPM (gzip, XZ, bzip2, LZMA, zstd; does not support: delta RPM)  
  - XAR (uncompressed, gzip, bzip2, XZ, LZMA)  

- **System and Firmware Formats**:  
  
  - ISO9660 (including RockRidge and zisofs)  
  - U-Boot Images  
  - Android Sparse Data Images (regular and Brotli compressed, no bsdiff/imgdiff)  
  - Android Backup Files  
  - Android Resource Files (binary XML, table types)  
  - Android Bootloader Images  

- **Document Formats**:  
  
  - PDF (simple validation, does not support object streams, incremental updates at the end of the file)  
  - XML (whole file)  
  - JSON (whole file)  
  - GNU Message Catalog  
  - iCalendar (RFC 5545, whole file)  

- **Code and File Formats**:  
  
  - Java Class Files  
  - Android Dex/Odex (does not support OAT, only carved)  
  - ELF  
  - SWF (uncompressed, zlib, LZMA)  
  - Python PKG-INFO Files (whole file)  
  - Dockerfile Files (whole file)  
  - NibArchive  

- **Special Formats**:  
  
  - Chrome PAK (versions 4 and 5, only when offsets start from 0)  
  - Git Index Files  
  - Snap Framing2 Format (requires python-snappy)  
  - SELinux File Contexts  
  - Performance Co-Pilot Metadata Files  
  - DHTB Signature Files  
  - Ubuntu and Debian Packages (requires binutils)  
  - Hardware-specific firmware, such as Reolink, Granite Devices, Huawei firmware, etc.

#### Overall Supported Features  

The supported formats are not limited to basic recognition; they also include basic checks and partial functionalities for certain file structures, such as data extraction, parsing, and validation. Appropriate support tools and libraries are provided for each file format, noting that some formats may require additional dependencies or have support limitations.  

## 7. Supported Detected File Types  

This system supports the following file types:  

#### Executable Files  

- **Windows**  
  
  - Dynamic Link Library: `.dll`  
  - Windows Executable File: `.exe`  
  - Windows Installer Package: `.msi`  

- **Linux**  
  
  - Executable File: ELF format (no specific suffix)  

#### Library Files  

- **Dynamic Link Libraries**  
  
  - Linux Shared Object Files: `.so`  

- **Static Link Files**  
  
  - Static Library Files: `.a`  
  - Object Files: `.obj`  

#### Java Files  

- Java Package: `.jar`  
- Java Bytecode File: `.class`  

#### Source Code Files  

- C/C++ Source Code Files: such as `.c`, `.cpp`, `.h`, etc.  
- Java Source Code Files: such as `.java`  
- Go Source Code Files: such as `.go`  
- Rust Source Code Files: such as `.rs`  
- Python Source Code Files: such as `.py`  
- Perl Source Code Files: such as `.pl`  

## 8. Supported Public Vulnerability Databases  

This system is based on public vulnerability databases, providing a list of known vulnerabilities and their related information, including risk levels and remediation suggestions. Currently, the system supports the following public vulnerability databases:  

Here’s an overview of the four supported vulnerability databases:  

1. **CVE (Common Vulnerabilities and Exposures)**  
   
   - CVE is an internationally recognized vulnerability database maintained by the U.S. National Security Agency (NSA) and other organizations. It assigns a unique identifier (CVE ID) to each known security vulnerability, facilitating sharing and reporting across multiple security products and services.  

2. **CNNVD (China National Vulnerability Database)**  
   
   - CNNVD is a vulnerability database maintained by the China National Internet Emergency Center (CNCERT), primarily recording and managing cybersecurity vulnerability information both domestically and internationally, providing corresponding detection and remediation suggestions.  

3. **CNVD (China National Vulnerability Database)**  
   
   - CNVD is the National Information Security Vulnerability Database of China, operated by the China National Network and Information Security Information Center (CNIS). It serves as a centralized management platform for national information security vulnerability information, providing rich vulnerability information and remediation guidance.  

4. **JVN (Japan Vulnerability Notes)**  
   
   - JVN is a vulnerability information database maintained by Japan's Cabinet Office Cybersecurity Center (NCSC), providing announcements and related information about software vulnerabilities, particularly for security software and systems in the Japanese market.  

5. **Exploit-DB**  

   - Exploit-DB is a publicly available database of exploit code that includes a large collection of exploit code and security tools. This platform provides a repository for security researchers and penetration testers to find known exploitation methods for specific vulnerabilities. Users can query specific CVE IDs through Exploit-DB to obtain related exploitation information, enhancing their understanding of the impact of vulnerabilities and their potential risks.  

By integrating the above vulnerability databases and supporting Exploit-DB, users can comprehensively access information about known vulnerabilities and their exploitation methods. This integration aids in quickly and effectively identifying security risks related to the tested software and environment during vulnerability assessment and remediation processes, enabling more accurate decision-making. In static detection and vulnerability management, combining multi-source vulnerability information will significantly enhance the system's security defense capabilities.

## 9. Vulnerability Identification Filtering Function (Context Filtering)  

The vulnerability identification filtering function (Context Filtering) provided by this system is a static detection tool designed to help users more effectively identify and filter relevant vulnerabilities based on the type of software being tested. This feature offers flexible filtering options for operating systems and source code unpacking to enhance the accuracy of vulnerability analysis.  

#### 1. Operating System Filtering  

- **Filtering Vulnerabilities for Specific Operating Systems**:  
  
  - Users can select the operating system on which their software runs (e.g., Windows, Linux, macOS, etc.), and the system will only provide vulnerability information related to the selected operating system. During analysis, vulnerabilities unrelated to other operating systems are filtered out, reducing information noise.  

- **Version Matching Support**:  
  
  - Users can also specify a particular operating system version to ensure that the vulnerability information obtained matches their actual environment, enhancing identification accuracy.  

#### 2. Source Code Unpacking Filtering  

- **Source Code Analysis Capability**:  
  
  - For software using open-source or custom code, users can perform source code unpacking. The system will conduct static analysis on the unpacked source code to identify known vulnerabilities associated with it.  

- **Dependency Library Filtering**:  
  
  - Users can filter specific dependency libraries to check for vulnerabilities related to the libraries they are using. This helps developers efficiently locate security issues that need to be addressed.  

#### 3. Static Detection Result Output  

- **Summary Report**:  
  - The system outputs the results of static detection in the form of reports, including filtered vulnerability information and corresponding risk assessments. These reports can serve as a reference for users, aiding them in formulating appropriate security measures.  

## 10. Vulnerability Database Updates  

This system provides various methods to help users maintain and update the known vulnerability database to ensure the accuracy and timeliness of information, thus effectively managing security risks.  

#### Convenient Updates  

- **Official Update Packages**:  
  - The system supports quick updates to the vulnerability database through the direct installation of official Debian (deb) update packages. Users can simply download and install the update package to automatically receive the latest vulnerability information and remediation suggestions without complex configurations or setups.  

#### Self-Managed Updates  

- **Custom Update Function**:  
  
  - This system allows users to configure and update the vulnerability database according to their needs. Users can specify the frequency of updates, sources, and specific vulnerability information to ensure coverage of all significant security threats.  

- **Flexible Update Options**:  
  
  - Users can choose to obtain the latest information from various public vulnerability databases (such as CVE, CNNVD, CNVD, JVN) and merge and integrate this information. Additionally, users can manually add specific vulnerability information to enhance the system's adaptability and responsiveness.

## 11. Supported Types of Information Leakage  

1. **URL**  
   
   - Detection Features: Checks if the URL is a malicious domain, analyzes domain reputation, and provides a security rating.  

2. **IP Address**  
   
   - Detection Features: Provides ownership information based on the IP address, checks if it is a blacklisted IP, and offers geographic location information.  

3. **Email**  
   
   - Detection Features: Checks the validity of the email address, identifies if it is a known malicious email, and conducts a risk rating.  

4. **File Path**  
   
   - Detection Features: Analyzes the security of file paths, detecting any leakage of sensitive directories or files.  

5. **CID (Identity Card Number)**  
   
   - Detection Features: Validates CID format and provides detailed information about the identity card number, including gender, date of birth, address, issuing authority, etc.  

6. **Phone Number**  
   
   - Detection Features: Provides detailed information about the phone number, including location, carrier, and status (whether it is valid or deactivated).  

7. **GPS Address (Geolocation)**  
   
   - Detection Features: Parses GPS coordinates and provides corresponding geographic location details, including street names, cities, and other relevant information.  

## 12. Common Risk Types Covered by Unknown Vulnerabilities (C/C++)  

- **copy_to_static**   
  
  - Risk Description: Copying dynamically allocated memory data to a static memory area may lead to unexpected behavior.  
  - Corresponding CWE: `CWE-457` (Use of Unsafe Static Storage)  

- **deadlock**  
  
  - Risk Description: Multiple threads waiting for each other to release resources, causing the program to halt execution.  
  - Corresponding CWE: `CWE-833` (Deadlock)  

- **double_free**  
  
  - Risk Description: Attempting to free already freed memory, which may lead to program crashes or security vulnerabilities.  
  - Corresponding CWE: `CWE-415` (Double Free)  

- **forbidden_function**  
  
  - Risk Description: Using unsafe or discouraged functions that may introduce security vulnerabilities.  
  - Corresponding CWE: `CWE-676` (Using a Deprecated Function)  

- **free_non_heap**  
  
  - Risk Description: Attempting to free non-heap memory, which may lead to undefined behavior.  
  - Corresponding CWE: `CWE-590` (Freeing Non-Heap Memory)  

- **infinite_loop**  
  
  - Risk Description: The program enters an infinite loop, leading to resource exhaustion or performance degradation.  
  - Corresponding CWE: `CWE-835` (Infinite Loop)  

- **input_analysis**  
  
  - Risk Description: Insufficient analysis of input data may lead to security vulnerabilities or program crashes.  
  - Corresponding CWE: `CWE-20` (Improper Input Validation)  

- **invalid_argument**  
  
  - Risk Description: Passing invalid arguments to functions may lead to program crashes or undefined behavior.  
  - Corresponding CWE: `CWE-687`, `CWE-688`, `CWE-689` (Invalid Argument Passing)  

- **invalid_buffer**  
  
  - Risk Description: Using invalid or incorrectly sized buffers may lead to data corruption or security vulnerabilities.  
  - Corresponding CWE: `CWE-119`, `CWE-120`, `CWE-121`, `CWE-122` (Buffer Errors)  

- **invalid_string**  
  
  - Risk Description: Using invalid strings may lead to security vulnerabilities or program crashes.  
  - Corresponding CWE: `CWE-170` (Incorrect String Comparison)  

- **null_dereference**  
  
  - Risk Description: Attempting to access a null pointer, leading to program crashes.  
  - Corresponding CWE: `CWE-476` (Null Pointer Dereference)  

- **random_access**  
  
  - Risk Description: Random access to data structures may lead to undefined behavior or data corruption.  
  - Corresponding CWE: `CWE-338` (Unsafe Random Access)  

- **return_of_stack**  
  
  - Risk Description: Stack space not correctly released upon returning from a function, which may lead to memory leaks or other issues.  
  - Corresponding CWE: `CWE-416` (Stack Return)  

- **scan_format**  
  
  - Risk Description: Improper handling of formatted strings may lead to buffer overflows or other vulnerabilities.  
  - Corresponding CWE: `CWE-134`, `CWE-135` (Format String Errors)  

- **signed_unsigned**  
  
  - Risk Description: Confusion when handling signed and unsigned data may lead to comparison errors or overflows.  
  - Corresponding CWE: `CWE-195`, `CWE-196`, `CWE-197` (Signed/Unsigned Comparison Errors)  

- **unsigned_overflow**  
  
  - Risk Description: Unsigned integer overflow may lead to data corruption or undefined behavior.  
  - Corresponding CWE: `CWE-190` (Unsigned Integer Overflow)  

- **toc_tou**  
  
  - Risk Description: Time-of-check to time-of-use vulnerabilities may lead to improper access or modifications.  
  - Corresponding CWE: `CWE-367` (Time and Race Condition Vulnerabilities)  

- **unchecked_return_value**  
  
  - Risk Description: Not checking function return values may lead to security vulnerabilities or program errors.  
  - Corresponding CWE: `CWE-252`, `CWE-253` (Unchecked Return Value)  

- **use_after_free**  
  
  - Risk Description: Attempting to use memory after it has been freed may lead to security vulnerabilities.  
  - Corresponding CWE: `CWE-416` (Use After Free)  

- **wrong_size_memset**  
  
  - Risk Description: Using the wrong size for memory setting may lead to data overflow or program crashes.  
  - Corresponding CWE: `CWE-131` (Incorrect Memory Setting Size)

## 13. User Customization Features  

- **Custom Detection Rules**:  
  
  - **Data Leakage Detection**:  
    - Users can create specific rules to detect sensitive information leaks (such as personally identifiable information, financial data, passwords, etc.).  
    - Allows users to specify keywords, data patterns, or specific paths to trigger alerts upon the discovery of anomalies.  
  
  - **Malware Detection**:  
    - Users can customize malware detection rules, including setting suspicious file types, signature features, or abnormal behavior patterns.  
    - Provides options for users to determine the monitoring scope, such as the entire system or specific directories.  
  
  - **Misconfiguration Detection**:  
    - Users can define specific configuration baselines to ensure systems and applications comply with best security practices.  
    - Allows users to specify insecure configuration options (such as default passwords, open ports, etc.) and detect them.  

- **Password Weakness Detection**:  
  - Users can enable weak password detection features to identify passwords that do not meet security standards.  
  - Users can upload custom password cracking libraries containing common weak passwords, and the system will compare these libraries.  
  - Users can set password generation rules, including password length and character types (such as uppercase letters, lowercase letters, numbers, special characters), ensuring that the generated passwords meet security requirements.  

- **Flexibility and Adaptability**:  
  - Users can flexibly adjust detection rules according to industry requirements, compliance standards, or specific business needs, improving detection accuracy and effectiveness.  
  - Provides an intuitive user interface that allows users to quickly add, modify, or delete detection rules.  

- **Rule Priority and Response Mechanism**:  
  - Users can set priorities for each rule to reasonably arrange the response order when multiple threats are detected.  
  - Allows users to configure automated response actions, such as blocking certain behaviors, triggering alarm notifications, or generating reports.  

- **User-Friendly Management and Monitoring**:  
  - Provides an easily operable management platform, allowing users to monitor the operational status and effectiveness of detection rules in real-time.  
  - Allows users to view the history of rules and execution logs for audit and analysis purposes.

## 14. Feature Library and Toolchain  

- **User-Friendly Feature Library Management**:  
  
  - Provides a user-friendly interface for users to manage the feature library, including viewing existing components, adding new components, and deleting components that are no longer needed.  
  - Supports classification and tagging management of components in the feature library for quick searching and usage.  

- **Toolchain Support**:  
  
  - Offers a complete toolchain to help users automate the crawling of required open-source components, easily acquiring and integrating feature information from multiple sources.  
  - Users can quickly configure the toolchain to start crawling open-source projects and components in specific domains.  

- **Component Addition and Customization**:  
  
  - Allows users to add new open-source components using the toolchain, supporting quick introduction by inputting component names and version information.  
  - Provides flexible interfaces for users to expand the feature library according to their needs, supporting the import of component information from various data sources.  

- **Feature Library Generation**:  
  
  - Supports generating feature libraries based on user-uploaded binary files, efficiently extracting useful feature information.  
  - Also supports generating feature libraries from source code; users can upload code files, and the system will analyze the code and extract corresponding features.  

- **Quick Language Support Expansion**:  
  
  - Provides simple steps for users to quickly add support for new programming languages, expanding the functionality of the feature library.  
  - By configuring language parsers and feature extraction rules, users can easily support security detection for new languages.  

- **Feature Library Updates and Maintenance**:  
  
  - Users can regularly update the feature library to ensure the timely introduction of the latest open-source components and vulnerability information.  
  - Provides an automatic update feature, allowing users to choose to check periodically and automatically sync the latest feature library data.  

## 15. Containerization Deployment Requirements  

This system supports containerized deployment, suitable for various Linux systems that provide a Docker Compose environment. Users on Windows can opt to first deploy a Linux virtual machine to meet containerization requirements. Below are the specific deployment requirements and recommendations:  

#### 1. Supported Operating Systems  

- **Linux Systems**:  
  - Supports all major Linux distributions such as Ubuntu, CentOS, Debian, etc., provided they can run Docker and Docker Compose.  
- **Windows Systems**:  
  - Windows users are advised to deploy a Linux system through a virtual machine (such as VMware, VirtualBox, etc.) to ensure they can use a Docker environment.  

#### 2. Deployment Methods  

- **Standalone Deployment**:  
  - Suitable for small-scale testing and development, can run Docker Compose on a single machine.  
- **Cluster Deployment**:  
  - Supports distributed deployment across multiple machines to enhance system availability and scalability.  

#### 3. System Resource Requirements  

- **Recommended Configuration for Commercial Deployment**:  
  - **Memory**: Above 64GB  
  - **CPU**: 8 cores or more  
  - **Storage**: 1TB solid-state drive or higher  
- **Minimum Configuration for Testing Deployment**:  
  - **Memory**: 16GB  
  - **CPU**: At least 4 cores recommended  
  - **Storage**: Sufficient space to accommodate containers and data  

### Other Considerations  

- When performing containerized deployment, ensure that the latest versions of Docker and Docker Compose are installed for optimal performance and feature support.  
- Consider using Docker Volume and network configurations to ensure data persistence and efficient communication between containers.  

By following the above requirements and recommendations, users can choose the appropriate deployment method and environment to meet their specific business needs.  

## 16. Conclusion  

The goal of this software system is to enhance software security and compliance by providing effective risk identification and management solutions through comprehensive analysis and detection technologies. We believe that with this system, development teams will be better equipped to maintain software security, helping enterprises achieve higher security standards in their digital transformation processes.  

## 17. Contact Us  

For more information about the features or usage of this system, please contact us through the following methods:  

- **Email**:  
  - <EMAIL>support@chime-lab.cn  
  - <EMAIL>sales@chime-lab.cn