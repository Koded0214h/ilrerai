function Error({ statusCode }: { statusCode: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          {statusCode ? `Server Error ${statusCode}` : 'Client Error'}
        </h1>
        <p className="text-gray-600">Something went wrong.</p>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;