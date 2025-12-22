export interface Patient {
    id: string;
    name: string;
    age: number;
    sex: 'Male' | 'Female';
    bmi: number;
    hba1c: number;
    glucose_random: number;
    hypoglycemia: boolean;
    hyperglycemia: boolean;
    insulin_avg: number;
    sbp_mean: number;
    dbp_mean: number;
    history_htn: boolean;
    hr_mean: number;
    spo2_mean: number;
    temp_mean: number;
}

const FIRST_NAMES = [
    'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth',
    'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
    'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Margaret', 'Anthony', 'Betty', 'Mark', 'Sandra'
];
const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 1) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const generateUsers = (count: number = 25): Patient[] => {
    const users: Patient[] = [];
    for (let i = 1; i <= count; i++) {
        const isMale = Math.random() > 0.5;
        const sex = isMale ? 'Male' : 'Female';
        const bmi = getRandomFloat(18.5, 35, 1);

        // Correlate some data for realism
        const isHighRisk = bmi > 30 || Math.random() > 0.8;
        const glucoseBase = isHighRisk ? 110 : 80;
        const glucoseRandom = getRandomInt(glucoseBase, glucoseBase + 80);
        const hba1c = getRandomFloat(4.5, isHighRisk ? 9.0 : 6.5, 1);

        users.push({
            id: `PID-${1000 + i}`,
            name: `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
            age: getRandomInt(25, 85),
            sex,
            bmi,
            hba1c,
            glucose_random: glucoseRandom,
            hypoglycemia: glucoseRandom < 70,
            hyperglycemia: glucoseRandom > 180,
            insulin_avg: getRandomFloat(5, 25, 1),
            sbp_mean: getRandomInt(110, 160),
            dbp_mean: getRandomInt(70, 95),
            history_htn: isHighRisk && Math.random() > 0.4,
            hr_mean: getRandomInt(60, 100),
            spo2_mean: getRandomInt(94, 100),
            temp_mean: getRandomFloat(36.1, 37.2, 1),
        });
    }
    return users;
};

// Generate static list
export const MOCK_PATIENTS = generateUsers(25);
