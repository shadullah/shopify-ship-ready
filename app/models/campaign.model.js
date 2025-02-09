import { db } from "../config/db.js";

export async function getCampaigns() {
    const campaigns = await db.campaigns.findMany();
    return campaigns;
}

export async function createCampaign(data) {
    const campaign = await db.campaigns.create({ data });
    return campaign;
}