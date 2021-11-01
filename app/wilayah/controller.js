const csv = require('csvtojson');
const path = require('path');

//provinsi
async function getProvinces(req, res, next){
    const db_provinces = path.resolve(__dirname, './data/provinces.csv');

    try {
        const data = await csv().fromFile(db_provinces);
        return res.json(data);
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Cannot get province, please contact administrator'
        });
    }
}

//Kabupaten
async function getRegencies(req, res, next){
    const db_regencies = path.resolve(__dirname, './data/regencies.csv');

    try {
        let { province_code } = req.query;
        const data = await csv().fromFile(db_regencies);
        if(!province_code) return res.json(data);
        return res.json(data.filter(item => item.kode_provinsi === province_code));
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Cannot get regencies, please contact administrator'
        });
    }
}

//Kecamatan
async function getDistricts(req, res, next){
    const db_districts = path.resolve(__dirname, './data/districts.csv');
    try {
        let { regency_code } = req.query;
        const data = await csv().fromFile(db_districts);
        if(!regency_code) return res.json(data);
        return res.json(data.filter(item => item.kode_kabupaten === regency_code));
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Cannot get district, please contact administrator'
        });
    }
}

//Desa
async function getVillages(req, res, next){
    const db_villages = path.resolve(__dirname, './data/villages.csv');
    try {
        let { district_code } = req.query;
        const data = await csv().fromFile(db_villages);
        if(!district_code) return res.json(data);
        return res.json(data.filter(item => item.kode_kecamatan === district_code));
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Cannot get village, please contact administrator'
        });
    }
}

module.exports = {
    getProvinces,
    getRegencies,
    getDistricts,
    getVillages
}