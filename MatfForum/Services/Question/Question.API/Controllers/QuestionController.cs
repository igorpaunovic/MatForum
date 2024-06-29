using Microsoft.AspNetCore.Mvc;
using System;

namespace Question.API.Controllers;

[ApiController]
[Route("Questions")]
public class QuestionController(ILogger<QuestionController> logger) : ControllerBase
{
    [HttpGet(Name = "GetQuestions")]
    public IEnumerable<Question> Get()
    {
        logger.LogError("WTF");
        Question[] questions = new Question[]
            {
                new Question
                {
                    Date = DateOnly.FromDateTime(DateTime.Now),
                    Author = "Igor",
                    Content = "Ko je uopste usvojio predlog da ovaj repozitorijum nazovemo MatForum??? WTF?"
                },
                new Question
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(1)),
                    Author = "Andjela",
                    Content = "Luka i ja <333 :D"
                },
                new Question
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(2)),
                    Author = "Nikola",
                    Content = "Tugica :/..."
                },
                new Question
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(3)),
                    Author = "Djordje",
                    Content = "Vec sam smislio logo ljudi!"
                }
            };
        return questions;
    }
}
