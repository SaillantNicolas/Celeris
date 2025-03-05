let reports = [];

export const createReport = (reportData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReport = {
        id: Date.now().toString(),
        ...reportData,
        createdAt: new Date().toISOString()
      };
      
      reports.push(newReport);
      resolve({ success: true, report: newReport });
    }, 1000);
  });
};

export const getReports = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, reports });
    }, 500);
  });
};

export const getReportById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const report = reports.find(r => r.id === id);
      
      if (report) {
        resolve({ success: true, report });
      } else {
        reject({ success: false, message: 'Rapport non trouvé' });
      }
    }, 500);
  });
};