import React from 'react';

const Privacy = () => {
  return (
    <div>
      <div className=" w-11/12 flex flex-col items-center mx-auto">
      <h1 className="mb-8 mt-8 sm:mb-10 text-5xl font-medium text-black-5">Privacy Policy</h1>
      <div>
        <p>Last Updated: 4th September 2024</p>
        <p>Thank you for using our LeetCode Tracker Application. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.</p>
        <p><strong>1. Information We Collect</strong></p>
        <p>We collect the following information:</p>
        <ul><li><strong>Personal Information:</strong> When you log in using Google OAuth, we collect your following Google account information: Name, Email Address, Google Spreadsheet Tokens {"("}encrypted using AES-256{")"}</li>
        <li><strong>Usage Data:</strong> We may collect information about how you use the service, including the problems you solve, the code you submit, and your learning notes. This data is stored to help you track your progress and improve your learning experience. It is only stored when you click on "Submit" in the submission popup in the chrome extension on the problem you are solving. <strong>Additionally, you have to option to disable this by setting Store to Database option to False in Settings. Doing so will remove the features: Random Question Generator, Previous Learning Popups from the app until you turn it back on. When it is set to false, none of your data is logged and only updated in your private Google Spreadsheet.</strong></li>
        <li><strong>Cookies and Similar Technologies:</strong> We use cookies to manage your session and ensure the proper functioning of the Extension.</li></ul>
        <p><strong>2. How We Use Your Information</strong></p>
        <p>The information we collect is used to:</p>
        <ul><li>Provide, operate, and maintain the Extension and associated web service.</li>
        <li>Improve, personalize, and expand our services.
        </li>
        <li>Track your progress and manage your learning data.</li></ul>
        <p><strong>3. Data Sharing and Disclosure</strong></p>
        <p><strong>We do not sell, trade, or otherwise transfer your personal information to third parties.</strong></p>
        <p><strong>4. Data Security</strong></p>
        <p>We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is 100% secure. We use AES-256 encryption and hashing to secure private information like Google Spreadsheet API tokens.</p>
        <p><strong>5. Your Rights</strong></p><p>You have the right to:</p>
                <ul><li> Access the personal data we hold about you.</li>
                <li>Request correction or deletion of your personal data.</li>
                <li>Withdraw your consent at any time, where consent is the basis for processing your data.
                </li></ul>
        <p><strong>6. Changes to This Privacy Policy</strong></p>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
        <p><strong>7. Contact Us</strong></p>
                <p>If you have any questions or concerns about this Privacy Policy, please contact us at [mukulsinghmalik@gmail.com].</p>

        <hr/>
      </div>
    </div>
    </div>
  )
}

export default Privacy