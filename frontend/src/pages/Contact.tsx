export default function Contact(): JSX.Element {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Contact</h1>
        <p className="page-description">
          Get in touch with government ministries and services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Platform Support</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-700">
              This is an independent civic transparency platform. For technical support or questions about the platform,
              please note that we are not an official government system.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Government Ministries</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-700">
              For official government business, complaints, or service requests, please contact the relevant ministry directly
              using the information available in our Administration section or through their official websites.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Data Sources</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-700">
              All data presented on this platform is sourced from official government websites and public records.
              For the most current information, always refer to the original source.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Feedback</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-700">
              We welcome feedback on the platform itself. Use our complaint system to report technical issues or
              suggest improvements to the transparency portal.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}