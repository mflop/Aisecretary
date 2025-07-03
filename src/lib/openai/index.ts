import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type MessageGenerationParams = {
  clientName: string;
  industry: string;
  purpose: string;
  additionalInfo?: string;
  tone?: 'formal' | 'friendly' | 'professional';
  companyName: string;
};

export async function generateMessage({
  clientName,
  industry,
  purpose,
  additionalInfo = '',
  tone = 'professional',
  companyName,
}: MessageGenerationParams) {
  try {
    const prompt = `
    Generează un mesaj personalizat în limba română pentru un client. Mesajul trebuie să fie natural și să nu pară generat de AI.
    
    Detalii:
    - Numele clientului: ${clientName}
    - Industria: ${industry}
    - Scopul mesajului: ${purpose}
    - Informații adiționale: ${additionalInfo}
    - Tonul mesajului: ${tone}
    - Numele companiei: ${companyName}
    
    Mesajul trebuie să fie concis (maxim 200 de cuvinte), profesional și să includă detaliile specifice menționate mai sus.
    Nu include formule generice precum "Sper că vă găsesc bine" decât dacă este absolut necesar.
    Nu menționa că este un mesaj generat automat.
    Nu include placeholder-uri sau texte între paranteze.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Ești un asistent specializat în crearea de mesaje personalizate în limba română pentru companii mici din România.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      success: true,
      message: response.choices[0].message.content?.trim() || '',
    };
  } catch (error) {
    console.error('Eroare la generarea mesajului:', error);
    return {
      success: false,
      error: 'Nu am putut genera mesajul. Vă rugăm să încercați din nou.',
    };
  }
}

export async function generateMessageTemplate({
  industry,
  purpose,
  tone = 'professional',
}: Omit<MessageGenerationParams, 'clientName' | 'companyName'>) {
  try {
    const prompt = `
    Generează un șablon de mesaj în limba română pentru clienți din industria ${industry}. 
    Șablonul va fi folosit pentru: ${purpose}.
    Tonul mesajului trebuie să fie: ${tone}.
    
    Șablonul trebuie să includă variabile între paranteze pătrate pentru personalizare, de exemplu [NUME_CLIENT], [DATA], [SERVICIU], etc.
    Șablonul trebuie să fie concis (maxim 200 de cuvinte) și profesional.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Ești un asistent specializat în crearea de șabloane de mesaje în limba română pentru companii mici din România.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      success: true,
      template: response.choices[0].message.content?.trim() || '',
    };
  } catch (error) {
    console.error('Eroare la generarea șablonului:', error);
    return {
      success: false,
      error: 'Nu am putut genera șablonul. Vă rugăm să încercați din nou.',
    };
  }
}

export async function trackMessageUsage(userId: string, companyId: string): Promise<boolean> {
  try {
    // Here you would implement tracking of message usage
    // This could involve updating a count in Supabase
    
    // Example pseudocode:
    // const { error } = await supabase
    //   .from('message_usage')
    //   .insert({
    //     user_id: userId,
    //     company_id: companyId,
    //     created_at: new Date().toISOString(),
    //   });
    
    // if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Eroare la înregistrarea utilizării mesajului:', error);
    return false;
  }
}

export default openai; 