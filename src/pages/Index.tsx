
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, Lightbulb, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">LearnPool MCQ Generator</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Test your knowledge with dynamically generated questions from LearnPool's Public Knowledge database.
          </p>
        </header>

        <section className="max-w-4xl mx-auto mb-16">
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to challenge yourself?</CardTitle>
              <CardDescription>
                Take a quiz with questions generated from LearnPool's PK submissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link to="/quiz">
                <Button size="lg" className="text-lg px-6 py-6 gap-2">
                  Start Quiz <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Answer Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-slate-600">
                  Test your knowledge with multiple-choice questions generated from LearnPool's Public Knowledge database.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Star className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-center">Earn PK Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-slate-600">
                  Get rewarded with PK stars for correct answers. The more you know, the more stars you collect.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
                <CardTitle className="text-center">Use Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-slate-600">
                  Stuck on a question? Spend your PK stars to reveal hints that help you find the right answer.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
