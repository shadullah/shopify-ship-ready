import { Page, Card, Button, Layout, BlockStack, Text, ColorPicker, TextField, DropZone, Thumbnail, Banner, Select, Box, InlineStack } from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState, useCallback } from "react";

export default function ContentForm() {
    const { emailTemplates, campaigns, templateTiers } = useLoaderData();
    const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates?.[0]?.id || '');
    const [selectedCampaign, setSelectedCampaign] = useState(campaigns?.[0]?.id || '');
    const navigate = useNavigate();
    
    const [logo, setLogo] = useState(null);
    const [font, setFont] = useState('Helvetica Neue');
    const [color, setColor] = useState({
        text: '#000000',
        buttons: '#000000',
        buttonLabels: '#FFFFFF',
        background1: '#FFFFFF',
        background2: '#000000',
        border: '#FAFAFA'
    });

    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => {
            setLogo(acceptedFiles[0]);
        },
        []
    );

    const fontOptions = [
        {label: 'Helvetica Neue', value: 'Helvetica Neue'},
        {label: 'Arial', value: 'Arial'},
        {label: 'Times New Roman', value: 'Times New Roman'}
    ];

    return (
        <Page title="Set up template branding">
            <Layout>
                <Layout.Section>
                    <BlockStack gap="500">
                        <Card>
                            <BlockStack gap="400">
                                <Text variant="headingMd">Logo</Text>
                                <DropZone onDrop={handleDropZoneDrop} allowMultiple={false}>
                                    {logo ? (
                                        <Thumbnail
                                            source={window.URL.createObjectURL(logo)}
                                            alt={logo.name}
                                        />
                                    ) : (
                                        <DropZone.FileUpload />
                                    )}
                                </DropZone>
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="400">
                                <Text variant="headingMd">Store name</Text>
                                <TextField
                                    label="Appears in email headers without a logo added"
                                    value="Loop's Store Development"
                                    disabled
                                />
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="400">
                                <Text variant="headingMd">Typography</Text>
                                <Select
                                    label="Web safe font"
                                    options={fontOptions}
                                    onChange={setFont}
                                    value={font}
                                />
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="400">
                                <Text variant="headingMd">Colors</Text>
                                <BlockStack gap="400">
                                    <BlockStack gap="200" align="space-between">
                                        <Text>Text</Text>
                                        <ColorPicker onChange={(color) => setColor(prev => ({...prev, text: color}))} color={color.text} />
                                    </BlockStack>
                                    <BlockStack gap="200" align="space-between">
                                        <Text>Buttons and links</Text>
                                        <ColorPicker onChange={(color) => setColor(prev => ({...prev, buttons: color}))} color={color.buttons} />
                                    </BlockStack>
                                    <BlockStack gap="200" align="space-between">
                                        <Text>Button labels and outlines</Text>
                                        <ColorPicker onChange={(color) => setColor(prev => ({...prev, buttonLabels: color}))} color={color.buttonLabels} />
                                    </BlockStack>
                                </BlockStack>
                            </BlockStack>
                        </Card>

                        <Card>
                            <BlockStack gap="400">
                                <Text variant="headingMd">Background</Text>
                                <BlockStack gap="400">
                                    <BlockStack gap="200" align="space-between">
                                        <Text>Background 1</Text>
                                        <ColorPicker onChange={(color) => setColor(prev => ({...prev, background1: color}))} color={color.background1} />
                                    </BlockStack>
                                    <BlockStack gap="200" align="space-between">
                                        <Text>Background 2</Text>
                                        <ColorPicker onChange={(color) => setColor(prev => ({...prev, background2: color}))} color={color.background2} />
                                    </BlockStack>
                                    <BlockStack gap="200" align="space-between">
                                        <Text>Border</Text>
                                        <ColorPicker onChange={(color) => setColor(prev => ({...prev, border: color}))} color={color.border} />
                                    </BlockStack>
                                </BlockStack>
                            </BlockStack>
                        </Card>

                        <InlineStack align="space-between">
                            <Select
                                label="Email Template"
                                options={emailTemplates.map(template => ({
                                    label: template.name,
                                    value: template.id
                                }))}
                                onChange={setSelectedTemplate}
                                value={selectedTemplate}
                            />
                            <Select
                                label="Campaign"
                                options={campaigns.map(campaign => ({
                                    label: campaign.name,
                                    value: campaign.id
                                }))}
                                onChange={setSelectedCampaign}
                                value={selectedCampaign}
                            />
                        </InlineStack>
                        <Box paddingBlockStart="400">
                            <Button primary onClick={() => navigate("/app/email-marketing/new")}>
                                Next
                            </Button>
                        </Box>
                    </BlockStack>
                </Layout.Section>

                <Layout.Section secondary>
                    <Card>
                        <BlockStack gap="400">
                            <Text variant="headingMd">Example email</Text>
                            <Banner status="info">
                                <Text>Preview of how your emails will look</Text>
                            </Banner>
                            <div style={{backgroundColor: color.background2, padding: '20px'}}>
                                <div style={{backgroundColor: color.background1, padding: '20px', fontFamily: font, borderRadius: '8px', border: `1px solid ${color.border}`}}>
                                    {logo && (
                                        <div style={{marginBottom: '20px'}}>
                                            <img src={window.URL.createObjectURL(logo)} alt="Store logo" style={{maxWidth: '200px'}} />
                                        </div>
                                    )}
                                    <BlockStack gap="400">
                                        <Text as="h2" variant="headingLg" style={{color: color.text, margin: '0'}}>Meet our best sellers this month</Text>
                                        <Text style={{color: color.text}}>We're excited to share a few of our top picks for the season.</Text>
                                        <div style={{marginTop: '20px'}}>
                                            <Button
                                                primary
                                                style={{
                                                    backgroundColor: color.buttons,
                                                    color: color.buttonLabels,
                                                    border: `1px solid ${color.buttons}`,
                                                    borderRadius: '4px',
                                                    padding: '8px 16px'
                                                }}
                                            >
                                                See what's in store
                                            </Button>
                                        </div>
                                    </BlockStack>
                                </div>
                            </div>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}