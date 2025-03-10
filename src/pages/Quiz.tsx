
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Copy, Home, RefreshCw, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { fetchPKData } from '@/services/learnpoolApi';
import { PKData } from '@/types/pkData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Available categories
const CATEGORIES = [
  'Crypto', 'Web3', 'Science', 'History', 'Geography', 
  'Anime', 'Art', 'Personality', 'Weird', 'Travel',
  'Ideas', 'Movie', 'Business', 'Pop Culture', 'AI', 
  'Books', 'Confessions'
];

// Type for generated fact
interface GeneratedFact {
  id: string;
  text: string;
  categories: string[];
  timestamp: number;
  rating: number | null;
  hintRevealed?: boolean;
  hint?: string;
  expanded?: boolean;
  expandedText?: string;
}

const Quiz = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [generatedFact, setGeneratedFact] = useState<GeneratedFact | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [pkStars, setPkStars] = useLocalStorage<number>('pkStars', 10); // Starting with 10 stars
  
  // Local storage for generated facts history and cooldown data
  const [generatedFacts, setGeneratedFacts] = useLocalStorage<GeneratedFact[]>('generatedFacts', []);
  const [lastGeneratedTime, setLastGeneratedTime] = useLocalStorage<number | null>('lastGeneratedTime', null);
  
  const COOLDOWN_PERIOD = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  const HINT_COST = 3; // Cost in PK stars to get a hint
  
  // Check cooldown status on load
  useEffect(() => {
    if (lastGeneratedTime) {
      const now = Date.now();
      const timeElapsed = now - lastGeneratedTime;
      
      if (timeElapsed < COOLDOWN_PERIOD) {
        setIsOnCooldown(true);
        setCooldownEndTime(lastGeneratedTime + COOLDOWN_PERIOD);
      }
    }
  }, [lastGeneratedTime]);
  
  // Update countdown timer
  useEffect(() => {
    if (!cooldownEndTime) return;
    
    const updateCooldown = () => {
      const now = Date.now();
      const remaining = cooldownEndTime - now;
      
      if (remaining <= 0) {
        setIsOnCooldown(false);
        setCooldownEndTime(null);
        setTimeRemaining('');
        return;
      }
      
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    
    return () => clearInterval(interval);
  }, [cooldownEndTime]);
  
  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else if (prev.length < 3) {
        return [...prev, category];
      }
      return prev;
    });
  };
  
  // Generate a hint for the current fact
  const generateHint = () => {
    if (!generatedFact || generatedFact.hintRevealed || pkStars < HINT_COST) {
      return;
    }
    
    // Deduct stars for the hint
    setPkStars(pkStars - HINT_COST);
    
    // Generate a random number between 1 and 2000
    const hintNumber = Math.floor(Math.random() * 2000) + 1;
    const hint = `(see pk#${hintNumber})`;
    
    // Update the current fact with the hint
    const updatedFact = {
      ...generatedFact,
      hintRevealed: true,
      hint
    };
    
    setGeneratedFact(updatedFact);
    
    // Also update in history
    const updatedFacts = generatedFacts.map(fact => 
      fact.id === generatedFact.id ? updatedFact : fact
    );
    setGeneratedFacts(updatedFacts);
    
    toast({
      title: "Hint Revealed!",
      description: `You spent ${HINT_COST} PK stars to get a hint.`,
    });
  };
  
  // Expand the current fact with more details
  const expandFact = () => {
    if (!generatedFact || generatedFact.expanded || isExpanding) {
      return;
    }
    
    setIsExpanding(true);
    
    // Generate expanded text (in production this would call an API)
    setTimeout(() => {
      const baseText = generatedFact.text;
      const expandedText = `${baseText} ${generateExtendedContent(generatedFact.categories)}`;
      
      // Update the current fact with expanded text
      const updatedFact = {
        ...generatedFact,
        expanded: true,
        expandedText
      };
      
      setGeneratedFact(updatedFact);
      
      // Also update in history
      const updatedFacts = generatedFacts.map(fact => 
        fact.id === generatedFact.id ? updatedFact : fact
      );
      setGeneratedFacts(updatedFacts);
      
      setIsExpanding(false);
      
      toast({
        title: "Fact Expanded!",
        description: "You now have a more comprehensive explanation.",
      });
    }, 1500);
  };
  
  // Helper function to generate extended content based on categories
  const generateExtendedContent = (categories: string[]): string => {
    const expandedContentByCategory: Record<string, string[]> = {
      'Crypto': [
        "This is significant because it represents a paradigm shift in how value is transferred online without central intermediaries. The cryptographic techniques used ensure security while the decentralized ledger provides transparency.",
        "Experts in the field have noted that this demonstrates the power of cryptographic principles when applied to economic systems. The implications continue to evolve as the technology matures and adoption increases.",
        "The intersection of cryptography and economic incentives has created a new field of study that continues to challenge traditional financial systems and provide alternatives to centralized control mechanisms."
      ],
      'Web3': [
        "This development represents a key milestone in the evolution toward a truly decentralized internet, where users control their data and digital assets without relying on centralized authorities or platforms.",
        "The architecture behind this creates a more resilient and censorship-resistant framework for online interactions. Early adopters have already begun building communities around these principles.",
        "Decentralized applications built on these technologies enable new forms of coordination and value creation that weren't possible in previous iterations of the internet."
      ],
      'Science': [
        "This scientific discovery has profound implications for our understanding of natural phenomena. Multiple peer-reviewed studies have confirmed these findings, though research continues to refine our knowledge.",
        "The methodologies used to reach these conclusions represent significant advances in the field. Future applications may include practical technologies that leverage these principles in unexpected ways.",
        "Researchers working across disciplines have found that this phenomenon has wide-ranging implications that extend beyond its original field of discovery."
      ],
      'History': [
        "Historical records from multiple independent sources confirm this fascinating period of human history. The sociopolitical implications resonated for generations and continue to influence cultural development today.",
        "Archaeological evidence uncovered in recent excavations has provided additional context that helps historians better understand the full significance of these events and their lasting impact.",
        "The intersection of cultural, economic and political factors during this time created conditions that would eventually reshape entire civilizations in ways that continue to be studied."
      ]
    };
    
    // Choose a random category from the fact's categories that has expanded content available
    const availableCategories = categories.filter(cat => expandedContentByCategory[cat]);
    
    if (availableCategories.length === 0) {
      return "This fascinating fact highlights just one aspect of a complex and evolving field. Researchers and enthusiasts continue to explore related phenomena, expanding our collective knowledge and understanding of this fascinating subject.";
    }
    
    const chosenCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const expandedOptions = expandedContentByCategory[chosenCategory] || [];
    
    return expandedOptions[Math.floor(Math.random() * expandedOptions.length)] || "This fascinating fact has much deeper implications than initially apparent, connecting to broader themes and concepts within this field of study.";
  };
  
  // Generate a fact based on selected categories
  const generateFact = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "No categories selected",
        description: "Please select at least one category.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Try to fetch from LearnPool API
      let pkData: PKData[] = [];
      try {
        pkData = await fetchPKData();
      } catch (error) {
        console.error("Failed to fetch from API:", error);
        // We'll handle this with fallbacks below
      }
      
      // Filter by selected categories if we have data
      let relevantData: PKData[] = [];
      if (pkData.length > 0) {
        relevantData = pkData.filter(item => {
          // Check if any selected category matches with the item's category
          return selectedCategories.some(cat => 
            item.category && 
            (Array.isArray(item.category) ? 
              item.category.includes(cat) : 
              item.category === cat)
          );
        });
      }
      
      let factText = '';
      
      // If we have relevant data, use it
      if (relevantData.length > 0) {
        // Choose a random item from filtered data
        const randomItem = relevantData[Math.floor(Math.random() * relevantData.length)];
        factText = randomItem.submission_text || 
                   `A fascinating fact about ${selectedCategories.join(' and ')} that most people don't know.`;
      } else {
        // Fallback facts for each category
        const categoryFacts: Record<string, string[]> = {
          'Crypto': [
            "Bitcoin's creator Satoshi Nakamoto owns about 1 million bitcoins (worth billions) but has never moved them.",
            "The first commercial Bitcoin transaction was for two pizzas, now worth millions in today's value.",
            "There will only ever be 21 million Bitcoins, and the last one is projected to be mined in 2140."
          ],
          'Web3': [
            'The first NFT, "Quantum," was created by Kevin McCoy in 2014, years before the NFT boom.',
            'The Ethereum network consumes less electricity annually than YouTube or Netflix streaming.',
            'The term Web3 was coined by Ethereum co-founder Gavin Wood in 2014.'
          ],
          'Science': [
            'Octopuses have three hearts, blue blood, and neurons in their tentacles allowing them to solve problems.',
            'When you look at the night sky, some stars you see have already died, but their light is still traveling.',
            'The human body contains enough carbon to make about 900 pencils.'
          ],
          'History': [
            'Oxford University is older than the Aztec Empire, having begun teaching in 1096.',
            'Ancient Romans used crushed mouse brains as toothpaste, believing it would strengthen their teeth.',
            'The shortest war in history was between Britain and Zanzibar in 1896, lasting only 38 minutes.'
          ],
          'Geography': [
            'Russia has 11 time zones, more than any other country.',
            'Canada has more lakes than the rest of the world combined.',
            "The driest place on Earth, the Atacama Desert, has areas that haven't received rain in over 400 years."
          ],
          'Anime': [
            "Pokémon was inspired by creator Satoshi Tajiri's childhood hobby of collecting insects.",
            'Studio Ghibli\'s first film "Castle in the Sky" contains a secret "Ghibli" easter egg in Morse code.',
            'The hand-drawn anime "Akira" used 160,000+ animation cels, setting records for its time.'
          ],
          'Art': [
            'Leonardo da Vinci wrote his notes backward, requiring a mirror to read them normally.',
            'Vincent van Gogh only sold one painting during his lifetime, "The Red Vineyard," for 400 francs.',
            'The Mona Lisa has no eyebrows; it was fashionable in Renaissance Florence to shave them off.'
          ],
          'Movie': [
            'The "Wilhelm Scream" sound effect has been used in over 400 films since 1951.',
            'The original "Lion King" was inspired by Shakespeare\'s "Hamlet" and the Bible stories of Joseph and Moses.',
            'The Lord of the Rings trilogy used over 48,000 pieces of armor, weapons, and prosthetics.'
          ],
          'Business': [
            'Nintendo was founded in 1889 as a playing card company.',
            'The first item sold on eBay was a broken laser pointer for $14.83.',
            'Google was originally called "Backrub" before changing its name in 1997.'
          ],
          'AI': [
            'The term "artificial intelligence" was first coined at a conference at Dartmouth College in 1956.',
            "The first AI system to beat a world chess champion was IBM's Deep Blue against Garry Kasparov in 1997.",
            'GPT-3, released in 2020, was trained on 570GB of text data, equivalent to about 400 billion words.'
          ],
          'Books': [
            'Agatha Christie wrote her novels in the bathtub while eating apples.',
            "Stephen King's first novel \"Carrie\" was rejected 30 times before being published.",
            'The word "robot" first appeared in Karel Čapek\'s 1920 play "R.U.R." (Rossum\'s Universal Robots).'
          ]
        };
        
        // Randomly select one of the selected categories
        const chosenCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
        
        // Use facts for that category, or a generic one if we don't have specific facts
        const facts = categoryFacts[chosenCategory] || [
          `A fascinating fact about ${selectedCategories.join(' and ')} that most people don't know.`,
          `An interesting connection between ${selectedCategories.join(' and ')} that few have realized.`,
          `A surprising revelation about ${selectedCategories.join(' and ')} that will make you say "wow"!`
        ];
        
        factText = facts[Math.floor(Math.random() * facts.length)];
      }
      
      // Generate a new fact
      const newFact: GeneratedFact = {
        id: Date.now().toString(),
        text: factText,
        categories: [...selectedCategories],
        timestamp: Date.now(),
        rating: null,
        hintRevealed: false
      };
      
      // Save to history
      const updatedFacts = [newFact, ...generatedFacts];
      setGeneratedFacts(updatedFacts);
      setGeneratedFact(newFact);
      
      // Start cooldown
      setLastGeneratedTime(Date.now());
      setIsOnCooldown(true);
      setCooldownEndTime(Date.now() + COOLDOWN_PERIOD);
      
      // Reward user with 1 PK star for generating a fact
      const newStarCount = pkStars + 1;
      setPkStars(newStarCount);
      
      toast({
        title: "Fact Generated!",
        description: "Discover something new and exciting.",
      });
    } catch (error) {
      console.error("Error generating fact:", error);
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Copy fact to clipboard
  const copyToClipboard = () => {
    if (!generatedFact) return;
    
    navigator.clipboard.writeText(generatedFact.text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Fact copied successfully!",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
      });
  };
  
  // Rate a fact
  const rateFact = (rating: number) => {
    if (!generatedFact) return;
    
    // Update current fact
    setGeneratedFact({
      ...generatedFact,
      rating
    });
    
    // Update in history
    const updatedFacts = generatedFacts.map(fact => 
      fact.id === generatedFact.id ? { ...fact, rating } : fact
    );
    setGeneratedFacts(updatedFacts);
    
    toast({
      title: "Thank you for rating!",
      description: `You rated this fact ${rating}/5 stars.`,
    });
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">LearnPool Fact Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate fascinating facts from LearnPool's Public Knowledge database.
            Select up to 3 categories to discover something new!
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-950/40 p-2 rounded-full px-4 border border-yellow-200 dark:border-yellow-900/50">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-yellow-700 dark:text-yellow-400">{pkStars}</span>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Categories (max 3)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CATEGORIES.map(category => (
                  <div 
                    key={category}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                      disabled={!selectedCategories.includes(category) && selectedCategories.length >= 3}
                    />
                    <label 
                      htmlFor={`category-${category}`}
                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateFact} 
                disabled={selectedCategories.length === 0 || isGenerating || isOnCooldown}
                className="w-full"
              >
                {isGenerating ? 
                  "Generating..." : 
                  isOnCooldown ? 
                    `Cooldown: ${timeRemaining}` : 
                    "Generate Fact"}
              </Button>
            </CardFooter>
          </Card>
          
          {generatedFact && (
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Did you know?</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={copyToClipboard}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={generateHint}
                        disabled={generatedFact.hintRevealed || pkStars < HINT_COST}
                        title={`Get a hint (costs ${HINT_COST} stars)`}
                      >
                        <Lightbulb className={`h-4 w-4 ${generatedFact.hintRevealed ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed">{generatedFact.text}</p>
                  {generatedFact.expanded && generatedFact.expandedText && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Extended Explanation:</p>
                      <p className="text-base">{generatedFact.expandedText.replace(generatedFact.text, '')}</p>
                    </div>
                  )}
                  {generatedFact.hintRevealed && generatedFact.hint && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 rounded-md">
                      <p className="flex items-center text-sm text-yellow-700 dark:text-yellow-400">
                        <Lightbulb className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                        Hint: {generatedFact.hint}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {generatedFact.categories.map(cat => (
                      <span key={cat} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Rate this fact:</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => rateFact(rating)}
                          className="text-gray-300 hover:text-yellow-400 transition-colors focus:outline-none"
                          title={`${rating} star${rating !== 1 ? 's' : ''}`}
                        >
                          <Star 
                            className={`h-6 w-6 ${generatedFact.rating && generatedFact.rating >= rating ? 'text-yellow-400 fill-yellow-400' : ''}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground self-end">
                    Next fact available in: {timeRemaining}
                  </div>
                </CardFooter>
              </Card>
              
              <Button 
                className="w-full" 
                onClick={expandFact}
                disabled={generatedFact.expanded || isExpanding}
              >
                {isExpanding ? 
                  "Expanding..." : 
                  generatedFact.expanded ? 
                    "Fact Expanded" : 
                    "Expand This Fact"
                }
                {!isExpanding && !generatedFact.expanded && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Quiz;
